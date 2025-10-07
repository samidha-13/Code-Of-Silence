import { Suspense, useEffect, useRef, useState, useCallback } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useGLTF, Html, PerspectiveCamera } from "@react-three/drei";
import * as THREE from "three";
import { useGame } from "@/contexts/GameContext";

function WebsiteScreen() {
  const { websiteUrl, setWebsiteUrl } = useGame();
  const [scale, setScale] = useState(1);
  const [isZoomed, setIsZoomed] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // Listen for URL changes from the iframe
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data.type === 'urlChange' && event.data.url) {
        setWebsiteUrl(event.data.url);
      }
    };
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [setWebsiteUrl]);

  const handleScaleClick = () => {
    setScale(isZoomed ? 1 : 2);
    setIsZoomed(!isZoomed);
  };

  return (
    <Html
      transform
      position={[4, 2.8, 5.2]}
      rotation={[0, 4.8, 0]}
      scale={scale}
      distanceFactor={1}
      occlude={false}
      zIndexRange={[100, 101]}
      style={{ pointerEvents: 'auto', transform: 'translate3d(0,0,0)' }}
    >
      <div style={{ position: 'relative', width: '1020px', height: '600px' }}>
        <button
          onClick={handleScaleClick}
          style={{
            position: 'absolute',
            top: '10px',
            right: '10px',
            zIndex: 1000,
            background: isZoomed ? 'rgba(255, 0, 0, 0.7)' : 'rgba(0, 0, 0, 0.7)',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            padding: '8px 12px',
            fontSize: '12px',
            fontWeight: 'bold',
            cursor: 'pointer',
          }}
        >
          {isZoomed ? 'Normal' : 'Zoom'}
        </button>
        <iframe
          ref={iframeRef}
          src={websiteUrl}
          style={{
            width: "1020px",
            height: "600px",
            border: "none",
            borderRadius: "20px",
            boxShadow: '0 0 20px rgba(0, 0, 0, 0.5)',
            pointerEvents: 'auto'
          }}
          sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
        />
      </div>
    </Html>
  );
}

const LoadPaper = ({ position = [0.1, 2.8, 4.1], rotation = [0, 0, 0], scale = 0.02 }) => {
  const PaperRef = useRef();
  const { scene } = useGLTF("/model/pageFour.glb");

  if (!scene) return null;

  return <primitive ref={PaperRef} object={scene} position={position} rotation={rotation} scale={scale} />;
};


const LoadModel = () => {
  const { scene } = useGLTF("/model/RoomFourModel.glb");

  useEffect(() => {
    if (scene) {
      scene.traverse((child: any) => {
        if (child.isMesh) {
          child.castShadow = true;
          child.receiveShadow = true;
        }
      });
    }
  }, [scene]);

  return <primitive object={scene} position={[0, 2.5, 5]} scale={0.12} />;
};

const FirstPersonControls = () => {
  const { camera, gl } = useThree();
  const moveState = useRef({ forward: false, backward: false, left: false, right: false });
  const [isMouseLooking, setIsMouseLooking] = useState(false);
  const previousMousePosition = useRef({ x: 0, y: 0 });

  const velocity = useRef(new THREE.Vector3());
  // reduced movement speed by 50%
  const moveSpeed = 0.005;
  const mouseSensitivity = 0.002;

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.code === 'KeyW' || e.code === 'ArrowUp') moveState.current.forward = true;
    if (e.code === 'KeyS' || e.code === 'ArrowDown') moveState.current.backward = true;
    if (e.code === 'KeyA' || e.code === 'ArrowLeft') moveState.current.left = true;
    if (e.code === 'KeyD' || e.code === 'ArrowRight') moveState.current.right = true;
  }, []);

  const handleKeyUp = useCallback((e: KeyboardEvent) => {
    if (e.code === 'KeyW' || e.code === 'ArrowUp') moveState.current.forward = false;
    if (e.code === 'KeyS' || e.code === 'ArrowDown') moveState.current.backward = false;
    if (e.code === 'KeyA' || e.code === 'ArrowLeft') moveState.current.left = false;
    if (e.code === 'KeyD' || e.code === 'ArrowRight') moveState.current.right = false;
  }, []);

  const handleMouseDown = useCallback((e: MouseEvent) => {
    if (e.button === 0) {
      setIsMouseLooking(true);
      previousMousePosition.current = { x: e.clientX, y: e.clientY };
      gl.domElement.style.cursor = 'none';
    }
  }, [gl]);

  const handleMouseUp = useCallback(() => {
    setIsMouseLooking(false);
    gl.domElement.style.cursor = 'default';
  }, [gl]);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isMouseLooking) return;
    const deltaX = e.clientX - previousMousePosition.current.x;
    camera.rotation.y -= deltaX * mouseSensitivity;
    camera.rotation.x = 0;
    previousMousePosition.current = { x: e.clientX, y: e.clientY };
  }, [camera, isMouseLooking]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    gl.domElement.addEventListener('mousedown', handleMouseDown);
    gl.domElement.addEventListener('mouseup', handleMouseUp);
    gl.domElement.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      gl.domElement.removeEventListener('mousedown', handleMouseDown);
      gl.domElement.removeEventListener('mouseup', handleMouseUp);
      gl.domElement.removeEventListener('mousemove', handleMouseMove);
    };
  }, [handleKeyDown, handleKeyUp, handleMouseDown, handleMouseUp, handleMouseMove, gl]);

  useFrame(() => {
    velocity.current.set(0, 0, 0);
    const direction = new THREE.Vector3();

    if (moveState.current.forward) direction.z -= 1;
    if (moveState.current.backward) direction.z += 1;
    if (moveState.current.left) direction.x -= 1;
    if (moveState.current.right) direction.x += 1;

    if (direction.length() > 0) direction.normalize();

    const cameraEuler = new THREE.Euler(0, camera.rotation.y, 0);
    direction.applyEuler(cameraEuler);

    velocity.current.addScaledVector(direction, moveSpeed);
    camera.position.add(velocity.current);
  });

  return null;
};

const RoomFour = () => {
  return (
    <div className="h-screen w-screen bg-black">
      <Canvas camera={{ position: [0, 3, 5], fov: 75 }}>
        <PerspectiveCamera makeDefault position={[0, 3, 5]} fov={75} />
        <ambientLight intensity={0.5} />
        <directionalLight position={[5, 5, 5]} intensity={1} castShadow />
        <pointLight position={[0, 5, 0]} intensity={1} />
        <pointLight position={[5, 3, 5]} intensity={0.5} color="#ffffff" />

        <Suspense fallback={null}>
          <LoadModel />
          <LoadPaper />
          <WebsiteScreen />
          <FirstPersonControls />
        </Suspense>
      </Canvas>

      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 bg-black/80 px-6 py-3 rounded-lg border border-white/20">
        <p className="text-white text-sm font-mono">WASD/Arrows: Move • Click + Drag: Look Around</p>
      </div>
    </div>
  );
};

export default RoomFour;
