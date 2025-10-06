import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";

function Box() {
  return (
    <mesh>
      <boxGeometry args={[2, 2, 2]} />
      <meshStandardMaterial color="orange" />
    </mesh>
  );
}

const RoomOne = () => {
  return (
    <div className="h-screen w-screen bg-black">
      <Canvas
        camera={{ position: [5, 5, 5], fov: 75 }}
      >
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={1} />
        
        <Suspense fallback={null}>
          <Box />
          <OrbitControls />
        </Suspense>
      </Canvas>

      {/* Instructions overlay */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 bg-black/80 px-6 py-3 rounded-lg border border-white/20">
        <p className="text-white text-sm font-mono">
          Click and drag to rotate • Scroll to zoom
        </p>
      </div>
    </div>
  );
};

export default RoomOne;
