
import { useCallback, useState, useEffect } from 'react';
import { Mic, MicOff, Volume2, VolumeX, Power, X } from 'lucide-react';
import { useConversation } from '@11labs/react';
import { Button } from '../ui/button';

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
  const [isPoweredOn, setIsPoweredOn] = useState(true);
  const [isActive, setIsActive] = useState(false);

  const conversation = useConversation({
    onConnect: () => {
      console.log('Connected to ElevenLabs');
      setIsActive(true);
      setSubtitleText('Ask me anything...');
    },
    onDisconnect: () => {
      console.log('Disconnected from ElevenLabs');
      setSubtitleText('Conversation ended');
      setStreamingText('');
      setIsActive(false);
    },
    onMessage: (message) => {
      console.log('Message received:', message);
      
      if (typeof message === 'object' && message !== null) {
        if ('type' in message) {
          const typedMessage = message as any;
          
          if (typedMessage.type === 'agentResponse') {
            const emotion = getRandomEmotion();
            setCurrentEmotion(emotion);
            
            setStreamingText(prev => prev + (typedMessage.text || ''));
            setSubtitleText(typedMessage.text || '');
          } 
          else if (typedMessage.type === 'transcription') {
            const transcribedText = typedMessage.text || '';
            setUserMessage(transcribedText);
            
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
            setChatHistory(prev => [...prev, {
              text: streamingText,
              isUser: false,
              timestamp: new Date(),
              emotion: currentEmotion
            }]);
            
            setStreamingText('');
            
            setTimeout(() => {
              setSubtitleText('What else can I help you with?');
            }, 1000);
          }
        } 
        else if ('message' in message) {
          const messageStr = typeof message.message === 'string' ? message.message : '';
          setSubtitleText(messageStr);
        }
      }
    },
    onError: (error) => {
      console.error('Error in conversation:', error);
      
      // Safely handle null error case
      let errorMessage = 'An unexpected error occurred';
      
      if (error !== null) {
        if (typeof error === 'object') {
          if ('message' in error) {
            const messageValue = (error as { message: unknown }).message;
            errorMessage = messageValue ? String(messageValue) : errorMessage;
          }
        } else if (typeof error === 'string') {
          errorMessage = error;
        }
      }
      
      setSubtitleText(`Error: ${errorMessage}`);
    }
  });

  const startConversation = useCallback(async () => {
    if (!isPoweredOn) return;
    
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
  }, [conversation, agentId, isPoweredOn]);

  // Auto-start conversation when powered on
  useEffect(() => {
    if (isPoweredOn && !isActive) {
      startConversation();
    }
  }, [isPoweredOn, isActive, startConversation]);

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

  const togglePower = useCallback(() => {
    if (isPoweredOn) {
      stopConversation();
    } else {
      setIsPoweredOn(true); // This will trigger the useEffect to start the conversation
    }
    setIsPoweredOn(!isPoweredOn);
  }, [isPoweredOn, stopConversation]);

  return (
    <div className={`voice-assistant-container flex flex-col items-center ${className || ''}`}>
      <div className="w-full max-w-xl mx-auto flex flex-col items-center min-h-[600px] bg-black/95 rounded-3xl overflow-hidden relative">
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-72 h-72 rounded-full border border-blue-400/30 flex items-center justify-center">
          {isPoweredOn && (
            <>
              <div className={`w-64 h-64 rounded-full ${isActive ? 'bg-gradient-to-b from-blue-400/20 to-blue-600/50' : 'bg-blue-900/20'} flex items-center justify-center`}>
                {conversation.isSpeaking ? (
                  <div className="w-52 h-52 rounded-full bg-gradient-to-b from-blue-300 to-blue-600 animate-pulse flex items-center justify-center overflow-hidden">
                    <div className="text-white text-center p-4 max-w-full overflow-hidden">
                      {streamingText ? streamingText : subtitleText}
                    </div>
                  </div>
                ) : (
                  <div className="w-52 h-52 rounded-full bg-gradient-to-b from-blue-400/40 to-blue-600/70 flex items-center justify-center overflow-hidden">
                    <div className="text-white/90 text-center p-4 max-w-full overflow-hidden text-sm">
                      {subtitleText || 'Tap to speak'}
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
          {!isPoweredOn && (
            <div className="w-52 h-52 rounded-full bg-gray-800/50 flex items-center justify-center">
              <div className="text-gray-400">Powered Off</div>
            </div>
          )}
        </div>

        <div className="w-full p-4 flex items-center justify-center gap-5 mt-auto mb-12">
          <button 
            className="w-14 h-14 rounded-full bg-gray-800 flex items-center justify-center text-white border border-gray-700 hover:bg-gray-700 transition-colors"
            onClick={togglePower}
            aria-label={isPoweredOn ? "Shut down" : "Power on"}
          >
            <Power size={24} className={isPoweredOn ? "text-red-500" : "text-green-500"} />
          </button>
          
          <button 
            className={`w-14 h-14 rounded-full bg-gray-800 flex items-center justify-center text-white border border-gray-700 hover:bg-gray-700 transition-colors ${!isPoweredOn ? 'opacity-50 cursor-not-allowed' : ''}`}
            onClick={toggleMute}
            disabled={!isPoweredOn || conversation.status !== 'connected'}
            aria-label={isMuted ? "Unmute" : "Mute"}
          >
            {isMuted ? <VolumeX size={24} /> : <Volume2 size={24} />}
          </button>
          
          <button 
            className={`w-14 h-14 rounded-full bg-gray-800 flex items-center justify-center text-white border border-gray-700 hover:bg-gray-700 transition-colors ${!isPoweredOn || conversation.status !== 'connected' ? 'opacity-50 cursor-not-allowed' : ''}`}
            onClick={stopConversation}
            disabled={!isPoweredOn || conversation.status !== 'connected'}
            aria-label="End conversation"
          >
            <X size={24} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default VoiceAssistant;
