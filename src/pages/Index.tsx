
import { MainLayout } from "@/components/layout/MainLayout";
import VoiceAssistant from "@/components/voice/VoiceAssistant";

const Index = () => {
  // ElevenLabs API Key and Agent ID
  const apiKey = "sk_aa411f2193444210a029eaa80ed22864d3928c3d22bd324a";
  const agentId = "vOT8ib1IlJTnHikNtiN7";
  
  return (
    <MainLayout>
      <div className="flex flex-col items-center min-h-[100vh] justify-center py-0">
        <section className="w-full max-w-md">
          <VoiceAssistant 
            agentId={agentId} 
            apiKey={apiKey} 
            className="p-0" 
          />
        </section>
      </div>
    </MainLayout>
  );
};

export default Index;
