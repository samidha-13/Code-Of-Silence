import { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface GameContextType {
  timeRemaining: number;
  puzzleSolved: boolean;
  setPuzzleSolved: (solved: boolean) => void;
  websiteUrl: string;
  setWebsiteUrl: (url: string) => void;
  resetGame: () => void;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

const GAME_DURATION = 3600; // 60 minutes in seconds
const DEFAULT_WEBSITE_URL = "https://code-of-silence-unlocked-53719-03265-76-72740.lovable.app";

export const GameProvider = ({ children }: { children: ReactNode }) => {
  const [gameStartTime, setGameStartTime] = useState<number>(() => {
    const saved = localStorage.getItem("gameStartTime");
    return saved ? parseInt(saved) : Date.now();
  });

  const [puzzleSolved, setPuzzleSolvedState] = useState<boolean>(() => {
    const saved = localStorage.getItem("puzzleSolved");
    return saved === "true";
  });

  const [websiteUrl, setWebsiteUrlState] = useState<string>(() => {
    const saved = localStorage.getItem("websiteUrl");
    return saved || DEFAULT_WEBSITE_URL;
  });

  const [timeRemaining, setTimeRemaining] = useState<number>(() => {
    const elapsed = Math.floor((Date.now() - gameStartTime) / 1000);
    return Math.max(0, GAME_DURATION - elapsed);
  });

  useEffect(() => {
    localStorage.setItem("gameStartTime", gameStartTime.toString());
  }, [gameStartTime]);

  useEffect(() => {
    const timer = setInterval(() => {
      const elapsed = Math.floor((Date.now() - gameStartTime) / 1000);
      const remaining = Math.max(0, GAME_DURATION - elapsed);
      setTimeRemaining(remaining);

      if (remaining <= 0) {
        clearInterval(timer);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [gameStartTime]);

  const setPuzzleSolved = (solved: boolean) => {
    setPuzzleSolvedState(solved);
    localStorage.setItem("puzzleSolved", solved.toString());
  };

  const setWebsiteUrl = (url: string) => {
    setWebsiteUrlState(url);
    localStorage.setItem("websiteUrl", url);
  };

  const resetGame = () => {
    const newStartTime = Date.now();
    setGameStartTime(newStartTime);
    setPuzzleSolvedState(false);
    setWebsiteUrlState(DEFAULT_WEBSITE_URL);
    localStorage.setItem("gameStartTime", newStartTime.toString());
    localStorage.setItem("puzzleSolved", "false");
    localStorage.setItem("websiteUrl", DEFAULT_WEBSITE_URL);
  };

  return (
    <GameContext.Provider value={{ timeRemaining, puzzleSolved, setPuzzleSolved, websiteUrl, setWebsiteUrl, resetGame }}>
      {children}
    </GameContext.Provider>
  );
};

export const useGame = () => {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error("useGame must be used within a GameProvider");
  }
  return context;
};
