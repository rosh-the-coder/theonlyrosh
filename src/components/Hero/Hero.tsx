"use client";
import * as THREE from "three";
import { Canvas } from "@react-three/fiber";
import { Suspense } from "react";
import RippleReveal from "../RippleReveal";

export default function Hero() {
  return (
    <section className="relative h-[100svh] bg-[#0B0B0B] overflow-hidden">
      {/* Canvas covers the entire viewport */}
      <Canvas
        className="absolute inset-0 z-0 pointer-events-auto"
        gl={(canvas) =>
          new THREE.WebGL1Renderer({
            canvas,
            antialias: true,
            powerPreference: "high-performance",
            alpha: true,
            preserveDrawingBuffer: false,
          })
        }
        camera={{ position: [0, 0, 1], fov: 15, near: 0.1, far: 10 }}
        style={{ cursor: 'none' }}
      >
        <Suspense fallback={null}>
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
            brushRadiusPxAt1440={120}
            rippleAmplitudePxAt1440={2.0}
            rippleFreq={26.0}
            rippleDamp={2.2}
            maxDPR={1.5}
          />
        </Suspense>
      </Canvas>
    </section>
  );
}