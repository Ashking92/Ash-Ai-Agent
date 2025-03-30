
import { useCallback, useState, useEffect } from 'react';
import { Mic, MicOff, VolumeX, Volume2 } from 'lucide-react';
import { useConversation } from '@11labs/react';

interface Message {
  text: string;
  isUser: boolean;
  timestamp: Date;
  emotion?: string;
}

interface VoiceAssistantProps {
  agentId: string;
  apiKey: string;
  className?: string;
}

const emotionEmojis: Record<string, string> = {
  happy: '😊',
  sad: '😢',
  excited: '😃',
  neutral: '😐',
  thoughtful: '🤔',
  caring: '🥰',
  surprised: '😮',
};

const getRandomEmotion = () => {
  const emotions = Object.keys(emotionEmojis);
  return emotions[Math.floor(Math.random() * emotions.length)];
};

const VoiceAssistant = ({ agentId, apiKey, className }: VoiceAssistantProps) => {
  const [subtitleText, setSubtitleText] = useState('');
  const [userMessage, setUserMessage] = useState('');
  const [chatHistory, setChatHistory] = useState<Message[]>([]);
  const [streamingText, setStreamingText] = useState('');
  const [currentEmotion, setCurrentEmotion] = useState('neutral');
  const [isMuted, setIsMuted] = useState(false);

  // Use the conversation hook from @11labs/react
  const conversation = useConversation({
    onConnect: () => {
      console.log('Connected to ElevenLabs');
      setSubtitleText('Ask me anything...');
    },
    onDisconnect: () => {
      console.log('Disconnected from ElevenLabs');
      setSubtitleText('Conversation ended');
      setStreamingText('');
    },
    onMessage: (message) => {
      console.log('Message received:', message);
      
      // Handle different message types based on the ElevenLabs API structure
      if (typeof message === 'object' && message !== null) {
        if ('type' in message) {
          const typedMessage = message as any; // Type assertion for flexibility
          
          if (typedMessage.type === 'agentResponse') {
            // Set a random emotion for the AI response
            const emotion = getRandomEmotion();
            setCurrentEmotion(emotion);
            
            // Update streaming text for real-time display
            setStreamingText(prev => prev + (typedMessage.text || ''));
            setSubtitleText(typedMessage.text || '');
          } 
          else if (typedMessage.type === 'transcription') {
            const transcribedText = typedMessage.text || '';
            setUserMessage(transcribedText);
            
            // Add user message to chat history
            if (transcribedText) {
              setChatHistory(prev => [...prev, {
                text: transcribedText,
                isUser: true,
                timestamp: new Date()
              }]);
            }
            
            setSubtitleText('Listening...');
          } 
          else if (typedMessage.type === 'agentResponseFinished') {
            // Add assistant response to chat history with emotion
            setChatHistory(prev => [...prev, {
              text: streamingText,
              isUser: false,
              timestamp: new Date(),
              emotion: currentEmotion
            }]);
            
            // Reset streaming text
            setStreamingText('');
            
            setTimeout(() => {
              setSubtitleText('What else can I help you with?');
            }, 1000);
          }
        } 
        else if ('message' in message) {
          // Handle standard message format
          const messageStr = typeof message.message === 'string' ? message.message : '';
          setSubtitleText(messageStr);
        }
      }
    },
    onError: (error) => {
      console.error('Error in conversation:', error);
      setSubtitleText('Error: ' + (error && typeof error === 'object' && 'message' in error ? (error as any).message : 'An error occurred'));
    }
  });

  const startConversation = useCallback(async () => {
    try {
      await navigator.mediaDevices.getUserMedia({ audio: true });
      
      await conversation.startSession({
        agentId: agentId,
      });
      
      console.log("Conversation started with agentId:", agentId);
    } catch (error) {
      console.error('Could not start the conversation:', error);
      setSubtitleText('Error: Could not access the microphone');
    }
  }, [conversation, agentId]);

  const stopConversation = useCallback(async () => {
    await conversation.endSession();
    setSubtitleText('Conversation ended');
  }, [conversation]);

  const toggleMute = useCallback(() => {
    if (conversation.status === 'connected') {
      conversation.setVolume({ volume: isMuted ? 1.0 : 0.0 });
      setIsMuted(!isMuted);
    }
  }, [conversation, isMuted]);

  return (
    <div className={`voice-assistant-container flex flex-col items-center ${className || ''}`}>
      <div className="w-full max-w-xl mx-auto flex flex-col items-center min-h-[600px] bg-black/95 rounded-3xl overflow-hidden relative">
        {/* Blue glowing circle similar to the reference */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-56 h-56 rounded-full border-2 border-blue-400/60 flex items-center justify-center">
          <div className="absolute inset-0 rounded-full blur-md bg-blue-600/10"></div>
          <div className="w-48 h-48 rounded-full border border-blue-400/40 flex items-center justify-center animate-pulse">
            <div className="w-40 h-40 rounded-full border border-blue-300/30 flex items-center justify-center">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-500/20 to-blue-600/10 backdrop-blur-sm flex items-center justify-center text-blue-300">
                {streamingText ? (
                  <div className="animate-pulse">{emotionEmojis[currentEmotion]}</div>
                ) : null}
              </div>
            </div>
          </div>
        </div>

        {/* Header with back button */}
        <div className="w-full p-4 flex items-center justify-between text-white">
          <button className="p-2">
            <Mic size={18} />
          </button>
          <div className="text-sm font-medium">Speaking to Ash</div>
          <button className="p-2">
            <span className="w-1 h-1 bg-white rounded-full mx-0.5 inline-block"></span>
            <span className="w-1 h-1 bg-white rounded-full mx-0.5 inline-block"></span>
            <span className="w-1 h-1 bg-white rounded-full mx-0.5 inline-block"></span>
          </button>
        </div>

        {/* Current subtitle text */}
        <div className="w-full p-4 text-center mt-auto mb-12">
          <div className="text-white/90 text-sm font-light">
            {subtitleText || 'Tap to speak'}
          </div>
        </div>

        {/* Microphone button */}
        <div className="w-full p-4 flex items-center justify-center gap-6 mb-12">
          <button 
            className="w-14 h-14 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 border border-gray-700"
            onClick={conversation.status === 'connected' ? stopConversation : startConversation}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="8" y="2" width="8" height="20" rx="2" ry="2" fill="currentColor" />
            </svg>
          </button>
          <button 
            className="w-18 h-18 rounded-full bg-gray-800 flex items-center justify-center text-white border border-gray-700"
            onClick={conversation.status === 'connected' ? stopConversation : startConversation}
          >
            {conversation.status === 'connected' ? <MicOff size={30} /> : <Mic size={30} />}
          </button>
          <button 
            className="w-14 h-14 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 border border-gray-700"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default VoiceAssistant;
