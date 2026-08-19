"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef, useState } from "react";
import type { MotionValue } from "framer-motion";
import * as THREE from "three";

const GOLDEN_ANGLE = Math.PI * (3 - Math.sqrt(5));
const TAU = Math.PI * 2;

type ParticleJourneySceneProps = {
  progress: MotionValue<number>;
  activeStep: number;
  reducedMotion: boolean;
  active: boolean;
};

type ParticleFieldProps = Omit<ParticleJourneySceneProps, "active"> & {
  mobile: boolean;
};

type Point2 = readonly [number, number];
type Point3 = readonly [number, number, number];

const vertexShader = /* glsl */ `
  uniform float uSize;
  uniform float uTime;
  attribute float aSeed;
  varying float vSeed;

  void main() {
    vSeed = aSeed;
    vec4 viewPosition = modelViewMatrix * vec4(position, 1.0);
    float twinkle = 1.0 + sin(uTime * 1.35 + aSeed * 24.0) * 0.12;
    gl_PointSize = uSize * twinkle * (7.0 / max(2.35, -viewPosition.z));
    gl_Position = projectionMatrix * viewPosition;
  }
`;

const fragmentShader = /* glsl */ `
  uniform float uJourney;
  varying float vSeed;

  void main() {
    float distanceFromCenter = distance(gl_PointCoord, vec2(0.5));
    float halo = 1.0 - smoothstep(0.12, 0.5, distanceFromCenter);
    float core = 1.0 - smoothstep(0.0, 0.12, distanceFromCenter);
    vec3 cyan = vec3(0.20, 0.78, 0.92);
    vec3 violet = vec3(0.54, 0.46, 1.0);
    vec3 ice = vec3(0.88, 0.99, 1.0);
    vec3 phaseColor = mix(cyan, violet, smoothstep(0.48, 1.0, uJourney));
    vec3 color = mix(phaseColor, ice, smoothstep(0.12, 0.96, vSeed));
    float alpha = halo * (0.62 + core * 0.38);
    gl_FragColor = vec4(color + core * 0.34, alpha);
  }
`;

const linePoint3 = (start: Point3, end: Point3, progress: number): Point3 => [
  THREE.MathUtils.lerp(start[0], end[0], progress),
  THREE.MathUtils.lerp(start[1], end[1], progress),
  THREE.MathUtils.lerp(start[2], end[2], progress),
];

function signalPoint(index: number, count: number): Point3 {
  const strokeCount = 7;
  const stroke = index % strokeCount;
  const progress =
    Math.floor(index / strokeCount) /
    Math.max(1, Math.ceil(count / strokeCount) - 1);
  const angle = progress * TAU;

  if (stroke === 0) {
    return [
      Math.cos(angle) * 0.24,
      Math.sin(angle) * 0.24,
      Math.sin(angle * 2) * 0.08,
    ];
  }

  const radius = 0.48 + stroke * 0.29;
  const arc = Math.PI * (0.13 + progress * 0.74);
  return [
    Math.cos(arc) * radius,
    -0.72 + Math.sin(arc) * radius,
    Math.sin(angle + stroke * 0.7) * radius * 0.24,
  ];
}

function globePoint(index: number, count: number): Point3 {
  const strokeCount = 12;
  const stroke = index % strokeCount;
  const progress =
    Math.floor(index / strokeCount) /
    Math.max(1, Math.ceil(count / strokeCount) - 1);
  const angle = progress * TAU;
  const radius = 2.05;

  if (stroke < 6) {
    const longitude = -Math.PI * 0.48 + (stroke / 5) * Math.PI * 0.96;
    return [
      radius * Math.cos(angle) * Math.cos(longitude),
      radius * Math.sin(angle),
      radius * Math.cos(angle) * Math.sin(longitude),
    ];
  }

  if (stroke < 10) {
    const latitude = -0.84 + ((stroke - 6) / 3) * 1.68;
    const latitudeRadius = Math.cos(latitude) * radius;
    return [
      latitudeRadius * Math.cos(angle),
      Math.sin(latitude) * radius,
      latitudeRadius * Math.sin(angle),
    ];
  }

  if (stroke === 10) {
    const routeAngle = -2.5 + progress * 3.45;
    const latitude = -0.48 + Math.sin(progress * Math.PI) * 1.28;
    const routeRadius = Math.cos(latitude) * (radius + 0.04);
    return [
      routeRadius * Math.cos(routeAngle),
      Math.sin(latitude) * (radius + 0.04),
      routeRadius * Math.sin(routeAngle),
    ];
  }

  const nodes: Point3[] = [
    [-1.52, -0.92, 0.72],
    [-0.58, 0.68, 1.7],
    [0.5, 1.3, 1.38],
    [1.58, 0.58, 0.88],
  ];
  const nodeProgress = progress * nodes.length;
  const node = nodes[Math.min(nodes.length - 1, Math.floor(nodeProgress))];
  const nodeAngle = (nodeProgress % 1) * TAU;
  return [
    node[0] + Math.cos(nodeAngle) * 0.13,
    node[1] + Math.sin(nodeAngle) * 0.13,
    node[2],
  ];
}

const cubeEdges: ReadonlyArray<readonly [Point3, Point3]> = [
  [[-1.65, -1.65, -1.65], [1.65, -1.65, -1.65]],
  [[1.65, -1.65, -1.65], [1.65, 1.65, -1.65]],
  [[1.65, 1.65, -1.65], [-1.65, 1.65, -1.65]],
  [[-1.65, 1.65, -1.65], [-1.65, -1.65, -1.65]],
  [[-1.65, -1.65, 1.65], [1.65, -1.65, 1.65]],
  [[1.65, -1.65, 1.65], [1.65, 1.65, 1.65]],
  [[1.65, 1.65, 1.65], [-1.65, 1.65, 1.65]],
  [[-1.65, 1.65, 1.65], [-1.65, -1.65, 1.65]],
  [[-1.65, -1.65, -1.65], [-1.65, -1.65, 1.65]],
  [[1.65, -1.65, -1.65], [1.65, -1.65, 1.65]],
  [[1.65, 1.65, -1.65], [1.65, 1.65, 1.65]],
  [[-1.65, 1.65, -1.65], [-1.65, 1.65, 1.65]],
  [[-0.82, -1.65, -1.65], [-0.82, 1.65, -1.65]],
  [[0.82, -1.65, 1.65], [0.82, 1.65, 1.65]],
];

function cubePoint(index: number, count: number): Point3 {
  const edge = index % cubeEdges.length;
  const progress =
    Math.floor(index / cubeEdges.length) /
    Math.max(1, Math.ceil(count / cubeEdges.length) - 1);
  return linePoint3(cubeEdges[edge][0], cubeEdges[edge][1], progress);
}

function createBrainCurves() {
  const curve = (points: Point2[], closed = false) =>
    new THREE.CatmullRomCurve3(
      points.map(([x, y]) => new THREE.Vector3(x, y, 0)),
      closed,
      "centripetal",
      0.5,
    );

  return [
    curve(
      [
        [0, 1.48], [-0.38, 1.78], [-0.92, 1.66], [-1.55, 1.1],
        [-1.48, 0.72], [-1.78, 0.38], [-1.7, -0.1], [-1.48, -0.9],
        [-0.88, -1.56], [-0.38, -1.62], [0, -1.42], [0.38, -1.62],
        [0.88, -1.56], [1.48, -0.9], [1.7, -0.1], [1.78, 0.38],
        [1.48, 0.72], [1.55, 1.1], [0.92, 1.66], [0.38, 1.78],
      ],
      true,
    ),
    curve([[0, -1.4], [-0.08, -0.82], [0.1, -0.28], [-0.08, 0.28], [0.1, 0.84], [0, 1.48]]),
    curve([[-0.12, 1.16], [-0.58, 1.42], [-1.18, 1.28], [-1.32, 0.85], [-0.94, 0.62], [-0.5, 0.76]]),
    curve([[0.12, 1.16], [0.58, 1.42], [1.18, 1.28], [1.32, 0.85], [0.94, 0.62], [0.5, 0.76]]),
    curve([[-0.18, 0.42], [-0.58, 0.68], [-1.18, 0.48], [-1.38, 0.08], [-1.02, -0.18], [-0.48, -0.04]]),
    curve([[0.18, 0.42], [0.58, 0.68], [1.18, 0.48], [1.38, 0.08], [1.02, -0.18], [0.48, -0.04]]),
    curve([[-0.18, -0.38], [-0.58, -0.16], [-1.16, -0.42], [-1.22, -0.88], [-0.78, -1.14], [-0.42, -0.92]]),
    curve([[0.18, -0.38], [0.58, -0.16], [1.16, -0.42], [1.22, -0.88], [0.78, -1.14], [0.42, -0.92]]),
  ];
}

function createTargets(count: number) {
  const targets = Array.from({ length: 4 }, () => new Float32Array(count * 3));
  const brainCurves = createBrainCurves();

  for (let index = 0; index < count; index += 1) {
    const offset = index * 3;
    const signal = signalPoint(index, count);
    const globe = globePoint(index, count);
    const cube = cubePoint(index, count);
    const brainStroke = index % brainCurves.length;
    const brainProgress =
      Math.floor(index / brainCurves.length) /
      Math.max(1, Math.ceil(count / brainCurves.length) - 1);
    const brain = brainCurves[brainStroke].getPoint(
      THREE.MathUtils.clamp(brainProgress, 0, 1),
    );
    const brainDepth =
      Math.sin(brainProgress * TAU + brainStroke * 0.82) * 0.34 +
      (brainStroke % 2 === 0 ? -0.12 : 0.12);

    targets[0].set(signal, offset);
    targets[1].set(globe, offset);
    targets[2].set(cube, offset);
    targets[3].set([brain.x * 1.18, brain.y * 1.18, brainDepth], offset);
  }

  return targets;
}

function resolveJourney(
  progress: MotionValue<number>,
  activeStep: number,
  reducedMotion: boolean,
) {
  const journeyProgress = THREE.MathUtils.clamp(
    reducedMotion ? activeStep / 3 : progress.get(),
    0,
    1,
  );
  const stageProgress = journeyProgress * 3;
  const interval = Math.min(2, Math.floor(stageProgress));
  const intervalProgress = stageProgress >= 3 ? 1 : stageProgress - interval;
  const holdStart = 0.24;
  const holdEnd = 0.76;
  const isStartHold = intervalProgress <= holdStart;
  const isEndHold = intervalProgress >= holdEnd;
  const fromStage = isEndHold ? interval + 1 : interval;
  const toStage = isStartHold ? interval : interval + 1;
  const rawMix =
    isStartHold || isEndHold
      ? 0
      : (intervalProgress - holdStart) / (holdEnd - holdStart);
  const mix = rawMix * rawMix * (3 - 2 * rawMix);

  return { journeyProgress, fromStage, toStage, mix };
}

function CameraJourney({
  progress,
  activeStep,
  reducedMotion,
  mobile,
}: ParticleFieldProps) {
  const camera = useThree((state) => state.camera);
  const target = useMemo(() => new THREE.Vector3(), []);
  const cameraPositions = useMemo(
    () =>
      mobile
        ? [
            new THREE.Vector3(0.16, 0.04, 7.9),
            new THREE.Vector3(-0.18, 0, 8.15),
            new THREE.Vector3(0.14, 0.08, 8.35),
            new THREE.Vector3(0, -0.04, 7.8),
          ]
        : [
            new THREE.Vector3(0.28, 0.06, 6.75),
            new THREE.Vector3(-0.28, 0, 7.35),
            new THREE.Vector3(0.22, 0.12, 7.55),
            new THREE.Vector3(0, -0.05, 6.95),
          ],
    [mobile],
  );

  useFrame((state) => {
    const { fromStage, toStage, mix } = resolveJourney(
      progress,
      activeStep,
      reducedMotion,
    );
    target.copy(cameraPositions[fromStage]).lerp(cameraPositions[toStage], mix);

    if (!reducedMotion) {
      target.x += Math.sin(state.clock.elapsedTime * 0.34) * 0.045;
      target.y += Math.sin(state.clock.elapsedTime * 0.43) * 0.025;
    }

    camera.position.lerp(target, reducedMotion ? 1 : 0.075);
    camera.lookAt(0, 0, 0);
  });

  return null;
}

function ParticleField({
  progress,
  activeStep,
  reducedMotion,
  mobile,
}: ParticleFieldProps) {
  const particles = useRef<THREE.Points>(null);
  const positionAttribute = useRef<THREE.BufferAttribute>(null);
  const material = useRef<THREE.ShaderMaterial>(null);
  const count = mobile ? 900 : 1800;
  const targets = useMemo(() => createTargets(count), [count]);
  const positions = useMemo(() => new Float32Array(targets[0]), [targets]);
  const seeds = useMemo(() => {
    const values = new Float32Array(count);
    for (let index = 0; index < count; index += 1) {
      values[index] = (Math.sin(index * 12.9898) + 1) * 0.5;
    }
    return values;
  }, [count]);
  const uniforms = useMemo(
    () => ({
      uSize: { value: mobile ? 6.1 : 7.4 },
      uTime: { value: 0 },
      uJourney: { value: 0 },
    }),
    [mobile],
  );

  useFrame((state) => {
    const points = particles.current;
    const attribute = positionAttribute.current;
    const shader = material.current;
    if (!points || !attribute || !shader) return;

    const { journeyProgress, fromStage, toStage, mix } = resolveJourney(
      progress,
      activeStep,
      reducedMotion,
    );
    const transitionScatter =
      Math.sin(mix * Math.PI) * (mobile ? 0.38 : 0.54);
    const array = attribute.array as Float32Array;

    for (let index = 0; index < count; index += 1) {
      const offset = index * 3;
      const scatterAngle = index * GOLDEN_ANGLE;
      const depthWave = Math.sin(index * 0.37 + scatterAngle);
      array[offset] =
        THREE.MathUtils.lerp(
          targets[fromStage][offset],
          targets[toStage][offset],
          mix,
        ) + Math.cos(scatterAngle) * transitionScatter;
      array[offset + 1] =
        THREE.MathUtils.lerp(
          targets[fromStage][offset + 1],
          targets[toStage][offset + 1],
          mix,
        ) + Math.sin(scatterAngle) * transitionScatter;
      array[offset + 2] =
        THREE.MathUtils.lerp(
          targets[fromStage][offset + 2],
          targets[toStage][offset + 2],
          mix,
        ) + depthWave * transitionScatter * 1.8;
    }

    attribute.needsUpdate = true;
    const transitionTilt = Math.sin(mix * Math.PI);
    const idleTime = reducedMotion ? 0 : state.clock.elapsedTime;
    const stageRotation = [0.08, -0.24, 0.42, -0.12];
    const targetRotation = THREE.MathUtils.lerp(
      stageRotation[fromStage],
      stageRotation[toStage],
      mix,
    );
    points.rotation.y = THREE.MathUtils.lerp(
      points.rotation.y,
      targetRotation + Math.sin(idleTime * 0.24) * 0.045,
      0.075,
    );
    points.rotation.x = THREE.MathUtils.lerp(
      points.rotation.x,
      transitionTilt * -0.09 + Math.sin(idleTime * 0.31) * 0.018,
      0.075,
    );
    points.scale.setScalar(1 + transitionTilt * 0.055);
    shader.uniforms.uTime.value = idleTime;
    shader.uniforms.uJourney.value = journeyProgress;
  });

  return (
    <points ref={particles} frustumCulled={false}>
      <bufferGeometry>
        <bufferAttribute
          ref={positionAttribute}
          attach="attributes-position"
          args={[positions, 3]}
        />
        <bufferAttribute attach="attributes-aSeed" args={[seeds, 1]} />
      </bufferGeometry>
      <shaderMaterial
        ref={material}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        toneMapped={false}
      />
    </points>
  );
}

export default function ParticleJourneyScene({
  progress,
  activeStep,
  reducedMotion,
  active,
}: ParticleJourneySceneProps) {
  const [mobile, setMobile] = useState(false);

  useEffect(() => {
    const query = window.matchMedia("(max-width: 767px)");
    const update = () => setMobile(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  return (
    <Canvas
      dpr={mobile ? 1 : [1, 1.65]}
      camera={{
        position: [0, 0, mobile ? 7.9 : 6.75],
        fov: mobile ? 46 : 40,
        near: 0.1,
        far: 50,
      }}
      gl={{
        antialias: true,
        alpha: true,
        powerPreference: "high-performance",
      }}
      frameloop={active ? "always" : "never"}
      performance={{ min: 0.55 }}
    >
      <CameraJourney
        progress={progress}
        activeStep={activeStep}
        reducedMotion={reducedMotion}
        mobile={mobile}
      />
      <ParticleField
        progress={progress}
        activeStep={activeStep}
        reducedMotion={reducedMotion}
        mobile={mobile}
      />
    </Canvas>
  );
}
