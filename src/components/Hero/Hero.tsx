"use client";
import * as THREE from "three";
import { Canvas } from "@react-three/fiber";
import { Suspense } from "react";
import RippleReveal from "../RippleReveal";

export default function Hero() {
  return (
    <section className="relative h-[100svh] bg-[#0B0B0B] overflow-hidden">
      {/* Canvas sits BEHIND the text */}
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
      >
        <Suspense fallback={null}>
          <RippleReveal
            imageUrl="/rosh-placeholder.jpg"
            chroma={0.002}
            decay={0.975}
            brushRadiusPxAt1440={140}
            rippleAmplitudePxAt1440={2.0}
            rippleFreq={26.0}
            rippleDamp={2.2}
            maxDPR={1.5}
          />
        </Suspense>
      </Canvas>

      {/* Foreground text ALWAYS above canvas */}
      <div className="relative z-10 flex h-[100svh] items-center justify-center px-6 pointer-events-none">
        <h1
          className="select-none text-center font-extrabold leading-none"
          style={{
            fontSize: "clamp(3rem, 12vw, 14rem)",
            color: "#FF5353",
            textShadow:
              "0.5px 0.5px 0 #0C2740, -0.5px -0.5px 0 #0C2740, 4px 4px 10px rgba(255,73,73,0.55)",
            letterSpacing: "-0.02em",
          }}
        >
          ROSHAN
        </h1>
      </div>
    </section>
  );
}