import { useState } from "react";
import { BookOpen, Beaker, FolderOpen, Server } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

interface Location {
  id: string;
  name: string;
  icon: React.ReactNode;
  position: { x: string; y: string };
  color: string;
  message: string;
}

const locations: Location[] = [
  {
    id: "office",
    name: "Dr. Verma's Office",
    icon: <BookOpen className="w-8 h-8" />,
    position: { x: "25%", y: "30%" },
    color: "hsl(45 100% 50%)", // Yellow
    message: "The last known location of Dr. Verma. Books scattered, desk drawer forced open. Evidence of a struggle detected.",
  },
  {
    id: "lab",
    name: "Research Lab",
    icon: <Beaker className="w-8 h-8" />,
    position: { x: "70%", y: "25%" },
    color: "hsl(180 100% 50%)", // Cyan
    message: "Confidential research materials found. Chemical residue on equipment. Security logs show unauthorized access at 2:47 AM.",
  },
  {
    id: "archive",
    name: "Personal Archive Room",
    icon: <FolderOpen className="w-8 h-8" />,
    position: { x: "30%", y: "70%" },
    color: "hsl(120 100% 50%)", // Green
    message: "Multiple files missing from cabinet. Classified documents exposed. Fingerprints detected on file handles.",
  },
  {
    id: "server",
    name: "Server Room",
    icon: <Server className="w-8 h-8" />,
    position: { x: "75%", y: "65%" },
    color: "hsl(0 100% 50%)", // Red
    message: "Critical data breach detected. Hard drive removed. Network logs show encrypted file transfer to unknown location.",
  },
];

export const MapReveal = () => {
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  
  const selectedLocation = selectedId ? locations.find(loc => loc.id === selectedId) : null;

  return (
    <div className="relative min-h-screen overflow-hidden bg-black flex items-center justify-center animate-zoom-in">
      {/* Blueprint Background Grid */}
      <div className="absolute inset-0 opacity-30"
        style={{
          backgroundImage: 'linear-gradient(rgba(0, 200, 255, 0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 200, 255, 0.3) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }}
      />
      
      {/* Holographic Scan Lines */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-b from-cyan-500/10 via-transparent to-cyan-500/10 animate-scan" />
      </div>
      
      {/* Police Siren Effect */}
      <div className="absolute top-0 left-0 w-32 h-32 bg-red-500/20 rounded-full blur-3xl animate-pulse"
        style={{ animationDuration: '2s' }}
      />
      <div className="absolute bottom-0 right-0 w-32 h-32 bg-blue-500/20 rounded-full blur-3xl animate-pulse"
        style={{ animationDuration: '2s', animationDelay: '1s' }}
      />
      
      {/* Map Container */}
      <div className="relative w-full max-w-6xl aspect-video mx-4 mt-32">
        {/* Title */}
        <div className="absolute -top-24 left-1/2 transform -translate-x-1/2 text-center w-full">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-cyan-400 mb-2 animate-fade-in whitespace-nowrap drop-shadow-[0_0_20px_rgba(0,200,255,0.8)]">
            CRIME SCENE INVESTIGATION
          </h2>
          <p className="font-body text-muted-foreground tracking-wider animate-fade-in"
            style={{ animationDelay: '0.3s' }}>
            Select a location to investigate
          </p>
        </div>
        
        {/* Connection Lines */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none">
          {locations.map((location, index) => {
            const nextLocation = locations[(index + 1) % locations.length];
            return (
              <line
                key={`line-${location.id}`}
                x1={location.position.x}
                y1={location.position.y}
                x2={nextLocation.position.x}
                y2={nextLocation.position.y}
                stroke={location.color}
                strokeWidth="2"
                strokeDasharray="5,5"
                opacity="0.3"
                className="animate-dash"
              />
            );
          })}
        </svg>
        
        {/* Location Markers */}
        {locations.map((location, index) => (
          <div
            key={location.id}
            className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer group animate-marker-appear"
            style={{
              left: location.position.x,
              top: location.position.y,
              animationDelay: `${index * 0.2}s`,
            }}
            onMouseEnter={() => setHoveredId(location.id)}
            onMouseLeave={() => setHoveredId(null)}
            onClick={() => setSelectedId(location.id)}
          >
            {/* Outer Glow Pulse */}
            <div
              className="absolute inset-0 rounded-full animate-ping opacity-50"
              style={{
                width: '120px',
                height: '120px',
                backgroundColor: location.color,
                left: '50%',
                top: '50%',
                transform: 'translate(-50%, -50%)',
                animationDuration: '2s',
              }}
            />
            
            {/* Marker Circle */}
            <div
              className={`relative z-10 w-20 h-20 rounded-full flex items-center justify-center transition-all duration-300 ${
                hoveredId === location.id ? 'scale-125' : 'scale-100'
              }`}
              style={{
                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                border: `3px solid ${location.color}`,
                boxShadow: `0 0 30px ${location.color}, inset 0 0 20px ${location.color}`,
              }}
            >
              <div style={{ color: location.color }}>
                {location.icon}
              </div>
            </div>
            
            {/* Location Label */}
            <div
              className={`absolute top-24 left-1/2 transform -translate-x-1/2 whitespace-nowrap transition-all duration-300 ${
                hoveredId === location.id ? 'opacity-100 translate-y-0' : 'opacity-70 translate-y-2'
              }`}
            >
              <div
                className="px-4 py-2 rounded font-body text-sm font-semibold"
                style={{
                  backgroundColor: 'rgba(0, 0, 0, 0.9)',
                  border: `1px solid ${location.color}`,
                  color: location.color,
                  boxShadow: `0 0 20px ${location.color}`,
                }}
              >
                {location.name}
              </div>
            </div>
            
            {/* Hover Ring Effect */}
            {hoveredId === location.id && (
              <div
                className="absolute inset-0 rounded-full animate-ping"
                style={{
                  width: '100px',
                  height: '100px',
                  left: '50%',
                  top: '50%',
                  transform: 'translate(-50%, -50%)',
                  border: `2px solid ${location.color}`,
                  animationDuration: '1s',
                }}
              />
            )}
          </div>
        ))}
      </div>
      
      {/* Corner Grid Accents */}
      <div className="absolute top-0 left-0 w-32 h-32 border-t-2 border-l-2 border-cyan-500/50" />
      <div className="absolute top-0 right-0 w-32 h-32 border-t-2 border-r-2 border-cyan-500/50" />
      <div className="absolute bottom-0 left-0 w-32 h-32 border-b-2 border-l-2 border-cyan-500/50" />
      <div className="absolute bottom-0 right-0 w-32 h-32 border-b-2 border-r-2 border-cyan-500/50" />
      
      {/* Evidence Message Panel */}
      {selectedLocation && (
        <div 
          className="fixed bottom-8 left-1/2 transform -translate-x-1/2 max-w-2xl w-full mx-4 animate-fade-in"
          style={{ zIndex: 50 }}
        >
          <div 
            className="relative p-6 rounded-lg backdrop-blur-md"
            style={{
              backgroundColor: 'rgba(0, 0, 0, 0.9)',
              border: `2px solid ${selectedLocation.color}`,
              boxShadow: `0 0 30px ${selectedLocation.color}, inset 0 0 20px ${selectedLocation.color}20`,
            }}
          >
            <button
              onClick={() => setSelectedId(null)}
              className="absolute top-2 right-2 text-white/70 hover:text-white transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            
            <div className="flex items-start gap-4">
              <div 
                className="flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center"
                style={{
                  backgroundColor: 'rgba(0, 0, 0, 0.8)',
                  border: `2px solid ${selectedLocation.color}`,
                  color: selectedLocation.color,
                }}
              >
                {selectedLocation.icon}
              </div>
              
              <div className="flex-1">
                <h3 
                  className="font-display text-xl font-bold mb-2"
                  style={{ color: selectedLocation.color }}
                >
                  {selectedLocation.name}
                </h3>
                <p className="font-body text-white/90 leading-relaxed">
                  {selectedLocation.message}
                </p>
              </div>
            </div>
            
            <div className="mt-4 pt-4 border-t border-white/20">
              <p className="font-body text-xs text-white/60 uppercase tracking-wider">
                Evidence Status: Under Investigation
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Call to Action Button */}
      <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 animate-fade-in">
        <Link to="/game">
          <Button
            className="h-16 px-8 text-lg font-display font-bold bg-gradient-to-r from-red-900 to-red-700 hover:from-red-800 hover:to-red-600 text-white border-2 border-red-600/50"
            style={{
              boxShadow: "0 0 40px rgba(220, 38, 38, 0.4)",
            }}
          >
            Only the right name reveals the way forward. Which room will you try?
          </Button>
        </Link>
      </div>
    </div>
  );
};
