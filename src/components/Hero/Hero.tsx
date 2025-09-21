"use client";
import * as THREE from "three";
import { Canvas } from "@react-three/fiber";
import { Suspense, useState, useEffect } from "react";
import RippleReveal from "../RippleReveal";

export default function Hero() {
  const [revealEnabled, setRevealEnabled] = useState(true);
  const [isClient, setIsClient] = useState(false);
  const [showreelCoverage, setShowreelCoverage] = useState(0);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Listen for Showreel coverage updates
  useEffect(() => {
    const handleShowreelUpdate = (event: CustomEvent) => {
      setShowreelCoverage(event.detail.coverage);
    };

    window.addEventListener('showreel-coverage-update', handleShowreelUpdate as EventListener);
    return () => window.removeEventListener('showreel-coverage-update', handleShowreelUpdate as EventListener);
  }, []);

  // Calculate exit animation based on Showreel coverage
  const exitThreshold = 0.8; // Start exit animation at 80% coverage (when fully covered)
  const exitProgress = Math.max(0, (showreelCoverage - exitThreshold) / (1 - exitThreshold));
  const exitY = exitProgress * -120; // Move up by 120vh to ensure completely off-screen

  // Smooth exit animation with better easing
  const exitYValue = exitProgress > 0 ? exitY : 0;

  const handleCanvasClick = () => {
    // Only allow toggle if Showreel hasn't fully covered the screen
    const showreelCoverageThreshold = 0.8;
    if (showreelCoverage < showreelCoverageThreshold) {
      console.log('Canvas clicked! Current revealEnabled:', revealEnabled);
      setRevealEnabled(!revealEnabled);
    } else {
      console.log('Toggle disabled - Showreel fully covers screen');
    }
  };

  return (
    <section 
      className={`fixed inset-0 h-[100svh] bg-[#0B0B0B] overflow-hidden select-none hero-protection z-10 ${
        showreelCoverage > 0.2 ? 'pointer-events-none' : 'pointer-events-auto'
      }`}
      style={{
        transform: `translateY(${exitYValue}vh)`,
        transition: 'transform 0.8s cubic-bezier(0.4, 0, 0.2, 1)'
      }}
      onContextMenu={(e) => e.preventDefault()}
      onDragStart={(e) => e.preventDefault()}
      onClick={handleCanvasClick}
    >
      {/* Canvas covers the entire viewport */}
      {isClient && (
        <Canvas
          className="absolute inset-0 z-0 pointer-events-auto select-none"
          onContextMenu={(e) => e.preventDefault()}
          gl={(canvas) => {
            const renderer = new THREE.WebGLRenderer({
              canvas,
              antialias: true,
              powerPreference: "high-performance",
              alpha: true,
              preserveDrawingBuffer: false,
            });
            // Suppress WebGL deprecation warnings
            renderer.debug = { 
              checkShaderErrors: false,
              onShaderError: () => {} // Suppress shader errors
            };
            return renderer;
          }}
          camera={{ position: [0, 0, 1], fov: 15, near: 0.1, far: 10 }}
          onClick={handleCanvasClick}
          onError={(error) => {
            console.warn('Canvas error:', error);
          }}
        >
          <Suspense fallback={<div className="absolute inset-0 bg-[#0B0B0B]" />}>
            <RippleReveal
              imageUrl="/rosh-placeholder.jpg"
              textElements={[
                { text: "i am", x: 40, y: 200, size: 24, color: "#FFF", font: "Teko", fontWeight: 100 },
                { text: "ROSH", x: 600, y: 200, size: 30, color: "#FFF", font: "Teko", fontWeight: 100 },
                { text: "a", x: 1170, y: 200, size: 24, color: "#FFF", font: "Teko", fontWeight: 100 },
                { text: "DESIGN ENGINEER", x: 600, y: 300, size: 173, color: "#FE5454", font: "Teko", fontWeight: 700, letterSpacing: "1.04px" },
                { text: "\" Think Globally. Act Locally. \"", x: 1105, y: 345, size: 16, color: "#FFF", font: "Teko", fontWeight: 50 },
               
              ]}
              chroma={0.002}
              decay={0.975}
              brushRadiusPxAt1440={140}
              rippleAmplitudePxAt1440={2.0}
              rippleFreq={26.0}
              rippleDamp={2.2}
              maxDPR={1.5}
              revealEnabled={revealEnabled}
              // Water ripple controls - adjust these values to tweak the effect
              waterRippleSensitivity={0.002}    // How sensitive to cursor movement (0.001 = very sensitive, 0.01 = less sensitive)
              waterRippleStrength={0.3}         // Maximum ripple strength (0.1 = very subtle, 1.0 = very strong)
              waterRippleRadius={0.08}          // Ripple size (0.05 = small, 0.2 = large)
              waterRippleLifetime={1500}        // How long ripples last in milliseconds (500 = quick, 3000 = long)
            />
          </Suspense>
        </Canvas>
      )}
    </section>
  );
}