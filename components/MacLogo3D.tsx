"use client";

import { Suspense, useRef, useState, useEffect, useCallback, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useGLTF, Float, ContactShadows } from "@react-three/drei";
import * as THREE from "three";

// Configuration constants
const MAX_TILT_DEGREES = 40;
const MAX_TILT = (MAX_TILT_DEGREES * Math.PI) / 180;
const TILT_FALLOFF_RATE = 0.2;
const LERP_FACTOR = 0.1;
const BASE_ROTATION = Math.PI / 2;

const FLOAT_SPEED = 4;
const FLOAT_INTENSITY = 0.5;
const FLOAT_ROTATION_MOBILE = 0.3;
const FLOAT_ROTATION_DESKTOP = 0.1;

const GROUP_SCALE = 0.4;
const MESH_SCALE = 0.25;
const LOGO_COLOR = "#FFD200";

const CAMERA_POSITION: [number, number, number] = [0, 0, 5];
const CAMERA_FOV = 45;
const GLTF_PATH = "/logo/mac_logo.glb";
const AMBIENT_LIGHT_INTENSITY = 0.3;
const FRONT_LIGHT_INTENSITY = 2;
const SIDE_LIGHT_INTENSITY = 1;

const SHADOW_OPACITY = 0.4;
const SHADOW_BLUR = 7;
const SHADOW_POSITION_Y = -1.6;

interface ModelProps {
  mouse: { x: number; y: number };
  gyro: { beta: number; gamma: number };
  isMobile: boolean;
  onLoaded?: () => void;
}

function MacLogoModel({ mouse, gyro, isMobile, onLoaded }: ModelProps) {
  const groupRef = useRef<THREE.Group>(null);
  const { nodes } = useGLTF(GLTF_PATH);
  const targetRotation = useRef({ x: BASE_ROTATION, z: 0 });

  const logoMesh = nodes.logo as THREE.Mesh;

  // Center the geometry once on load
  const centeredGeometry = useMemo(() => {
    if (!logoMesh?.geometry) return null;
    const geo = logoMesh.geometry.clone();
    geo.center();
    return geo;
  }, [logoMesh?.geometry]);

  // Signal when model is ready
  useEffect(() => {
    if (centeredGeometry && onLoaded) {
      onLoaded();
    }
  }, [centeredGeometry, onLoaded]);

  useFrame(() => {
    if (!groupRef.current) return;

    if (isMobile) {
      // Mobile: react to gyroscope
      // beta = front-back tilt (-180 to 180), gamma = left-right tilt (-90 to 90)
      // Normalize to -1 to 1 range and apply sensitivity
      const normalizedBeta = THREE.MathUtils.clamp((gyro.beta - 45) / 45, -1, 1);
      const normalizedGamma = THREE.MathUtils.clamp(gyro.gamma / 45, -1, 1);

      targetRotation.current.x = BASE_ROTATION - normalizedBeta * MAX_TILT;
      targetRotation.current.z = -normalizedGamma * MAX_TILT;

      // Smooth interpolation
      groupRef.current.rotation.x = THREE.MathUtils.lerp(
        groupRef.current.rotation.x,
        targetRotation.current.x,
        LERP_FACTOR
      );
      groupRef.current.rotation.z = THREE.MathUtils.lerp(
        groupRef.current.rotation.z,
        targetRotation.current.z,
        LERP_FACTOR
      );
    } else {
      // Desktop: follow cursor with smooth falloff
      const falloffX = Math.tanh(mouse.x * TILT_FALLOFF_RATE);
      const falloffY = Math.tanh(mouse.y * TILT_FALLOFF_RATE);
      targetRotation.current.x = BASE_ROTATION - falloffY * MAX_TILT;
      targetRotation.current.z = -falloffX * MAX_TILT;

      // Smooth interpolation
      groupRef.current.rotation.x = THREE.MathUtils.lerp(
        groupRef.current.rotation.x,
        targetRotation.current.x,
        LERP_FACTOR
      );
      groupRef.current.rotation.z = THREE.MathUtils.lerp(
        groupRef.current.rotation.z,
        targetRotation.current.z,
        LERP_FACTOR
      );
    }
  });

  if (!centeredGeometry) {
    return null;
  }

  return (
    <group position={[0, 0, 0]}>
      <Float
        speed={FLOAT_SPEED}
        rotationIntensity={isMobile ? FLOAT_ROTATION_MOBILE : FLOAT_ROTATION_DESKTOP}
        floatIntensity={FLOAT_INTENSITY}
      >
        <group ref={groupRef} rotation={[BASE_ROTATION, 0, 0]} scale={GROUP_SCALE}>
          <mesh geometry={centeredGeometry} scale={MESH_SCALE}>
            <meshToonMaterial color={LOGO_COLOR} toneMapped={false} />
          </mesh>
        </group>
      </Float>
    </group>
  );
}

export default function MacLogo3D({ className }: { className?: string }) {
  const [mouse, setMouse] = useState({ x: 0, y: 0 });
  const [gyro, setGyro] = useState({ beta: 45, gamma: 0 });
  const [isMobile, setIsMobile] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
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

  // Gyroscope handler for mobile
  const handleOrientation = useCallback((e: DeviceOrientationEvent) => {
    setGyro({
      beta: e.beta ?? 45,
      gamma: e.gamma ?? 0,
    });
  }, []);

  useEffect(() => {
    if (!isMobile) return;

    const requestGyroPermission = async () => {
      // iOS 13+ requires permission request
      if (
        typeof DeviceOrientationEvent !== "undefined" &&
        "requestPermission" in DeviceOrientationEvent &&
        typeof (DeviceOrientationEvent as unknown as { requestPermission: () => Promise<string> }).requestPermission === "function"
      ) {
        try {
          const permission = await (DeviceOrientationEvent as unknown as { requestPermission: () => Promise<string> }).requestPermission();
          if (permission === "granted") {
            window.addEventListener("deviceorientation", handleOrientation);
          }
        } catch {
          // Permission denied or error, gyro won't work
        }
      } else {
        // Non-iOS or older iOS, just add listener
        window.addEventListener("deviceorientation", handleOrientation);
      }
    };

    requestGyroPermission();
    return () => window.removeEventListener("deviceorientation", handleOrientation);
  }, [isMobile, handleOrientation]);

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
    <div
      ref={containerRef}
      className={`${className} relative`}
      style={{
        minHeight: '1px',
        opacity: isLoaded ? 1 : 0,
        transition: 'opacity 0.6s ease-in-out',
      }}
    >
      <Canvas
        camera={{ position: CAMERA_POSITION, fov: CAMERA_FOV }}
        gl={{ antialias: true, alpha: true, toneMapping: 0 }}
        resize={{ scroll: false, debounce: { scroll: 0, resize: 0 } }}
        frameloop="always"
        onCreated={({ gl }) => {
          // Force resize after canvas is created
          gl.setSize(gl.domElement.clientWidth, gl.domElement.clientHeight);
        }}
        style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: "transparent", pointerEvents: "none" }}
      >
        <Suspense fallback={null}>
          <ambientLight intensity={AMBIENT_LIGHT_INTENSITY} />
          <directionalLight position={[0, 0, 5]} intensity={FRONT_LIGHT_INTENSITY} />
          <directionalLight position={[3, 3, 3]} intensity={SIDE_LIGHT_INTENSITY} />
          <MacLogoModel mouse={mouse} gyro={gyro} isMobile={isMobile} onLoaded={() => setIsLoaded(true)} />
          <ContactShadows
            position={[0, SHADOW_POSITION_Y, 0]}
            opacity={SHADOW_OPACITY}
            blur={SHADOW_BLUR}
            scale={5}
          />
        </Suspense>
      </Canvas>
    </div>
  );
}

// Preload the model
useGLTF.preload(GLTF_PATH);
