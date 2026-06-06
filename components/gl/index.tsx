"use client";

import { Effects } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { Particles } from "./particles";
import { VignetteShader } from "./shaders/vignetteShader";

import { usePathname } from "next/navigation";

interface GLProps {
  hovering: boolean;
  isDark: boolean;
}

export const GL = ({ hovering, isDark }: GLProps) => {
  // Render GL background globally
  // (removed pathname check to show it on all pages)

  return (
    <div id="webgl">
      <Canvas
        camera={{
          position: [1.26, 2.66, -1.82],
          fov: 50,
          near: 0.01,
          far: 300,
        }}
      >
        {/* Dark: pure black. Light: match your --theme-bg or pure white */}
        <color attach="background" args={[isDark ? "#000000" : "#ffffff"]} />
        <Particles
          speed={1.0}
          aperture={1.79}
          focus={3.8}
          size={512}
          noiseScale={0.6}
          noiseIntensity={0.52}
          timeScale={1}
          pointSize={isDark ? 3.0 : 3.0}
          opacity={isDark ? 0.3 : 0.25}
          planeScale={10.0}
          introspect={hovering}
          isDark={isDark}
        />
        {/* Only apply vignette in dark mode — it looks bad on light backgrounds */}
        {isDark && (
          <Effects multisamping={0} disableGamma>
            <shaderPass
              args={[VignetteShader]}
              uniforms-darkness-value={1.5}
              uniforms-offset-value={0.4}
            />
          </Effects>
        )}
      </Canvas>
    </div>
  );
};

