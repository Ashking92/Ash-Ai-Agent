
import { MainLayout } from "@/components/layout/MainLayout";
import VoiceAssistant from "@/components/voice/VoiceAssistant";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Globe } from "lucide-react";

const Index = () => {
  // ElevenLabs API Key and Agent ID
  const apiKey = "sk_aa411f2193444210a029eaa80ed22864d3928c3d22bd324a";
  const agentId = "vOT8ib1IlJTnHikNtiN7";
  
  const [language, setLanguage] = useState<'english' | 'hindi'>('hindi');

  return (
    <MainLayout>
      <div className="flex flex-col items-center min-h-[80vh] justify-center bg-gradient-to-b from-indigo-50 via-purple-50 to-pink-50 py-8">
        <section className="text-center mb-6">
          <h1 className="text-4xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-500">
            {language === 'hindi' ? 'दादी माँ AI' : 'Grand AI'}
          </h1>
          <p className="text-lg max-w-xs mx-auto text-gray-600">
            {language === 'hindi' ? 'आपका सहायक और आपका मित्र' : 'Your assistant and Your friend'}
          </p>
          
          {/* Language Toggle */}
          <div className="flex items-center justify-center mt-4">
            <div className="flex items-center bg-white/50 p-1 rounded-full border border-purple-100">
              <Globe size={16} className="text-purple-500 mx-2" />
              <ToggleGroup type="single" value={language} onValueChange={(val) => val && setLanguage(val as 'english' | 'hindi')}>
                <ToggleGroupItem value="english" className="text-sm rounded-full px-3 py-1">
                  English
                </ToggleGroupItem>
                <ToggleGroupItem value="hindi" className="text-sm rounded-full px-3 py-1">
                  हिंदी
                </ToggleGroupItem>
              </ToggleGroup>
            </div>
          </div>
        </section>

        <section className="w-full max-w-lg px-4">
          <div className="bg-white/40 backdrop-blur-sm rounded-xl shadow-lg overflow-hidden border border-purple-100">
            <div className="py-3 px-4 bg-gradient-to-r from-purple-500 to-blue-500 text-white flex items-center">
              <span className="text-sm font-medium">
                {language === 'hindi' ? 'इंटरएक्टिव डेमो' : 'Interactive Demo'}
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
            <p className="text-sm text-gray-500">
              {language === 'hindi' 
                ? 'हमारी आवाज सहायक तकनीक का स्वयं अनुभव करें। प्रश्न पूछें, जानें कि यह कैसे काम करता है, या सुविधाओं का अन्वेषण करें।' 
                : 'Experience our voice assistant technology firsthand. Ask questions, learn how it works, or explore features.'}
            </p>
          </div>
        </section>
      </div>
    </MainLayout>
  );
};

export default Index;
