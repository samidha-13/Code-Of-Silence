import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { TitleScreen } from "@/components/intro/TitleScreen";
import { LogoReveal } from "@/components/intro/LogoReveal";
import { TeamIdentification } from "@/components/intro/TeamIdentification";
import { InvestigationMap } from "@/components/intro/InvestigationMap";

type Phase = "title" | "logo" | "team" | "investigation";

const Index = () => {
  const [searchParams] = useSearchParams();
  const skipToMap = searchParams.get("skipIntro") === "true";
  
  const [phase, setPhase] = useState<Phase>(skipToMap ? "investigation" : "title");
  const [analystName, setAnalystName] = useState("");
  const [operatorName, setOperatorName] = useState("");
  const [timeRemaining, setTimeRemaining] = useState(3600);

  useEffect(() => {
    if (phase === "investigation") {
      const timer = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 0) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [phase]);

  const handleTeamComplete = (analyst: string, operator: string) => {
    setAnalystName(analyst);
    setOperatorName(operator);
    setPhase("investigation");
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-background">
      {phase === "title" && <TitleScreen onComplete={() => setPhase("logo")} />}
      {phase === "logo" && <LogoReveal onComplete={() => setPhase("team")} />}
      {phase === "team" && <TeamIdentification onComplete={handleTeamComplete} />}
      {phase === "investigation" && <InvestigationMap timeRemaining={timeRemaining} />}
    </main>
  );
};

export default Index;
