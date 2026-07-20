"use client";

import { useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import {
  Environment,
  Lightformer,
  MeshDistortMaterial,
  Float,
} from "@react-three/drei";
import { EffectComposer, Bloom, Vignette } from "@react-three/postprocessing";
import * as THREE from "three";
import { viewport, lerp, smoothstep } from "@/lib/viewport-state";

/* -------------------------------------------------- morphing chrome / obsidian blob */

function ChromeBlob() {
  const group = useRef<THREE.Group>(null);
  const mesh = useRef<THREE.Mesh>(null);
  // MeshDistortMaterial exposes `distort` / `speed` as live uniforms via refs.
  const mat = useRef<THREE.MeshStandardMaterial & { distort: number; speed: number }>(null);

  useFrame((state, delta) => {
    const hp = viewport.heroProgress;
    const px = viewport.pointerX;
    const py = viewport.pointerY;

    if (group.current) {
      // idle drift + lean toward the cursor
      group.current.rotation.y = lerp(group.current.rotation.y, px * 0.6 + state.clock.elapsedTime * 0.08, 0.06);
      group.current.rotation.x = lerp(group.current.rotation.x, -py * 0.5, 0.06);
      // rise + push back as the user scrolls out of the hero (dispersion feel)
      group.current.position.y = lerp(0, 1.6, hp);
      group.current.position.z = lerp(0, -2.5, hp);
      const s = lerp(1, 1.9, hp);
      group.current.scale.setScalar(s);
    }

    if (mat.current) {
      // organic idle morph + violent distortion spike as it disperses + cursor energy
      const cursorEnergy = Math.min(1, Math.hypot(px, py)) * 0.25;
      mat.current.distort = lerp(0.32, 1.15, hp) + cursorEnergy;
      mat.current.speed = lerp(1.6, 6.0, hp);
      // fade the shell out near the end so the next layer is "revealed"
      mat.current.opacity = 1 - smoothstep(0.45, 1, hp);
      mat.current.envMapIntensity = lerp(1.15, 2.2, hp);
    }
  });

  return (
    <group ref={group}>
      <Float speed={1.4} rotationIntensity={0.5} floatIntensity={0.7}>
        <mesh ref={mesh}>
          <icosahedronGeometry args={[1.15, 64]} />
          <MeshDistortMaterial
            ref={mat as never}
            color="#0a0a12"
            metalness={1}
            roughness={0.16}
            distort={0.32}
            speed={1.6}
            transparent
            opacity={1}
          />
        </mesh>
      </Float>
    </group>
  );
}

/* -------------------------------------------------- nebula particle field */

function Nebula({ count = 4200 }: { count?: number }) {
  const points = useRef<THREE.Points>(null);

  const { positions, colors } = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const crimson = new THREE.Color("#e10f29");
    const magenta = new THREE.Color("#b34dff");
    const deep = new THREE.Color("#3a0330");
    for (let i = 0; i < count; i++) {
      // clustered nebula shell — denser toward the centre
      const r = 3 + Math.pow(Math.random(), 1.6) * 9;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta) * 0.7;
      positions[i * 3 + 2] = r * Math.cos(phi);

      const t = Math.random();
      const c = t < 0.5 ? crimson.clone().lerp(magenta, t * 2) : magenta.clone().lerp(deep, (t - 0.5) * 2);
      colors[i * 3] = c.r;
      colors[i * 3 + 1] = c.g;
      colors[i * 3 + 2] = c.b;
    }
    return { positions, colors };
  }, [count]);

  useFrame((state, delta) => {
    if (!points.current) return;
    const hp = viewport.heroProgress;
    // slow idle swirl + scroll-driven rotation (whole bg turns as you travel)
    points.current.rotation.y += delta * 0.02 + viewport.scroll * delta * 0.15;
    points.current.rotation.x = lerp(points.current.rotation.x, viewport.pointerY * 0.15 + viewport.scroll * 0.4, 0.04);
    // parallax toward cursor
    points.current.position.x = lerp(points.current.position.x, viewport.pointerX * 0.6, 0.04);
    // burst outward as the blob disperses
    const s = lerp(1, 1.35, hp);
    points.current.scale.setScalar(s);
  });

  return (
    <points ref={points}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.035}
        sizeAttenuation
        vertexColors
        transparent
        opacity={0.9}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

/* -------------------------------------------------- root scene */

function Rig() {
  // smooth the pointer every frame so downstream reads are stable
  useFrame(() => {
    viewport.pointerX = lerp(viewport.pointerX, viewport.targetPointerX, 0.08);
    viewport.pointerY = lerp(viewport.pointerY, viewport.targetPointerY, 0.08);
  });
  return null;
}

export default function Scene() {
  return (
    <Canvas
      className="!fixed inset-0"
      style={{ position: "fixed", inset: 0, zIndex: 0 }}
      dpr={[1, 1.6]}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      camera={{ position: [0, 0, 5], fov: 45 }}
    >
      <Rig />
      <ambientLight intensity={0.25} />
      <ChromeBlob />
      <Nebula />

      {/* studio reflections built from light rectangles — no external HDR needed (works offline) */}
      <Environment resolution={256}>
        <group rotation={[0, 0, 0]}>
          <Lightformer form="rect" intensity={3} color="#e10f29" position={[-4, 2, -3]} scale={[6, 4, 1]} />
          <Lightformer form="rect" intensity={2.4} color="#8a17d6" position={[4, -1, -2]} scale={[6, 5, 1]} />
          <Lightformer form="circle" intensity={2} color="#ffffff" position={[0, 4, 2]} scale={[3, 3, 1]} />
          <Lightformer form="rect" intensity={1.6} color="#ff2742" position={[3, 3, 3]} scale={[3, 3, 1]} />
        </group>
      </Environment>

      <EffectComposer>
        <Bloom mipmapBlur intensity={0.9} luminanceThreshold={0.18} luminanceSmoothing={0.5} radius={0.7} />
        <Vignette eskil={false} offset={0.25} darkness={0.85} />
      </EffectComposer>
    </Canvas>
  );
}
