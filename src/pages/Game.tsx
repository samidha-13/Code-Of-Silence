import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

interface RoomInfo {
  order: number;
  description: string;
}

const roomDatabase: Record<string, RoomInfo> = {
  "dr verma room": {
    order: 1,
    description: "Start here.",
  },
  "research lab": {
    order: 2,
    description: "Continue your investigation.",
  },
  "personal archive lab": {
    order: 3,
    description: "Secrets are hidden here.",
  },
  "server room": {
    order: 4,
    description: "Final destination.",
  },
};

const Game = () => {
  const [roomName, setRoomName] = useState("");
  const [result, setResult] = useState<{ found: boolean; info?: RoomInfo } | null>(null);

  const handleCheck = () => {
    const normalized = roomName.toLowerCase().trim();
    const info = roomDatabase[normalized];
    
    if (info) {
      setResult({ found: true, info });
    } else {
      setResult({ found: false });
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleCheck();
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(139,0,0,0.1)_0%,_transparent_70%)]" />
      <div className="absolute inset-0 animate-scanlines opacity-20" />
      
      {/* Back Button */}
      <Link to="/" className="fixed top-8 left-8 z-20">
        <Button
          variant="outline"
          className="h-12 px-6 font-display font-bold bg-black/80 border-red-900/70 text-white hover:bg-red-900/20 hover:border-red-600"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back
        </Button>
      </Link>
      
      {/* Content */}
      <div className="relative z-10 max-w-2xl w-full">
        {/* Title */}
        <h1 className="font-display text-5xl md:text-6xl font-bold text-center mb-12 text-white">
          🔎 Enter the Room Name
          <div 
            className="h-1 w-32 mx-auto mt-4 rounded-full"
            style={{
              background: "linear-gradient(90deg, transparent, hsl(0 100% 50%), transparent)",
              boxShadow: "0 0 20px hsl(0 100% 50%)",
            }}
          />
        </h1>

        {/* Input Section */}
        <div className="bg-black/60 backdrop-blur-sm border-2 border-red-900/50 rounded-lg p-8 shadow-glow-red">
          <div className="space-y-6">
            <div className="relative">
              <Input
                type="text"
                placeholder="Type room name here..."
                value={roomName}
                onChange={(e) => setRoomName(e.target.value)}
                onKeyPress={handleKeyPress}
                className="h-14 text-lg font-body bg-black/80 border-red-900/70 text-white placeholder:text-white/40 focus:border-red-600 focus:ring-red-600/50"
              />
              <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-red-500/70" />
            </div>

            <Button
              onClick={handleCheck}
              className="w-full h-14 text-lg font-display font-bold bg-gradient-to-r from-red-900 to-red-700 hover:from-red-800 hover:to-red-600 text-white border-2 border-red-600/50 shadow-lg"
              style={{
                boxShadow: "0 0 30px rgba(220, 38, 38, 0.3)",
              }}
            >
              Check Order
            </Button>
          </div>

          {/* Result Display */}
          {result && (
            <div className="mt-8 animate-fade-in">
              {result.found && result.info ? (
                <div 
                  className="p-6 rounded-lg border-2"
                  style={{
                    backgroundColor: "rgba(0, 100, 0, 0.1)",
                    borderColor: "hsl(120 100% 40%)",
                    boxShadow: "0 0 30px rgba(0, 255, 0, 0.2)",
                  }}
                >
                  <div className="text-center">
                    <div 
                      className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-4 font-display text-3xl font-bold"
                      style={{
                        backgroundColor: "rgba(0, 150, 0, 0.2)",
                        border: "2px solid hsl(120 100% 40%)",
                        color: "hsl(120 100% 50%)",
                        boxShadow: "0 0 20px rgba(0, 255, 0, 0.3)",
                      }}
                    >
                      {result.info.order}
                    </div>
                    <h3 className="font-display text-2xl font-bold mb-2" style={{ color: "hsl(120 100% 50%)" }}>
                      Room {result.info.order}
                    </h3>
                    <p className="font-body text-white/90 text-lg">
                      {result.info.description}
                    </p>
                  </div>
                </div>
              ) : (
                <div 
                  className="p-6 rounded-lg border-2 text-center"
                  style={{
                    backgroundColor: "rgba(139, 0, 0, 0.1)",
                    borderColor: "hsl(0 100% 40%)",
                    boxShadow: "0 0 30px rgba(255, 0, 0, 0.2)",
                  }}
                >
                  <div className="text-5xl mb-3">❌</div>
                  <p className="font-display text-xl font-bold" style={{ color: "hsl(0 100% 50%)" }}>
                    Unknown room. Try again.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Hint Text */}
        <p className="text-center mt-6 text-white/50 font-body text-sm">
          Hint: Check your investigation notes for exact room names
        </p>
      </div>
    </div>
  );
};

export default Game;
