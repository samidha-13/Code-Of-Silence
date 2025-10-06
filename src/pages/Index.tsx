import { useState } from "react";
import { CoverLoadingScreen } from "@/components/intro/CoverLoadingScreen";
import { CoverMapReveal } from "@/components/intro/CoverMapReveal";

type Phase = "loading" | "map";

const Index = () => {
  const [phase, setPhase] = useState<Phase>("loading");

  return (
    <main className="relative min-h-screen overflow-hidden bg-background">
      {phase === "loading" && <CoverLoadingScreen onComplete={() => setPhase("map")} />}
      {phase === "map" && <CoverMapReveal />}
    </main>
  );
};

export default Index;
