"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Html, Line, OrbitControls, Sparkles } from "@react-three/drei";
import { feature } from "topojson-client";
import countries from "world-atlas/countries-110m.json";
import { useEffect, useMemo, useRef, useState, type RefObject } from "react";
import * as THREE from "three";
import { globalLocations, GlobalLocation, GlobalRoute, routes } from "@/data/content";

type GlobeInteractionState = { interactive: RefObject<boolean> };

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

const pointInRing = (lon: number, lat: number, ring: number[][]) => {
  let inside = false;
  for (let index = 0, previous = ring.length - 1; index < ring.length; previous = index, index += 1) {
    const [x, y] = ring[index];
    const [previousX, previousY] = ring[previous];
    if ((y > lat) !== (previousY > lat) && lon < ((previousX - x) * (lat - y)) / (previousY - y) + x) inside = !inside;
  }
  return inside;
};

const coordinateIsLand = (lon: number, lat: number, geometries: CountryGeometry[]) => geometries.some((geometry) => {
  const polygons = geometry.type === "Polygon"
    ? [geometry.coordinates as number[][][]]
    : geometry.coordinates as number[][][][];
  return polygons.some((polygon) => pointInRing(lon, lat, polygon[0]) && !polygon.slice(1).some((hole) => pointInRing(lon, lat, hole)));
});

function CountryDots() {
  const geometry = useMemo(() => {
    const world = feature(
      countries as unknown as Parameters<typeof feature>[0],
      countries.objects.countries as unknown as Parameters<typeof feature>[1],
    ) as unknown as { features: Array<{ geometry: CountryGeometry }> };
    const geometries = world.features.map((country) => country.geometry);
    const points: THREE.Vector3[] = [];
    const count = 11500;
    const goldenAngle = Math.PI * (3 - Math.sqrt(5));

    for (let index = 0; index < count; index += 1) {
      const y = 1 - (index / (count - 1)) * 2;
      const lat = (Math.asin(y) * 180) / Math.PI;
      let lon = ((goldenAngle * index * 180) / Math.PI) % 360;
      if (lon > 180) lon -= 360;
      if (coordinateIsLand(lon, lat, geometries)) points.push(globePoint(lat, lon, GLOBE_RADIUS + 0.022));
    }

    return new THREE.BufferGeometry().setFromPoints(points);
  }, []);

  return (
    <points geometry={geometry}>
      <pointsMaterial color="#f4f8ff" size={0.026} transparent opacity={0.78} depthWrite={false} sizeAttenuation />
    </points>
  );
}

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
      <lineBasicMaterial color="#c8d9ea" transparent opacity={0.19} depthWrite={false} />
    </lineSegments>
  );
}

const samePoint = (first: [number, number], second: [number, number]) => first[0] === second[0] && first[1] === second[1];

function AnimatedRoute({ route, index, selected }: { route: GlobalRoute; index: number; selected: GlobalLocation | null }) {
  const particle = useRef<THREE.Group>(null);
  const active = !selected || samePoint(route.from, selected.coordinates) || samePoint(route.to, selected.coordinates);
  const curve = useMemo(() => {
    const start = globePoint(...route.from, GLOBE_RADIUS + 0.035);
    const end = globePoint(...route.to, GLOBE_RADIUS + 0.035);
    const distance = start.distanceTo(end);
    const middle = start.clone().add(end).multiplyScalar(0.5).normalize().multiplyScalar(GLOBE_RADIUS + 0.3 + distance * 0.14);
    return new THREE.QuadraticBezierCurve3(start, middle, end);
  }, [route]);
  const points = useMemo(() => curve.getPoints(48), [curve]);

  useFrame(({ clock }) => {
    if (!particle.current) return;
    const routeProgress = (clock.elapsedTime * (0.075 + index * 0.004) + index / routes.length) % 1;
    particle.current.position.copy(curve.getPointAt(routeProgress));
    const pulse = 0.8 + Math.sin(clock.elapsedTime * 4 + index) * 0.18;
    particle.current.scale.setScalar(pulse * (active ? 1.25 : 0.45));
  });

  return (
    <>
      <Line points={points} color={active ? "#ff7a2f" : "#5a3022"} lineWidth={active && selected ? 4.8 : 2.8} transparent opacity={active ? (selected ? 0.18 : 0.1) : 0.035} depthWrite={false} />
      <Line points={points} color={active ? (selected ? "#ffb05c" : "#ff8738") : "#633423"} lineWidth={active && selected ? 1.85 : 1.05} transparent opacity={active ? (selected ? 0.95 : 0.64) : 0.1} depthWrite={false} />
      <group ref={particle}>
        <mesh>
          <sphereGeometry args={[0.064, 10, 10]} />
          <meshBasicMaterial color="#ff6b22" transparent opacity={active ? 0.16 : 0.03} depthWrite={false} toneMapped={false} />
        </mesh>
        <mesh>
          <sphereGeometry args={[0.025, 8, 8]} />
          <meshBasicMaterial color={active ? "#ffd2a1" : "#633423"} transparent opacity={active ? 1 : 0.14} toneMapped={false} />
        </mesh>
      </group>
    </>
  );
}

function LocationMarker({ location, index, mobile, enabled, onSelect }: { location: GlobalLocation; index: number; mobile: boolean; enabled: boolean; onSelect: (name: string) => void }) {
  const group = useRef<THREE.Group>(null);
  const pulse = useRef<THREE.Mesh>(null);
  const label = useRef<HTMLDivElement>(null);
  const position = useMemo(() => globePoint(...location.coordinates, GLOBE_RADIUS + 0.055), [location]);
  const [labelX, labelY] = location.labelOffset ?? [0, -18];

  useFrame(({ clock }) => {
    if (!group.current) return;
    if (label.current) label.current.style.opacity = "1";
    if (pulse.current) {
      const scale = 1.15 + Math.sin(clock.elapsedTime * 2.2 + index * 0.7) * 0.28;
      pulse.current.scale.setScalar(scale);
    }
    group.current.scale.setScalar(THREE.MathUtils.lerp(group.current.scale.x, 1, 0.08));
  });

  return (
    <group
      ref={group}
      position={position}
      onClick={enabled ? (event) => { event.stopPropagation(); onSelect(location.name); } : undefined}
      onPointerOver={enabled ? (event) => { event.stopPropagation(); document.body.style.cursor = "pointer"; } : undefined}
      onPointerOut={enabled ? () => { document.body.style.cursor = ""; } : undefined}
    >
      <mesh>
        <sphereGeometry args={[0.034, 12, 12]} />
        <meshBasicMaterial color="#d4c997" toneMapped={false} />
      </mesh>
      <mesh ref={pulse}>
        <sphereGeometry args={[0.061, 12, 12]} />
        <meshBasicMaterial color="#68e7ff" transparent opacity={0.16} depthWrite={false} />
      </mesh>
      {location.showLabel !== false && (
        <Html center position={[0, 0, 0]} distanceFactor={mobile ? 1.85 : 2.15} zIndexRange={[60, 40]}>
          <div
            ref={label}
            style={{ transform: `translate(${labelX}px, ${labelY}px)` }}
            className="network-globe-label"
          >
            {location.name}
          </div>
        </Html>
      )}
    </group>
  );
}

function NetworkGlobe({ mobile, interactive }: { mobile: boolean } & GlobeInteractionState) {
  const group = useRef<THREE.Group>(null);

  useFrame((state, delta) => {
    if (!group.current) return;
    if (!interactive.current) {
      if (mobile) {
        group.current.rotation.y += delta * 0.07;
      } else {
        group.current.rotation.y = THREE.MathUtils.lerp(group.current.rotation.y, -2.4, 0.065);
        group.current.rotation.x = THREE.MathUtils.lerp(group.current.rotation.x, state.pointer.y * 0.09 - 0.08, 0.025);
        group.current.rotation.z = THREE.MathUtils.lerp(group.current.rotation.z, state.pointer.x * -0.035, 0.02);
      }
    }
  });

  return (
    <group ref={group} rotation={[-0.08, -2.4, 0]}>
      <mesh receiveShadow>
        <sphereGeometry args={[GLOBE_RADIUS * 0.83, mobile ? 48 : 64, mobile ? 48 : 64]} />
        <meshPhysicalMaterial color="#010204" roughness={0.76} metalness={0.56} clearcoat={0.18} />
      </mesh>
      <CountryDots />
      <CountryOutlines />
      <mesh>
        <sphereGeometry args={[GLOBE_RADIUS + 0.095, 48, 48]} />
        <meshBasicMaterial color="#68e7ff" transparent opacity={0.045} side={THREE.BackSide} />
      </mesh>
      {routes.map((route, index) => <AnimatedRoute key={route.label} route={route} index={index} selected={null} />)}
      {globalLocations.map((location, index) => (
        <LocationMarker
          key={location.name}
          location={location}
          index={index}
          mobile={mobile}
          enabled={false}
          onSelect={() => undefined}
        />
      ))}
    </group>
  );
}

export default function GlobeScene({ active }: { active: boolean }) {
  const interactive = useRef(false);
  const [canvas, setCanvas] = useState<HTMLCanvasElement | null>(null);
  const [failed, setFailed] = useState(false);
  useEffect(() => {
    if (!canvas) return;
    const lost = () => setFailed(true);
    canvas.addEventListener("webglcontextlost", lost);
    return () => canvas.removeEventListener("webglcontextlost", lost);
  }, [canvas]);
  const [mobile, setMobile] = useState(false);

  useEffect(() => {
    const query = window.matchMedia("(max-width: 1023px)");
    const update = () => setMobile(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  if (failed) throw new Error("Globe graphics context unavailable");

  return (
    <Canvas
      onCreated={({ gl }) => setCanvas(gl.domElement)}
      frameloop={active ? "always" : "demand"}
      dpr={mobile ? 1 : [1, 1.35]}
      camera={{ position: [0, 0.15, 7.55], fov: 38 }}
      gl={{ antialias: !mobile, alpha: true, powerPreference: "high-performance" }}
      performance={{ min: 0.55 }}
    >
      <ambientLight intensity={0.22} color="#a9c8ff" />
      <directionalLight position={[4, 4, 5]} intensity={2.9} color="#ff9447" />
      <directionalLight position={[-4, -2, 3]} intensity={2.4} color="#3975ff" />
      <NetworkGlobe mobile={mobile} interactive={interactive} />
      <Sparkles count={mobile ? 28 : 42} scale={[8, 7, 5]} size={0.75} speed={0.08} opacity={0.18} />
      <OrbitControls
        onStart={() => { interactive.current = true; }}
        enabled={active}
        enablePan={false}
        enableZoom={false}
        enableDamping
        dampingFactor={0.065}
        rotateSpeed={mobile ? 0.68 : 0.48}
        touches={{ ONE: THREE.TOUCH.ROTATE, TWO: THREE.TOUCH.ROTATE }}
        minPolarAngle={Math.PI * 0.22}
        maxPolarAngle={Math.PI * 0.78}
      />
    </Canvas>
  );
}
