import { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface GameContextType {
  timeRemaining: number;
  puzzleSolved: boolean;
  setPuzzleSolved: (solved: boolean) => void;
  resetGame: () => void;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

const GAME_DURATION = 3600; // 60 minutes in seconds

export const GameProvider = ({ children }: { children: ReactNode }) => {
  const [gameStartTime, setGameStartTime] = useState<number>(() => {
    const saved = localStorage.getItem("gameStartTime");
    return saved ? parseInt(saved) : Date.now();
  });

  const [puzzleSolved, setPuzzleSolvedState] = useState<boolean>(() => {
    const saved = localStorage.getItem("puzzleSolved");
    return saved === "true";
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

  const resetGame = () => {
    const newStartTime = Date.now();
    setGameStartTime(newStartTime);
    setPuzzleSolvedState(false);
    localStorage.setItem("gameStartTime", newStartTime.toString());
    localStorage.setItem("puzzleSolved", "false");
  };

  return (
    <GameContext.Provider value={{ timeRemaining, puzzleSolved, setPuzzleSolved, resetGame }}>
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
