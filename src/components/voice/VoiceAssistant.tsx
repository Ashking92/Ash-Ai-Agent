
import { useCallback, useState, useEffect } from 'react';
import { Mic, MicOff, Volume2, VolumeX, Power, X } from 'lucide-react';
import { useConversation } from '@11labs/react';
import { Button } from '../ui/button';
import AiModel from './AiModel';

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
    onError: (error: unknown) => {
      console.error('Error in conversation:', error);
      
      // Safe error handling with comprehensive null and type checks
      let errorMessage = 'An unexpected error occurred';
      
      if (error !== null && error !== undefined) {
        if (typeof error === 'object') {
          const errorObj = error as Record<string, unknown>;
          if (errorObj && 'message' in errorObj && errorObj.message) {
            errorMessage = String(errorObj.message);
          } else if (errorObj && 'toString' in errorObj && typeof errorObj.toString === 'function') {
            errorMessage = errorObj.toString();
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
      <div className="w-full max-w-xl mx-auto flex flex-col items-center min-h-[600px] bg-gradient-to-b from-black/95 to-blue-950/90 rounded-3xl overflow-hidden relative">
        {/* 3D AI Model - enhanced visibility */}
        <div className="absolute inset-0 flex items-center justify-center z-10">
          {isPoweredOn ? (
            <div className="w-full h-[400px] p-4">
              <AiModel 
                isSpeaking={conversation.isSpeaking} 
                emotion={currentEmotion}
              />
            </div>
          ) : (
            <div className="text-gray-400 text-2xl">Powered Off</div>
          )}
        </div>
        
        {/* Subtitles area - ensure it's above the model */}
        <div className="w-full absolute bottom-32 flex justify-center z-20">
          <div className="bg-black/50 backdrop-blur-sm rounded-xl px-6 py-3 text-center max-w-md">
            <p className="text-white">{subtitleText}</p>
          </div>
        </div>

        {/* Controls - ensure they're above the model */}
        <div className="w-full p-4 flex items-center justify-center gap-5 mt-auto mb-12 z-20">
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
