import React, { Suspense, useState, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, MeshDistortMaterial, MeshWobbleMaterial, Text, Float, Stars, PresentationControls, Stage } from '@react-three/drei';
import { motion, AnimatePresence } from 'motion/react';
import { X, Box, Cuboid as Cube, Circle, Hexagon, Activity, Cpu, Layers, RefreshCw, Zap, Info } from 'lucide-react';
import * as THREE from 'three';

export interface SceneElement {
  id: string;
  type: 'box' | 'sphere' | 'torus' | 'cylinder' | 'polyhedron';
  position: [number, number, number];
  rotation: [number, number, number];
  scale: [number, number, number];
  color: string;
  wireframe?: boolean;
  label?: string;
  wobble?: boolean;
  distort?: number;
}

interface HolographicDesignModuleProps {
  isOpen: boolean;
  onClose: () => void;
  elements: SceneElement[];
  deviceName?: string;
  onLog: (msg: string) => void;
}

const HologramElement = ({ element }: { element: SceneElement }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.01;
      meshRef.current.rotation.x += 0.005;
    }
  });

  const getGeometry = () => {
    switch (element.type) {
      case 'sphere': return <sphereGeometry args={[1, 32, 32]} />;
      case 'torus': return <torusGeometry args={[0.7, 0.2, 16, 100]} />;
      case 'cylinder': return <cylinderGeometry args={[0.5, 0.5, 2, 32]} />;
      case 'polyhedron': return <icosahedronGeometry args={[1, 0]} />;
      default: return <boxGeometry args={[1, 1, 1]} />;
    }
  };

  return (
    <group position={element.position} rotation={element.rotation} scale={element.scale}>
      <mesh ref={meshRef}>
        {getGeometry()}
        {element.distort ? (
          <MeshDistortMaterial 
            color={element.color} 
            speed={2} 
            distort={element.distort} 
            wireframe={element.wireframe} 
            opacity={0.6} 
            transparent 
          />
        ) : element.wobble ? (
          <MeshWobbleMaterial 
            color={element.color} 
            speed={1} 
            factor={0.6} 
            wireframe={element.wireframe} 
            opacity={0.6} 
            transparent 
          />
        ) : (
          <meshPhongMaterial 
            color={element.color} 
            wireframe={element.wireframe} 
            opacity={0.4} 
            transparent 
            shininess={100}
            emissive={element.color}
            emissiveIntensity={0.5}
          />
        )}
      </mesh>
      {element.label && (
        <Text
          position={[0, 1.5, 0]}
          fontSize={0.2}
          color="#38bdf8"
          anchorX="center"
          anchorY="middle"
          font="https://fonts.gstatic.com/s/jetbrainsmono/v18/tMe62o-9ETq98IFp7mPVZ007WW7m.woff2"
        >
          {element.label.toUpperCase()}
        </Text>
      )}
    </group>
  );
};

export const HolographicDesignModule: React.FC<HolographicDesignModuleProps> = ({ isOpen, onClose, elements, deviceName = "MARK_85_SCHEMATIC", onLog }) => {
  const [rotationEnabled, setRotationEnabled] = useState(true);
  const [showManual, setShowManual] = useState(false);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9, filter: "blur(10px)" }}
          animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
          exit={{ opacity: 0, scale: 0.9, filter: "blur(10px)" }}
          className="fixed inset-0 z-[1000] flex items-center justify-center p-8 pointer-events-none"
        >
          <div className="relative w-full h-full max-w-6xl glass rounded-[2.5rem] border border-sky-400/20 overflow-hidden pointer-events-auto shadow-[0_0_50px_rgba(56,189,248,0.15)]">
            {/* HUD Overlay */}
            <div className="absolute inset-0 pointer-events-none z-10 border-[20px] border-transparent">
              <div className="absolute top-0 left-0 w-24 h-24 border-t-2 border-l-2 border-sky-400/40" />
              <div className="absolute top-0 right-0 w-24 h-24 border-t-2 border-r-2 border-sky-400/40" />
              <div className="absolute bottom-0 left-0 w-24 h-24 border-b-2 border-l-2 border-sky-400/40" />
              <div className="absolute bottom-0 right-0 w-24 h-24 border-b-2 border-r-2 border-sky-400/40" />
            </div>

            <div className="absolute inset-0 bg-slate-950/40 backdrop-blur-sm pointer-events-none" />

            {/* Header */}
            <div className="relative z-20 flex justify-between items-center p-8">
              <div className="flex items-center gap-6">
                <div className="w-16 h-16 rounded-xl bg-sky-500/10 border border-sky-400/30 flex items-center justify-center shadow-[inset_0_0_15px_rgba(56,189,248,0.2)]">
                  <Cpu className="w-8 h-8 text-sky-400 animate-pulse" />
                </div>
                <div>
                  <h2 className="text-[10px] font-mono tracking-[0.4em] text-sky-400/60 uppercase">Holographic_Spatial_Design</h2>
                  <p className="text-3xl font-bold tracking-tighter glow-text uppercase italic">{deviceName}</p>
                  <div className="mt-8 pt-4 border-t border-sky-400/10">
                    <button 
                      onClick={() => setShowManual(!showManual)}
                      className="flex items-center gap-3 text-sky-400 hover:text-sky-300 transition-colors"
                    >
                      <Info className="w-4 h-4" />
                      <span className="text-[10px] font-bold uppercase tracking-widest underline decoration-sky-500/30">Fabrication_Manual</span>
                    </button>
                  </div>
                </div>
              </div>
              <button 
                onClick={onClose}
                className="p-4 glass rounded-full hover:bg-sky-500/20 transition-all text-sky-400"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Help Overlay */}
            <AnimatePresence>
              {showManual && (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="absolute top-40 left-8 z-[100] w-72 glass p-6 rounded-2xl border border-sky-500/30 shadow-[0_0_40px_rgba(56,189,248,0.2)]"
                >
                  <h3 className="text-sky-400 text-[10px] font-black uppercase tracking-[0.4em] mb-4">Neural_Fabrication_v1.0</h3>
                  <ul className="space-y-4">
                    <li className="flex gap-3">
                      <div className="w-1.5 h-1.5 rounded-full bg-sky-400 mt-1 shrink-0" />
                      <p className="text-[9px] text-sky-100/60 leading-relaxed uppercase">Rotate the model by clicking and dragging anywhere in the holographic field.</p>
                    </li>
                    <li className="flex gap-3">
                      <div className="w-1.5 h-1.5 rounded-full bg-sky-400 mt-1 shrink-0" />
                      <p className="text-[9px] text-sky-100/60 leading-relaxed uppercase">Inspect specific components by utilizing your scroll wheel to zoom the projection lenses.</p>
                    </li>
                    <li className="flex gap-3">
                      <div className="w-1.5 h-1.5 rounded-full bg-sky-400 mt-1 shrink-0" />
                      <p className="text-[9px] text-sky-100/60 leading-relaxed uppercase">To generate new schematics, simply instruct me in natural language. I will synthesize the geometry autonomously.</p>
                    </li>
                  </ul>
                  <button 
                    onClick={() => setShowManual(false)}
                    className="mt-6 w-full py-2 border border-sky-500/20 rounded-lg text-[8px] font-black uppercase text-sky-400 hover:bg-sky-500/10 transition-colors"
                  >
                    Close Protocol
                  </button>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Main Canvas Area */}
            <div className="relative w-full h-[calc(100%-200px)]">
              <Suspense fallback={
                <div className="w-full h-full flex items-center justify-center">
                  <RefreshCw className="w-8 h-8 text-sky-400 animate-spin" />
                </div>
              }>
                <Canvas shadows dpr={[1, 2]}>
                  <PerspectiveCamera makeDefault position={[0, 0, 5]} fov={50} />
                  <ambientLight intensity={0.5} />
                  <pointLight position={[10, 10, 10]} intensity={1} color="#38bdf8" />
                  <pointLight position={[-10, -10, -10]} intensity={0.5} color="#0ea5e9" />
                  
                  <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
                  
                  <PresentationControls
                    global
                    rotation={[0, 0.3, 0]}
                    polar={[-Math.PI / 3, Math.PI / 3]}
                    azimuth={[-Math.PI / 1.4, Math.PI / 1.4]}
                  >
                    <Stage environment="city" intensity={0.6} shadows={false}>
                      <group>
                        {elements.map((el) => (
                          <HologramElement key={el.id} element={el} />
                        ))}
                      </group>
                    </Stage>
                  </PresentationControls>
                  
                  <OrbitControls enableZoom={true} enablePan={false} />
                </Canvas>
              </Suspense>

              {/* Data Overlay */}
              <div className="absolute bottom-8 left-8 z-20 flex flex-col gap-4">
                <div className="glass p-4 rounded-xl border-sky-400/20">
                  <div className="flex items-center gap-3 mb-2">
                    <Activity className="w-4 h-4 text-sky-400" />
                    <span className="text-[10px] font-mono tracking-widest uppercase opacity-60">Spatial_Metrics</span>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] font-mono text-sky-400">POLY_COUNT: {elements.length * 1240}</p>
                    <p className="text-[10px] font-mono text-sky-400">LATENCY: 1.4ms</p>
                    <p className="text-[10px] font-mono text-sky-400">RENDER_ENGINE: RAD_OS_v4</p>
                  </div>
                </div>
              </div>

              <div className="absolute bottom-8 right-8 z-20 flex gap-4">
                <button 
                  onClick={() => onLog("CALIBRATING_HOLOGRAPHIC_FOCUS")}
                  className="glass px-6 py-3 rounded-xl flex items-center gap-3 hover:bg-sky-500/10 transition-all border-sky-400/20"
                >
                  <RefreshCw className="w-4 h-4 text-sky-400" />
                  <span className="text-[10px] font-bold uppercase tracking-widest text-sky-100">Recalibrate</span>
                </button>
                <button 
                  onClick={() => onLog("ENGAGING_SPATIAL_SCAN")}
                  className="bg-sky-500 text-slate-950 px-6 py-3 rounded-xl flex items-center gap-3 hover:bg-sky-400 transition-all shadow-[0_0_20px_rgba(56,189,248,0.4)]"
                >
                  <Zap className="w-4 h-4" />
                  <span className="text-[10px] font-black uppercase tracking-widest">Execute Scan</span>
                </button>
              </div>
            </div>

            {/* Progress Bars */}
            <div className="absolute bottom-0 left-0 w-full p-8 flex items-center gap-8">
              <div className="flex-1 h-1 flex gap-1">
                {[...Array(20)].map((_, i) => (
                  <motion.div 
                    key={i}
                    animate={{ opacity: [0.2, 1, 0.2] }}
                    transition={{ duration: 2, repeat: Infinity, delay: i * 0.1 }}
                    className="flex-1 bg-sky-400/40 rounded-full"
                  />
                ))}
              </div>
              <p className="text-[10px] font-mono text-sky-400/60 uppercase tracking-[0.4em]">Hologram_Stable_State_Locked</p>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
