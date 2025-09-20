"use client";
import * as THREE from "three";
import { Canvas } from "@react-three/fiber";
import { Suspense, useState, useEffect } from "react";
import RippleReveal from "../RippleReveal";

export default function Hero() {
  const [revealEnabled, setRevealEnabled] = useState(true);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleCanvasClick = () => {
    setRevealEnabled(!revealEnabled);
  };

  return (
    <section className="relative h-[100svh] bg-[#0B0B0B] overflow-hidden">
      {/* Canvas covers the entire viewport */}
      {isClient && (
        <Canvas
          className="absolute inset-0 z-0 pointer-events-auto"
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
                { text: "i am", x: 60, y: 200, size: 48, color: "#FFF", font: "Teko", fontWeight: 100 },
                { text: "ROSH", x: 600, y: 200, size: 48, color: "#FFF", font: "Teko", fontWeight: 100 },
                { text: "a", x: 1155, y: 200, size: 48, color: "#FFF", font: "Teko", fontWeight: 100 },
                { text: "DESIGN ENGINEER", x: 600, y: 300, size: 170, color: "#FE5454", font: "Teko", fontWeight: 700, letterSpacing: "1.04px" },
              
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