
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
  language: 'english' | 'hindi';
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

const VoiceAssistant = ({ agentId, apiKey, className, language = 'english' }: VoiceAssistantProps) => {
  const [subtitleText, setSubtitleText] = useState('');
  const [userMessage, setUserMessage] = useState('');
  const [chatHistory, setChatHistory] = useState<Message[]>([]);
  const [streamingText, setStreamingText] = useState('');
  const [currentEmotion, setCurrentEmotion] = useState('neutral');
  const [isMuted, setIsMuted] = useState(false);

  // Set language-based interface text
  useEffect(() => {
    setSubtitleText(language === 'hindi' ? 'बात करने के लिए माइक पर क्लिक करें' : 'Press the microphone to talk');
  }, [language]);

  // Use the conversation hook from @11labs/react
  const conversation = useConversation({
    onConnect: () => {
      console.log('Connected to ElevenLabs');
      setSubtitleText(language === 'hindi' ? 'कनेक्ट हो गया। आपके प्रश्न का इंतज़ार है...' : 'Connected. Waiting for your query...');
    },
    onDisconnect: () => {
      console.log('Disconnected from ElevenLabs');
      setSubtitleText(language === 'hindi' ? 'बातचीत समाप्त हुई' : 'Conversation ended');
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
            
            setSubtitleText(language === 'hindi' ? 'सुन रहा हूँ...' : 'Listening...');
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
              setSubtitleText(language === 'hindi' ? 'मैं और कैसे मदद कर सकता हूँ?' : 'What else can I help you with?');
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
      setSubtitleText('Error: ' + (error && typeof error === 'object' && 'message' in error ? error.message : language === 'hindi' ? 'कोई त्रुटि हुई' : 'An error occurred'));
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
      setSubtitleText(language === 'hindi' ? 'त्रुटि: माइक्रोफोन तक पहुंच नहीं मिल सकी' : 'Error: Could not access the microphone');
    }
  }, [conversation, agentId, language]);

  const stopConversation = useCallback(async () => {
    await conversation.endSession();
    setSubtitleText(language === 'hindi' ? 'बातचीत समाप्त हुई' : 'Conversation ended');
  }, [conversation, language]);

  const toggleMute = useCallback(() => {
    if (conversation.status === 'connected') {
      conversation.setVolume({ volume: isMuted ? 1.0 : 0.0 });
      setIsMuted(!isMuted);
    }
  }, [conversation, isMuted]);

  return (
    <div className={`voice-assistant-container flex flex-col items-center ${className || ''}`}>
      <div className="w-full max-w-xl mx-auto flex flex-col items-center space-y-6 bg-gradient-to-br from-purple-50 to-blue-50 rounded-xl p-6 shadow-lg border border-purple-100">
        {/* AI Character with emotions */}
        <div className="flex flex-col items-center justify-center mb-2">
          <div className="text-7xl mb-2">
            {conversation.status === 'connected'
              ? emotionEmojis[currentEmotion] || '😊'
              : '🤖'}
          </div>
          <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-500">
            {language === 'hindi' ? 'दादी माँ AI' : 'Grand AI'}
          </h2>
        </div>
        
        {/* Controls with gradient styling */}
        <div className="flex items-center justify-center gap-4">
          {/* Microphone button with purple gradient */}
          <button 
            className={`w-20 h-20 rounded-full flex items-center justify-center transition-all duration-300 
              ${conversation.status === 'connected' 
                ? 'bg-gradient-to-r from-red-500 to-pink-500' 
                : 'bg-gradient-to-r from-purple-500 to-blue-500'} 
              text-white shadow-lg hover:scale-105 relative`}
            onClick={conversation.status === 'connected' ? stopConversation : startConversation}
            aria-label={conversation.status === 'connected' ? "Stop conversation" : "Start conversation"}
          >
            {/* Glow effect */}
            <div className="absolute inset-0 rounded-full blur-md opacity-30 bg-purple-500"></div>
            
            <div className="relative z-10">
              {conversation.status === 'connected' ? <MicOff size={30} /> : <Mic size={30} />}
            </div>
          </button>
          
          {/* Volume control button */}
          {conversation.status === 'connected' && (
            <button 
              className="w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 
                bg-gradient-to-r from-blue-400 to-cyan-400 text-white shadow-md hover:scale-105"
              onClick={toggleMute}
              aria-label={isMuted ? "Unmute" : "Mute"}
            >
              {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
            </button>
          )}
        </div>
        
        {/* Current message/subtitle display with cleaner styling */}
        <div className="w-full text-center">
          <p className="text-lg font-medium text-gray-700 py-2 px-4 rounded-lg bg-white/50 border border-purple-100">
            {subtitleText || (language === 'hindi' ? 'बात करने के लिए माइक पर क्लिक करें' : 'Press the microphone to talk')}
          </p>
        </div>

        {/* Status indicators with updated styling */}
        <div className="flex items-center justify-center space-x-6 text-sm mt-2">
          <div className="flex items-center">
            <span className={`w-2 h-2 rounded-full mr-2 ${conversation.status === 'connected' ? 'bg-green-500' : 'bg-gray-400'}`}></span>
            <span className="text-gray-600">
              {language === 'hindi' ? 'आवाज़ ' + (conversation.status === 'connected' ? 'चालू' : 'बंद') : 'Voice ' + (conversation.status === 'connected' ? 'enabled' : 'disabled')}
            </span>
          </div>
          <div className="flex items-center">
            <span className="text-gray-600">{language === 'hindi' ? 'AI द्वारा संचालित' : 'AI powered'}</span>
          </div>
        </div>
        
        {/* Chat history with emotion display */}
        {chatHistory.length > 0 && (
          <div className="w-full bg-white/70 rounded-lg p-4 mt-2 max-h-[250px] overflow-y-auto border border-purple-100 shadow-inner">
            <div className="flex flex-col space-y-4">
              {chatHistory.map((msg, index) => (
                <div 
                  key={index} 
                  className={`px-3 py-2 rounded-lg ${
                    msg.isUser 
                      ? 'bg-gradient-to-r from-blue-100 to-blue-50 ml-auto' 
                      : 'bg-gradient-to-r from-purple-100 to-purple-50'
                  } max-w-[80%] border border-blue-100 shadow-sm`}
                >
                  {!msg.isUser && msg.emotion && (
                    <div className="text-lg mb-1">{emotionEmojis[msg.emotion]}</div>
                  )}
                  <p className="text-gray-700">{msg.text}</p>
                  <span className="text-xs text-gray-400">
                    {msg.isUser 
                      ? (language === 'hindi' ? 'आप' : 'You') 
                      : (language === 'hindi' ? 'दादी माँ AI' : 'Grand AI')} 
                    · {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              ))}
            </div>
            
            {/* Streaming text display with emotion */}
            {streamingText && (
              <div className="px-3 py-2 rounded-lg bg-gradient-to-r from-purple-100 to-purple-50 text-gray-700 mt-4 border border-purple-100 shadow-sm">
                <div className="text-lg mb-1">{emotionEmojis[currentEmotion]}</div>
                <p>{streamingText}</p>
                <span className="text-xs text-gray-400">
                  {language === 'hindi' ? 'दादी माँ AI · टाइप कर रही है...' : 'Grand AI · typing...'}
                </span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default VoiceAssistant;
