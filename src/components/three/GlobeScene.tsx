"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Line, OrbitControls, Sparkles } from "@react-three/drei";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import { routes } from "@/data/content";

const point = (lat: number, lon: number, radius = 2) => {
  const phi = ((90 - lat) * Math.PI) / 180;
  const theta = ((lon + 180) * Math.PI) / 180;
  return new THREE.Vector3(-radius * Math.sin(phi) * Math.cos(theta), radius * Math.cos(phi), radius * Math.sin(phi) * Math.sin(theta));
};

function Globe() {
  const group = useRef<THREE.Group>(null);
  useFrame((state, delta) => {
    if (!group.current) return;
    group.current.rotation.y += delta * 0.055;
    group.current.rotation.x = THREE.MathUtils.lerp(group.current.rotation.x, state.pointer.y * 0.08, 0.03);
  });
  const arcs = useMemo(() => routes.map((route) => {
    const start = point(...route.from, 2.03);
    const end = point(...route.to, 2.03);
    const middle = start.clone().add(end).multiplyScalar(0.5).normalize().multiplyScalar(2.75);
    return new THREE.QuadraticBezierCurve3(start, middle, end).getPoints(48);
  }), []);
  return <group ref={group}>
    <mesh><sphereGeometry args={[2, 64, 64]} /><meshStandardMaterial color="#071216" roughness={0.7} metalness={0.8} /></mesh>
    <mesh><sphereGeometry args={[2.02, 48, 48]} /><meshBasicMaterial color="#68e7ff" wireframe transparent opacity={0.08} /></mesh>
    {arcs.map((arc, index) => <Line key={index} points={arc} color="#68e7ff" lineWidth={0.65} transparent opacity={0.55} />)}
    {routes.flatMap((route) => [route.from, route.to]).map((location, index) => <mesh key={index} position={point(...location, 2.05)}><sphereGeometry args={[0.035, 12, 12]} /><meshBasicMaterial color="#c8f8ff" /></mesh>)}
  </group>;
}

export default function GlobeScene() {
  return <Canvas dpr={[1, 1.5]} camera={{ position: [0, 0, 6], fov: 42 }} gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}>
    <ambientLight intensity={0.4} />
    <directionalLight position={[3, 3, 4]} intensity={2.5} color="#a6ecff" />
    <Globe />
    <Sparkles count={70} scale={7} size={1} speed={0.15} opacity={0.25} />
    <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={0.25} />
  </Canvas>;
}
