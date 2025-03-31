
import { MainLayout } from "@/components/layout/MainLayout";
import VoiceAssistant from "@/components/voice/VoiceAssistant";

const Index = () => {
  // ElevenLabs API Key and Agent ID
  const apiKey = "sk_aa411f2193444210a029eaa80ed22864d3928c3d22bd324a";
  const agentId = "vOT8ib1IlJTnHikNtiN7";
  
  return (
    <MainLayout>
      <div className="flex flex-col items-center min-h-[100vh] justify-center py-0">
        <div className="w-full max-w-2xl">
          <h1 className="text-3xl font-bold mb-8 text-center text-blue-400">Ash AI Assistant</h1>
          <VoiceAssistant 
            agentId={agentId} 
            apiKey={apiKey} 
            className="p-0" 
          />
          <p className="text-center text-gray-400 mt-8">
            Powered by ElevenLabs AI Voice Technology
          </p>
        </div>
      </div>
    </MainLayout>
  );
};

export default Index;
