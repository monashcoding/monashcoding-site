"use client";

import { Suspense, useRef, useState, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useGLTF, Float } from "@react-three/drei";
import * as THREE from "three";

// Configuration constants
const MAX_TILT_DEGREES = 40;
const MAX_TILT = (MAX_TILT_DEGREES * Math.PI) / 180;
const TILT_FALLOFF_RATE = 0.2;
const LERP_FACTOR = 0.1;
const MOBILE_ROTATION_SPEED = 1;
const BASE_ROTATION = Math.PI / 2;

const FLOAT_SPEED = 4;
const FLOAT_INTENSITY = 0.5;
const FLOAT_ROTATION_MOBILE = 0.3;
const FLOAT_ROTATION_DESKTOP = 0.1;

const GROUP_SCALE = 0.5;
const MESH_SCALE = 0.25;
const LOGO_COLOR = "#FFD200";

const CAMERA_POSITION: [number, number, number] = [0, 0, 5];
const CAMERA_FOV = 45;
const AMBIENT_LIGHT_INTENSITY = 0.3;
const FRONT_LIGHT_INTENSITY = 2;
const SIDE_LIGHT_INTENSITY = 1;

function MacLogoModel({ mouse, isMobile }: { mouse: { x: number; y: number }; isMobile: boolean }) {
  const groupRef = useRef<THREE.Group>(null);
  const { nodes } = useGLTF("/logo/mac_logo.glb");
  const targetRotation = useRef({ x: BASE_ROTATION, y: 0 });

  const logoMesh = nodes.logo as THREE.Mesh;

  useFrame((state) => {
    if (!groupRef.current) return;

    if (isMobile) {
      // Mobile: simple rotation
      groupRef.current.rotation.x = BASE_ROTATION;
      groupRef.current.rotation.y = state.clock.elapsedTime * MOBILE_ROTATION_SPEED;
    } else {
      // Desktop: follow cursor with smooth falloff (tilt decreases when cursor is far)
      const falloffX = Math.tanh(mouse.x * TILT_FALLOFF_RATE);
      const falloffY = Math.tanh(mouse.y * TILT_FALLOFF_RATE);
      targetRotation.current.x = BASE_ROTATION - falloffY * MAX_TILT;
      targetRotation.current.y = -falloffX * MAX_TILT;

      // Smooth interpolation
      groupRef.current.rotation.x = THREE.MathUtils.lerp(
        groupRef.current.rotation.x,
        targetRotation.current.x,
        LERP_FACTOR
      );
      groupRef.current.rotation.y = 0;
      groupRef.current.rotation.z = THREE.MathUtils.lerp(
        groupRef.current.rotation.z,
        targetRotation.current.y,
        LERP_FACTOR
      );
    }
  });

  if (!logoMesh?.geometry) {
    return null;
  }

  return (
    <Float
      speed={FLOAT_SPEED}
      rotationIntensity={isMobile ? FLOAT_ROTATION_MOBILE : FLOAT_ROTATION_DESKTOP}
      floatIntensity={FLOAT_INTENSITY}
    >
      <group ref={groupRef} rotation={[BASE_ROTATION, 0, 0]} scale={GROUP_SCALE}>
        <mesh geometry={logoMesh.geometry} scale={MESH_SCALE}>
          <meshToonMaterial color={LOGO_COLOR} toneMapped={false} />
        </mesh>
      </group>
    </Float>
  );
}

export default function MacLogo3D({ className }: { className?: string }) {
  const [mouse, setMouse] = useState({ x: 0, y: 0 });
  const [isMobile, setIsMobile] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Detect mobile via pointer capability
    const checkMobile = () => {
      setIsMobile(window.matchMedia("(pointer: coarse)").matches);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    if (isMobile) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      // Normalize to -1 to 1 range based on canvas center
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
      setMouse({ x, y });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [isMobile]);

  return (
    <div ref={containerRef} className={className}>
      <Canvas
        camera={{ position: CAMERA_POSITION, fov: CAMERA_FOV }}
        gl={{ antialias: true, alpha: true, toneMapping: 0 }}
        style={{ background: "transparent", pointerEvents: "none" }}
      >
        <Suspense fallback={null}>
          <ambientLight intensity={AMBIENT_LIGHT_INTENSITY} />
          <directionalLight position={[0, 0, 5]} intensity={FRONT_LIGHT_INTENSITY} />
          <directionalLight position={[3, 3, 3]} intensity={SIDE_LIGHT_INTENSITY} />
          <MacLogoModel mouse={mouse} isMobile={isMobile} />
        </Suspense>
      </Canvas>
    </div>
  );
}

// Preload the model
useGLTF.preload("/logo/mac_logo_chubby.glb");
