
import { MainLayout } from "@/components/layout/MainLayout";
import VoiceAssistant from "@/components/voice/VoiceAssistant";
import { useState } from "react";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Globe } from "lucide-react";

const Index = () => {
  // ElevenLabs API Key and Agent ID
  const apiKey = "sk_aa411f2193444210a029eaa80ed22864d3928c3d22bd324a";
  const agentId = "vOT8ib1IlJTnHikNtiN7";
  
  const [language, setLanguage] = useState<'english' | 'hindi'>('hindi');

  return (
    <MainLayout>
      <div className="flex flex-col items-center min-h-[80vh] justify-center py-8">
        <section className="text-center mb-6">
          <h1 className="text-4xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-cyan-300">
            Ash
          </h1>
          <p className="text-lg max-w-xs mx-auto text-blue-200">
            {language === 'hindi' ? 'आपका सहायक और आपका मित्र' : 'Your assistant and friend'}
          </p>
          
          {/* Language Toggle */}
          <div className="flex items-center justify-center mt-4">
            <div className="flex items-center bg-blue-900/30 p-1 rounded-full border border-blue-500/30">
              <Globe size={16} className="text-blue-400 mx-2" />
              <ToggleGroup type="single" value={language} onValueChange={(val) => val && setLanguage(val as 'english' | 'hindi')}>
                <ToggleGroupItem value="english" className="text-sm rounded-full px-3 py-1 data-[state=on]:bg-blue-700 data-[state=on]:text-white">
                  English
                </ToggleGroupItem>
                <ToggleGroupItem value="hindi" className="text-sm rounded-full px-3 py-1 data-[state=on]:bg-blue-700 data-[state=on]:text-white">
                  हिंदी
                </ToggleGroupItem>
              </ToggleGroup>
            </div>
          </div>
        </section>

        <section className="w-full max-w-lg px-4">
          <div className="bg-black/60 backdrop-blur-sm rounded-xl shadow-lg overflow-hidden border border-blue-500/30">
            <div className="py-3 px-4 bg-gradient-to-r from-blue-700 to-cyan-700 text-white flex items-center">
              <span className="text-sm font-medium">
                {language === 'hindi' ? 'सहायक' : 'Assistant'}
              </span>
            </div>
            <VoiceAssistant 
              agentId={agentId} 
              apiKey={apiKey} 
              className="p-6" 
              language={language}
            />
          </div>
          
          <div className="mt-4 text-center">
            <p className="text-sm text-blue-300">
              {language === 'hindi' 
                ? 'माइक पर क्लिक करके Ash से बात करें। Ash हिंदी और अंग्रेजी दोनों समझ सकता है।' 
                : 'Click the microphone to talk with Ash. Ash understands both Hindi and English.'}
            </p>
          </div>
        </section>
      </div>
    </MainLayout>
  );
};

export default Index;
