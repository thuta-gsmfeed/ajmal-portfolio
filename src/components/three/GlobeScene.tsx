"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Html, Line, OrbitControls, Sparkles } from "@react-three/drei";
import { feature } from "topojson-client";
import countries from "world-atlas/countries-110m.json";
import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { globalLocations, GlobalLocation, GlobalRoute, routes } from "@/data/content";

const GLOBE_RADIUS = 2.15;

const globePoint = (lat: number, lon: number, radius = GLOBE_RADIUS) => {
  const phi = ((90 - lat) * Math.PI) / 180;
  const theta = ((lon + 180) * Math.PI) / 180;
  return new THREE.Vector3(
    -radius * Math.sin(phi) * Math.cos(theta),
    radius * Math.cos(phi),
    radius * Math.sin(phi) * Math.sin(theta),
  );
};

type CountryGeometry = {
  type: "Polygon" | "MultiPolygon";
  coordinates: number[][][] | number[][][][];
};

function CountryOutlines() {
  const geometry = useMemo(() => {
    const world = feature(
      countries as unknown as Parameters<typeof feature>[0],
      countries.objects.countries as unknown as Parameters<typeof feature>[1],
    ) as unknown as { features: Array<{ geometry: CountryGeometry }> };
    const vertices: number[] = [];

    const addRing = (ring: number[][]) => {
      for (let index = 1; index < ring.length; index += 1) {
        const previous = globePoint(ring[index - 1][1], ring[index - 1][0], GLOBE_RADIUS + 0.016);
        const current = globePoint(ring[index][1], ring[index][0], GLOBE_RADIUS + 0.016);
        vertices.push(previous.x, previous.y, previous.z, current.x, current.y, current.z);
      }
    };

    world.features.forEach(({ geometry: country }) => {
      if (country.type === "Polygon") {
        (country.coordinates as number[][][]).forEach(addRing);
      } else {
        (country.coordinates as number[][][][]).forEach((polygon) => polygon.forEach(addRing));
      }
    });

    const outlines = new THREE.BufferGeometry();
    outlines.setAttribute("position", new THREE.Float32BufferAttribute(vertices, 3));
    return outlines;
  }, []);

  return (
    <lineSegments geometry={geometry}>
      <lineBasicMaterial color="#88dbe8" transparent opacity={0.38} depthWrite={false} />
    </lineSegments>
  );
}

const samePoint = (first: [number, number], second: [number, number]) => first[0] === second[0] && first[1] === second[1];

function AnimatedRoute({ route, index, selected }: { route: GlobalRoute; index: number; selected: GlobalLocation | null }) {
  const particle = useRef<THREE.Mesh>(null);
  const active = !selected || samePoint(route.from, selected.coordinates) || samePoint(route.to, selected.coordinates);
  const curve = useMemo(() => {
    const start = globePoint(...route.from, GLOBE_RADIUS + 0.035);
    const end = globePoint(...route.to, GLOBE_RADIUS + 0.035);
    const distance = start.distanceTo(end);
    const middle = start.clone().add(end).multiplyScalar(0.5).normalize().multiplyScalar(GLOBE_RADIUS + 0.3 + distance * 0.14);
    return new THREE.QuadraticBezierCurve3(start, middle, end);
  }, [route]);
  const points = useMemo(() => curve.getPoints(72), [curve]);

  useFrame(({ clock }) => {
    if (!particle.current) return;
    const routeProgress = (clock.elapsedTime * (0.075 + index * 0.004) + index / routes.length) % 1;
    particle.current.position.copy(curve.getPointAt(routeProgress));
    const pulse = 0.8 + Math.sin(clock.elapsedTime * 4 + index) * 0.18;
    particle.current.scale.setScalar(pulse * (active ? 1.25 : 0.45));
  });

  return (
    <>
      <Line points={points} color={active ? "#9aeeff" : "#31515a"} lineWidth={active && selected ? 1.6 : 0.72} transparent opacity={active ? (selected ? 0.88 : 0.42) : 0.1} />
      <mesh ref={particle}>
        <sphereGeometry args={[0.027, 12, 12]} />
        <meshBasicMaterial color={active ? "#e5fcff" : "#31515a"} transparent opacity={active ? 1 : 0.16} toneMapped={false} />
      </mesh>
    </>
  );
}

function LocationMarker({ location, index, mobile, selected, onSelect }: { location: GlobalLocation; index: number; mobile: boolean; selected: boolean; onSelect: (name: string) => void }) {
  const group = useRef<THREE.Group>(null);
  const pulse = useRef<THREE.Mesh>(null);
  const label = useRef<HTMLDivElement>(null);
  const position = useMemo(() => globePoint(...location.coordinates, GLOBE_RADIUS + 0.055), [location]);
  const worldPosition = useMemo(() => new THREE.Vector3(), []);
  const globeCenter = useMemo(() => new THREE.Vector3(), []);
  const normal = useMemo(() => new THREE.Vector3(), []);
  const cameraDirection = useMemo(() => new THREE.Vector3(), []);
  const [labelX, labelY] = location.labelOffset ?? [0, -18];

  useFrame(({ camera, clock }) => {
    if (!group.current) return;
    group.current.getWorldPosition(worldPosition);
    group.current.parent?.getWorldPosition(globeCenter);
    normal.copy(worldPosition).sub(globeCenter).normalize();
    cameraDirection.copy(camera.position).sub(worldPosition).normalize();
    const visible = normal.dot(cameraDirection) > -0.02;
    if (label.current) label.current.style.opacity = visible ? "1" : "0";
    if (pulse.current) {
      const scale = 1.15 + Math.sin(clock.elapsedTime * 2.2 + index * 0.7) * 0.28;
      pulse.current.scale.setScalar(scale * (selected ? 1.55 : 1));
    }
    group.current.scale.setScalar(THREE.MathUtils.lerp(group.current.scale.x, selected ? 1.34 : 1, 0.08));
  });

  return (
    <group
      ref={group}
      position={position}
      onClick={(event) => { event.stopPropagation(); onSelect(location.name); }}
      onPointerOver={(event) => { event.stopPropagation(); document.body.style.cursor = "pointer"; }}
      onPointerOut={() => { document.body.style.cursor = ""; }}
    >
      <mesh>
        <sphereGeometry args={[selected ? 0.047 : 0.034, 16, 16]} />
        <meshBasicMaterial color={selected ? "#e5fcff" : "#d4c997"} toneMapped={false} />
      </mesh>
      <mesh ref={pulse}>
        <sphereGeometry args={[0.061, 16, 16]} />
        <meshBasicMaterial color="#68e7ff" transparent opacity={0.16} depthWrite={false} />
      </mesh>
      {location.showLabel !== false && (
        <Html center position={[0, 0, 0]} distanceFactor={mobile ? 4 : 6.2} zIndexRange={[30, 0]}>
          <div
            ref={label}
            style={{ transform: `translate(${labelX}px, ${labelY}px)` }}
            className="pointer-events-none whitespace-nowrap rounded-sm border border-white/15 bg-[#061014]/88 px-1.5 py-1 font-mono text-sm uppercase tracking-[.08em] text-white/75 shadow-[0_6px_24px_rgba(0,0,0,.4)] backdrop-blur-sm transition-opacity duration-300 md:text-[6px] md:tracking-[.15em]"
          >
            {location.name}
          </div>
        </Html>
      )}
    </group>
  );
}

function NetworkGlobe({ mobile, selected, onSelect }: { mobile: boolean; selected: GlobalLocation | null; onSelect: (name: string) => void }) {
  const group = useRef<THREE.Group>(null);
  const targetQuaternion = useMemo(() => {
    if (!selected) return null;
    const locationDirection = globePoint(...selected.coordinates).normalize();
    return new THREE.Quaternion().setFromUnitVectors(locationDirection, new THREE.Vector3(0, 0, 1));
  }, [selected]);

  useFrame((state, delta) => {
    if (!group.current) return;
    if (targetQuaternion) {
      group.current.quaternion.slerp(targetQuaternion, 0.045);
    } else {
      group.current.rotation.y += delta * 0.035;
      group.current.rotation.x = THREE.MathUtils.lerp(group.current.rotation.x, state.pointer.y * 0.09 - 0.08, 0.025);
      group.current.rotation.z = THREE.MathUtils.lerp(group.current.rotation.z, state.pointer.x * -0.035, 0.02);
    }
  });

  return (
    <group ref={group} rotation={[-0.08, -1.38, 0]}>
      <mesh receiveShadow>
        <sphereGeometry args={[GLOBE_RADIUS, mobile ? 56 : 72, mobile ? 56 : 72]} />
        <meshPhysicalMaterial color="#041116" roughness={0.72} metalness={0.5} clearcoat={0.2} />
      </mesh>
      <CountryOutlines />
      <mesh>
        <sphereGeometry args={[GLOBE_RADIUS + 0.095, 48, 48]} />
        <meshBasicMaterial color="#68e7ff" transparent opacity={0.045} side={THREE.BackSide} />
      </mesh>
      {routes.map((route, index) => <AnimatedRoute key={route.label} route={route} index={index} selected={selected} />)}
      {globalLocations.map((location, index) => <LocationMarker key={location.name} location={location} index={index} mobile={mobile} selected={selected?.name === location.name} onSelect={onSelect} />)}
    </group>
  );
}

export default function GlobeScene({ selectedName, onSelect }: { selectedName: string | null; onSelect: (name: string) => void }) {
  const [mobile, setMobile] = useState(false);
  const selected = globalLocations.find((location) => location.name === selectedName) ?? null;

  useEffect(() => {
    const query = window.matchMedia("(max-width: 767px)");
    const update = () => setMobile(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  return (
    <Canvas
      dpr={mobile ? 1 : [1, 1.5]}
      camera={{ position: [0, 0.15, 7.55], fov: 38 }}
      gl={{ antialias: !mobile, alpha: true, powerPreference: "high-performance" }}
      performance={{ min: 0.55 }}
    >
      <ambientLight intensity={0.55} color="#bdeaf0" />
      <directionalLight position={[4, 4, 5]} intensity={3.2} color="#c9f6ff" />
      <directionalLight position={[-4, -1, 2]} intensity={1.2} color="#d4c997" />
      <NetworkGlobe mobile={mobile} selected={selected} onSelect={onSelect} />
      <Sparkles count={mobile ? 36 : 55} scale={[8, 7, 5]} size={0.75} speed={0.08} opacity={0.18} />
      <OrbitControls
        enabled={!selected}
        enablePan={false}
        enableZoom={false}
        enableDamping
        dampingFactor={0.065}
        rotateSpeed={0.48}
        minPolarAngle={Math.PI * 0.22}
        maxPolarAngle={Math.PI * 0.78}
      />
    </Canvas>
  );
}
