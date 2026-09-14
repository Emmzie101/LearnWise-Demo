import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'motion/react';
import { Sparkles, Brain, Network, Zap } from 'lucide-react';

export const CognitiveVisual: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState({ x: 0.5, y: 0.5 });
  const [isHovered, setIsHovered] = useState(false);

  // Handle cursor tracking within the container
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    setMousePos({ x: Math.max(0, Math.min(1, x)), y: Math.max(0, Math.min(1, y)) });
    setIsHovered(true);
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!containerRef.current || e.touches.length === 0) return;
    const rect = containerRef.current.getBoundingClientRect();
    const touch = e.touches[0];
    const x = (touch.clientX - rect.left) / rect.width;
    const y = (touch.clientY - rect.top) / rect.height;
    setMousePos({ x: Math.max(0, Math.min(1, x)), y: Math.max(0, Math.min(1, y)) });
    setIsHovered(true);
  };

  // Precomputed neural nodes
  const nodes = [
    { x: 30, y: 25, label: 'Encoding' },
    { x: 50, y: 18, label: 'Attention' },
    { x: 70, y: 28, label: 'Metacognition' },
    { x: 22, y: 45, label: 'Working Memory' },
    { x: 48, y: 40, label: 'Schemas' },
    { x: 78, y: 46, label: 'Calibration' },
    { x: 32, y: 68, label: 'Retrieval' },
    { x: 52, y: 62, label: 'Transfer' },
    { x: 72, y: 72, label: 'Application' },
    { x: 50, y: 84, label: 'Adaptation' },
  ];

  // Precomputed synapses between nodes
  const edges = [
    [0, 1], [1, 2], [0, 3], [1, 4], [2, 5],
    [3, 4], [4, 5], [3, 6], [4, 7], [5, 8],
    [6, 7], [7, 8], [6, 9], [7, 9], [8, 9]
  ];

  return (
    <div 
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onTouchMove={handleTouchMove}
      onTouchStart={() => setIsHovered(true)}
      className="relative w-full max-w-xl mx-auto aspect-square rounded-3xl overflow-hidden border border-[#1769FF]/20 bg-gradient-to-b from-[#071A3A] via-[#0A2558] to-[#071A3A] shadow-2xl shadow-[#124BCE]/15 select-none"
    >
      {/* Background Neural Grid & Atmosphere */}
      <div className="absolute inset-0 bg-neural-pattern opacity-30" />
      
      {/* Glowing Ambient Core that follows cursor/touch */}
      <div 
        className="absolute w-80 h-80 rounded-full blur-3xl pointer-events-none transition-all duration-300 ease-out"
        style={{
          left: `${mousePos.x * 100}%`,
          top: `${mousePos.y * 100}%`,
          transform: 'translate(-50%, -50%)',
          background: isHovered 
            ? 'radial-gradient(circle, rgba(23, 105, 255, 0.45) 0%, rgba(244, 197, 66, 0.25) 40%, transparent 70%)'
            : 'radial-gradient(circle, rgba(23, 105, 255, 0.3) 0%, rgba(18, 75, 206, 0.15) 50%, transparent 70%)',
        }}
      />

      {/* SVG Synapse Graph */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none">
        <defs>
          <linearGradient id="edgeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#1769FF" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#F4C542" stopOpacity="0.6" />
          </linearGradient>
        </defs>
        {edges.map(([fromIdx, toIdx], i) => {
          const from = nodes[fromIdx];
          const to = nodes[toIdx];
          return (
            <line
              key={`edge-${i}`}
              x1={`${from.x}%`}
              y1={`${from.y}%`}
              x2={`${to.x}%`}
              y2={`${to.y}%`}
              stroke="url(#edgeGrad)"
              strokeWidth={isHovered ? "1.8" : "1"}
              strokeOpacity={isHovered ? 0.7 : 0.35}
              strokeDasharray={i % 3 === 0 ? "4 3" : undefined}
              className="transition-all duration-500"
            />
          );
        })}
      </svg>

      {/* Synapse Nodes */}
      {nodes.map((node, i) => {
        const distToCursor = Math.hypot(node.x / 100 - mousePos.x, node.y / 100 - mousePos.y);
        const isActive = distToCursor < 0.25;

        return (
          <div
            key={`node-${i}`}
            className="absolute transform -translate-x-1/2 -translate-y-1/2 pointer-events-none transition-transform duration-300"
            style={{ left: `${node.x}%`, top: `${node.y}%` }}
          >
            <div 
              className={`relative flex items-center justify-center rounded-full transition-all duration-300 ${
                isActive 
                  ? 'w-5 h-5 bg-[#F4C542] shadow-lg shadow-[#F4C542]/60 ring-4 ring-[#F4C542]/20' 
                  : 'w-3.5 h-3.5 bg-[#1769FF] ring-2 ring-[#EAF2FF]/30'
              }`}
            >
              {isActive && <div className="w-1.5 h-1.5 rounded-full bg-[#071A3A]" />}
            </div>
            <span 
              className={`absolute left-1/2 -translate-x-1/2 top-5 text-[11px] font-medium tracking-wide whitespace-nowrap px-1.5 py-0.5 rounded transition-all duration-300 ${
                isActive 
                  ? 'text-white bg-[#071A3A]/90 border border-[#F4C542]/40 opacity-100' 
                  : 'text-[#EAF2FF]/70 opacity-60'
              }`}
            >
              {node.label}
            </span>
          </div>
        );
      })}

      {/* Stylized Human Brain Silhouette Layer (Frosted Glass Mask) */}
      <div 
        className="absolute inset-0 flex items-center justify-center pointer-events-none transition-opacity duration-700"
        style={{ opacity: isHovered ? 0.85 : 0.55 }}
      >
        <div className="relative w-72 h-72 rounded-full border border-white/10 backdrop-blur-[2px] flex items-center justify-center">
          <Brain className="w-52 h-52 text-[#1769FF]/25 stroke-[0.7]" />
        </div>
      </div>

      {/* Sparsely Placed Floating Cognitive Badges */}
      <div className="absolute top-4 left-5 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#071A3A]/80 border border-white/15 text-[11px] text-[#EAF2FF]">
        <Zap className="w-3 h-3 text-[#F4C542]" />
        <span>PLSFR+ Architecture</span>
      </div>

      <div className="absolute bottom-4 right-5 flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#071A3A]/80 border border-white/15 text-[11px] text-[#EAF2FF]">
        <Network className="w-3 h-3 text-[#1769FF]" />
        <span>Closed-Loop Adaptive Engine</span>
      </div>

      {/* Interactive Helper Text */}
      <div className="absolute bottom-4 left-5 text-[11px] text-[#EAF2FF]/60 flex items-center gap-1">
        <Sparkles className="w-3 h-3 text-[#F4C542]" />
        <span>Move cursor or touch to uncover cognition layers</span>
      </div>
    </div>
  );
};
