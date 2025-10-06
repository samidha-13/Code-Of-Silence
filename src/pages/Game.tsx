import { useSearchParams, Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Suspense, lazy } from "react";

// Lazy load the room components
const RoomOne = lazy(() => import("@/components/rooms/RoomOne"));
const RoomTwo = lazy(() => import("@/components/rooms/RoomTwo"));
const RoomThree = lazy(() => import("@/components/rooms/RoomThree"));
const RoomFour = lazy(() => import("@/components/rooms/RoomFour"));

const Game = () => {
  const [searchParams] = useSearchParams();
  const roomName = searchParams.get("room") || "";

  // Map room names to components
  const getRoomComponent = () => {
    switch (roomName.toLowerCase()) {
      case "verma":
        return <RoomOne />;
      case "research":
        return <RoomTwo />;
      case "archive":
        return <RoomThree />;
      case "server":
        return <RoomFour />;
      default:
        return <RoomOne />;
    }
  };

  const getRoomTitle = () => {
    switch (roomName.toLowerCase()) {
      case "verma":
        return "Dr. Verma's Office";
      case "research":
        return "Research Lab";
      case "archive":
        return "Archive Room";
      case "server":
        return "Server Room";
      default:
        return "Loading Room";
    }
  };

  return (
    <div className="min-h-screen bg-black relative">
      {/* Back Button */}
      <Link to="/?skipIntro=true" className="fixed top-8 left-8 z-50">
        <Button
          variant="outline"
          className="h-12 px-6 font-display font-bold bg-black/80 border-red-900/70 text-white hover:bg-red-900/20 hover:border-red-600"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back
        </Button>
      </Link>

      {/* 3D Room */}
      <Suspense fallback={
        <div className="h-screen w-screen flex flex-col items-center justify-center bg-black">
          <div className="relative mb-8">
            <div className="w-20 h-20 border-4 border-red-900/30 border-t-red-600 rounded-full animate-spin"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-12 h-12 border-4 border-transparent border-t-red-500/50 rounded-full animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1s' }}></div>
            </div>
          </div>
          <div className="text-red-600 text-3xl font-display font-bold mb-2 animate-pulse">
            {getRoomTitle()}
          </div>
          <div className="text-white/60 text-lg font-display mb-4">Loading 3D Environment...</div>
          <div className="w-64 h-1 bg-red-900/30 rounded-full overflow-hidden">
            <div className="h-full bg-red-600 animate-pulse" style={{ width: '70%' }}></div>
          </div>
          <div className="mt-8 text-white/40 text-sm">Preparing crime scene investigation</div>
        </div>
      }>
        {getRoomComponent()}
      </Suspense>
    </div>
  );
};

export default Game;
