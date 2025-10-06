import { useSearchParams, Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Suspense, lazy } from "react";

// Lazy load the room components
const RoomOne = lazy(() => import("@/components/rooms/RoomOne"));

const Game = () => {
  const [searchParams] = useSearchParams();
  const roomName = searchParams.get("room") || "";

  return (
    <div className="min-h-screen bg-black relative">
      {/* Back Button */}
      <Link to="/" className="fixed top-8 left-8 z-50">
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
        <div className="h-screen w-screen flex items-center justify-center">
          <div className="text-white text-2xl font-display">Loading room...</div>
        </div>
      }>
        <RoomOne />
      </Suspense>
    </div>
  );
};

export default Game;
