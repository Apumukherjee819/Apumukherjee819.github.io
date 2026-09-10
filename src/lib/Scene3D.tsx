import { useRef, useMemo, useEffect, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Stars } from "@react-three/drei";
import { EffectComposer, Bloom, Vignette } from "@react-three/postprocessing";
import * as THREE from "three";
import { useScrollProgress } from "./ScrollContext";

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * Math.max(0, Math.min(1, t));
}

function smoothstep(edge0: number, edge1: number, x: number) {
  const t = Math.max(0, Math.min(1, (x - edge0) / (edge1 - edge0)));
  return t * t * (3 - 2 * t);
}

// =========================================================================
// 1. Model 1: Bivariate Gaussian Surface (Large, Edge-to-Edge: RIGHT -> LEFT)
// Active: 0% -> 33% Scroll
// =========================================================================
function BivariateGaussianManifold({
  progress,
  intro,
}: {
  progress: number;
  intro: number;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const ring1Ref = useRef<THREE.Mesh>(null);
  const ring2Ref = useRef<THREE.Mesh>(null);

  const pStart = 0.0;
  const pEnd = 0.33;
  const t = Math.max(0, Math.min(1, (progress - pStart) / (pEnd - pStart)));

  // Smooth visibility envelope
  const fadeIn = smoothstep(0.0, 0.15, t);
  const fadeOut = 1 - smoothstep(0.70, 1.0, t);
  const visibility = Math.max(0, Math.min(1, fadeIn * fadeOut * intro));

  // Trajectory: Starts at right edge (+4.6) -> Center (0.0) -> Exits at left edge (-4.6)
  const posX = lerp(4.6, -4.6, t);
  const posY = 0.1 + Math.sin(t * Math.PI) * 0.35;
  const posZ = lerp(-3.8, -1.6, Math.sin(t * Math.PI));
  // Extra-large scale (grows from 0.6 at edge to 2.1 at center to cover the page!)
  const curScale = lerp(0.6, 2.1, Math.sin(t * Math.PI)) * Math.max(visibility, 0.02);

  const { surfaceGeo, gridGeo } = useMemo(() => {
    const gridRes = 36;
    const size = 3.2;
    const step = size / gridRes;
    const half = size / 2;
    const sigma = 0.78;
    const amp = 1.35;

    const vertices: number[] = [];
    const colors: number[] = [];
    const indices: number[] = [];
    const gridPoints: number[] = [];

    for (let i = 0; i <= gridRes; i++) {
      const x = -half + i * step;
      for (let j = 0; j <= gridRes; j++) {
        const y = -half + j * step;
        const r2 = x * x + y * y;
        const z = amp * Math.exp(-r2 / (2 * sigma * sigma));

        vertices.push(x, z - 0.45, y);

        const pt = Math.min(Math.max(z / amp, 0), 1);
        const c = new THREE.Color();
        if (pt < 0.32) {
          c.setHSL(0.55, 0.95, 0.38);
        } else if (pt < 0.72) {
          c.setHSL(0.42, 0.95, 0.52);
        } else {
          c.setHSL(0.78, 0.9, 0.68);
        }
        colors.push(c.r, c.g, c.b);
      }
    }

    for (let i = 0; i < gridRes; i++) {
      for (let j = 0; j < gridRes; j++) {
        const a = i * (gridRes + 1) + j;
        const b = a + 1;
        const c = (i + 1) * (gridRes + 1) + j;
        const d = c + 1;
        indices.push(a, c, b);
        indices.push(b, c, d);
      }
    }

    for (let i = 0; i <= gridRes; i += 2) {
      for (let j = 0; j < gridRes; j++) {
        const idx1 = (i * (gridRes + 1) + j) * 3;
        const idx2 = (i * (gridRes + 1) + (j + 1)) * 3;
        gridPoints.push(
          vertices[idx1], vertices[idx1 + 1], vertices[idx1 + 2],
          vertices[idx2], vertices[idx2 + 1], vertices[idx2 + 2]
        );
      }
    }
    for (let j = 0; j <= gridRes; j += 2) {
      for (let i = 0; i < gridRes; i++) {
        const idx1 = (i * (gridRes + 1) + j) * 3;
        const idx2 = ((i + 1) * (gridRes + 1) + j) * 3;
        gridPoints.push(
          vertices[idx1], vertices[idx1 + 1], vertices[idx1 + 2],
          vertices[idx2], vertices[idx2 + 1], vertices[idx2 + 2]
        );
      }
    }

    const sGeo = new THREE.BufferGeometry();
    sGeo.setAttribute("position", new THREE.Float32BufferAttribute(vertices, 3));
    sGeo.setAttribute("color", new THREE.Float32BufferAttribute(colors, 3));
    sGeo.setIndex(indices);
    sGeo.computeVertexNormals();

    const gGeo = new THREE.BufferGeometry();
    gGeo.setAttribute("position", new THREE.Float32BufferAttribute(gridPoints, 3));

    return { surfaceGeo: sGeo, gridGeo: gGeo };
  }, []);

  useFrame((state, delta) => {
    if (groupRef.current && visibility > 0.001) {
      groupRef.current.rotation.y += delta * 0.04;
      groupRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.12) * 0.08;
      groupRef.current.rotation.z = (t - 0.5) * 0.45; // banking tilt
    }
    if (ring1Ref.current && visibility > 0.001) ring1Ref.current.rotation.z += delta * 0.06;
    if (ring2Ref.current && visibility > 0.001) ring2Ref.current.rotation.z -= delta * 0.04;
  });

  if (visibility <= 0.001) return null;

  return (
    <group
      ref={groupRef}
      position={[posX, posY, posZ]}
      scale={curScale}
    >
      <mesh geometry={surfaceGeo}>
        <meshStandardMaterial
          vertexColors
          transparent
          opacity={visibility * 0.45}
          roughness={0.25}
          metalness={0.7}
          side={THREE.DoubleSide}
        />
      </mesh>

      <lineSegments geometry={gridGeo}>
        <lineBasicMaterial color="#00f0ff" transparent opacity={visibility * 0.85} />
      </lineSegments>

      <mesh ref={ring1Ref} position={[0, 0.15, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.95, 0.008, 16, 64]} />
        <meshBasicMaterial color="#00ff9d" transparent opacity={visibility * 0.75} />
      </mesh>

      <mesh ref={ring2Ref} position={[0, -0.32, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[1.55, 0.006, 16, 64]} />
        <meshBasicMaterial color="#c084fc" transparent opacity={visibility * 0.45} />
      </mesh>
    </group>
  );
}

// =========================================================================
// 2. Model 2: Hyperbolic Paraboloid Saddle & Lorenz Flow (LEFT -> RIGHT)
// Active: 35% -> 67% Scroll
// =========================================================================
function LorenzSaddleManifold({
  progress,
  intro,
}: {
  progress: number;
  intro: number;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const lorenzRef = useRef<THREE.Points>(null);

  const pStart = 0.35;
  const pEnd = 0.67;
  const t = Math.max(0, Math.min(1, (progress - pStart) / (pEnd - pStart)));

  const fadeIn = smoothstep(0.0, 0.15, t);
  const fadeOut = 1 - smoothstep(0.70, 1.0, t);
  const visibility = Math.max(0, Math.min(1, fadeIn * fadeOut * intro));

  // Trajectory: Starts at left edge (-4.6) -> Center (0.0) -> Exits at right edge (+4.6)
  const posX = lerp(-4.6, 4.6, t);
  const posY = 0.1 + Math.sin(t * Math.PI) * 0.3;
  const posZ = lerp(-3.8, -1.6, Math.sin(t * Math.PI));
  // Extra-large scale (grows from 0.6 at edge to 2.0 at center)
  const curScale = lerp(0.6, 2.0, Math.sin(t * Math.PI)) * Math.max(visibility, 0.02);

  const { saddleGeo, gridGeo } = useMemo(() => {
    const res = 32;
    const size = 3.2;
    const step = size / res;
    const half = size / 2;
    const a = 1.45;

    const vertices: number[] = [];
    const colors: number[] = [];
    const indices: number[] = [];
    const lines: number[] = [];

    for (let i = 0; i <= res; i++) {
      const x = -half + i * step;
      for (let j = 0; j <= res; j++) {
        const y = -half + j * step;
        const z = (x * x - y * y) / a;

        vertices.push(x, z * 0.4, y);

        const c = new THREE.Color().setHSL(0.55 + (z / 2) * 0.25, 0.95, 0.5);
        colors.push(c.r, c.g, c.b);
      }
    }

    for (let i = 0; i < res; i++) {
      for (let j = 0; j < res; j++) {
        const aIdx = i * (res + 1) + j;
        const bIdx = aIdx + 1;
        const cIdx = (i + 1) * (res + 1) + j;
        const dIdx = cIdx + 1;
        indices.push(aIdx, cIdx, bIdx);
        indices.push(bIdx, cIdx, dIdx);
      }
    }

    for (let i = 0; i <= res; i += 2) {
      for (let j = 0; j < res; j++) {
        const p1 = (i * (res + 1) + j) * 3;
        const p2 = (i * (res + 1) + (j + 1)) * 3;
        lines.push(
          vertices[p1], vertices[p1 + 1], vertices[p1 + 2],
          vertices[p2], vertices[p2 + 1], vertices[p2 + 2]
        );
      }
    }
    for (let j = 0; j <= res; j += 2) {
      for (let i = 0; i < res; i++) {
        const p1 = (i * (res + 1) + j) * 3;
        const p2 = ((i + 1) * (res + 1) + j) * 3;
        lines.push(
          vertices[p1], vertices[p1 + 1], vertices[p1 + 2],
          vertices[p2], vertices[p2 + 1], vertices[p2 + 2]
        );
      }
    }

    const sGeo = new THREE.BufferGeometry();
    sGeo.setAttribute("position", new THREE.Float32BufferAttribute(vertices, 3));
    sGeo.setAttribute("color", new THREE.Float32BufferAttribute(colors, 3));
    sGeo.setIndex(indices);
    sGeo.computeVertexNormals();

    const gGeo = new THREE.BufferGeometry();
    gGeo.setAttribute("position", new THREE.Float32BufferAttribute(lines, 3));

    return { saddleGeo: sGeo, gridGeo: gGeo };
  }, []);

  const { lorenzPointsGeo } = useMemo(() => {
    const numPoints = 1100;
    const pts: number[] = [];
    const cols: number[] = [];

    let x = 0.1, y = 0, z = 0;
    const sigma = 10, rho = 28, beta = 8 / 3;
    const dt = 0.007;

    for (let i = 0; i < numPoints; i++) {
      const dx = sigma * (y - x) * dt;
      const dy = (x * (rho - z) - y) * dt;
      const dz = (x * y - beta * z) * dt;
      x += dx;
      y += dy;
      z += dz;

      pts.push(x * 0.065, (z - 25) * 0.06, y * 0.065);

      const color = new THREE.Color().setHSL(0.5 + (i / numPoints) * 0.35, 0.9, 0.6);
      cols.push(color.r, color.g, color.b);
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.Float32BufferAttribute(pts, 3));
    geo.setAttribute("color", new THREE.Float32BufferAttribute(cols, 3));
    return { lorenzPointsGeo: geo };
  }, []);

  useFrame((state, delta) => {
    if (groupRef.current && visibility > 0.001) {
      groupRef.current.rotation.y += delta * 0.045;
      groupRef.current.rotation.x = Math.cos(state.clock.elapsedTime * 0.10) * 0.08;
      groupRef.current.rotation.z = (0.5 - t) * 0.45;
    }
    if (lorenzRef.current && visibility > 0.001) {
      lorenzRef.current.rotation.y -= delta * 0.06;
    }
  });

  if (visibility <= 0.001) return null;

  return (
    <group
      ref={groupRef}
      position={[posX, posY, posZ]}
      scale={curScale}
    >
      <mesh geometry={saddleGeo}>
        <meshStandardMaterial
          vertexColors
          transparent
          opacity={visibility * 0.40}
          roughness={0.3}
          metalness={0.7}
          side={THREE.DoubleSide}
        />
      </mesh>

      <lineSegments geometry={gridGeo}>
        <lineBasicMaterial color="#00ffaa" transparent opacity={visibility * 0.80} />
      </lineSegments>

      <points ref={lorenzRef} geometry={lorenzPointsGeo}>
        <pointsMaterial
          size={0.035}
          vertexColors
          transparent
          opacity={visibility * 0.80}
          sizeAttenuation
        />
      </points>
    </group>
  );
}

// =========================================================================
// 3. Model 3: Geodesic Bloch Gyroscope (Large, Edge -> Center Immersion)
// Active: 69% -> 100% Scroll
// =========================================================================
function GeodesicGyroscopeManifold({
  progress,
  intro,
}: {
  progress: number;
  intro: number;
}) {
  const outerGroupRef = useRef<THREE.Group>(null);
  const innerIcosaRef = useRef<THREE.Mesh>(null);
  const ringXRef = useRef<THREE.Mesh>(null);
  const ringYRef = useRef<THREE.Mesh>(null);
  const ringZRef = useRef<THREE.Mesh>(null);

  const pStart = 0.69;
  const pEnd = 1.0;
  const t = Math.max(0, Math.min(1, (progress - pStart) / (pEnd - pStart)));

  const fadeIn = smoothstep(0.0, 0.22, t);
  const visibility = Math.max(0, Math.min(1, fadeIn * intro));

  // Trajectory: Enters from right edge (+4.5) -> Centers at (0.0) -> Expands to scale 1.95
  const posX = lerp(4.5, 0.0, smoothstep(0.0, 0.75, t));
  const posY = lerp(0.5, 0.0, smoothstep(0.0, 0.8, t));
  const posZ = lerp(-3.8, -1.6, smoothstep(0.0, 0.6, t));
  const curScale = lerp(0.6, 1.95, smoothstep(0.0, 0.55, t)) * Math.max(visibility, 0.02);

  useFrame((state, delta) => {
    if (outerGroupRef.current && visibility > 0.001) {
      outerGroupRef.current.rotation.y += delta * 0.035;
      outerGroupRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.1) * 0.08;
    }
    if (innerIcosaRef.current && visibility > 0.001) {
      innerIcosaRef.current.rotation.y -= delta * 0.06;
      innerIcosaRef.current.rotation.z += delta * 0.04;
    }
    if (ringXRef.current && visibility > 0.001) ringXRef.current.rotation.x += delta * 0.05;
    if (ringYRef.current && visibility > 0.001) ringYRef.current.rotation.y += delta * 0.07;
    if (ringZRef.current && visibility > 0.001) ringZRef.current.rotation.z -= delta * 0.06;
  });

  if (visibility <= 0.001) return null;

  return (
    <group
      ref={outerGroupRef}
      position={[posX, posY, posZ]}
      scale={curScale}
    >
      <mesh>
        <icosahedronGeometry args={[1.05, 2]} />
        <meshStandardMaterial
          color="#00f0ff"
          emissive="#005577"
          emissiveIntensity={0.4}
          wireframe={true}
          transparent
          opacity={visibility * 0.62}
        />
      </mesh>

      <mesh ref={innerIcosaRef}>
        <dodecahedronGeometry args={[0.62, 0]} />
        <meshStandardMaterial
          color="#c084fc"
          emissive="#7e22ce"
          emissiveIntensity={0.5}
          wireframe={true}
          transparent
          opacity={visibility * 0.72}
        />
      </mesh>

      <mesh>
        <octahedronGeometry args={[0.24, 0]} />
        <meshStandardMaterial
          color="#00ff9d"
          emissive="#00ff9d"
          emissiveIntensity={0.8}
          transparent
          opacity={visibility * 0.88}
        />
      </mesh>

      <mesh ref={ringXRef} rotation={[0, 0, 0]}>
        <torusGeometry args={[1.25, 0.008, 16, 64]} />
        <meshBasicMaterial color="#00f0ff" transparent opacity={visibility * 0.70} />
      </mesh>

      <mesh ref={ringYRef} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[1.35, 0.008, 16, 64]} />
        <meshBasicMaterial color="#00ff9d" transparent opacity={visibility * 0.60} />
      </mesh>

      <mesh ref={ringZRef} rotation={[0, Math.PI / 2, 0]}>
        <torusGeometry args={[1.45, 0.008, 16, 64]} />
        <meshBasicMaterial color="#ffb703" transparent opacity={visibility * 0.50} />
      </mesh>
    </group>
  );
}

// =========================================================================
// 4. Ambient Cyber Constellation
// =========================================================================
function AmbientGalaxy({ progress }: { progress: number }) {
  const pointsRef = useRef<THREE.Points>(null);

  const { posAttr, colAttr } = useMemo(() => {
    const count = 90;
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 14;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 10;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 6 - 2;

      const c = new THREE.Color(i % 2 === 0 ? "#00f0ff" : i % 3 === 0 ? "#00ff9d" : "#c084fc");
      col[i * 3] = c.r;
      col[i * 3 + 1] = c.g;
      col[i * 3 + 2] = c.b;
    }

    return {
      posAttr: new THREE.BufferAttribute(pos, 3),
      colAttr: new THREE.BufferAttribute(col, 3),
    };
  }, []);

  useFrame((state) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y = state.clock.elapsedTime * 0.008;
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <primitive object={posAttr} attach="attributes-position" />
        <primitive object={colAttr} attach="attributes-color" />
      </bufferGeometry>
      <pointsMaterial
        size={0.038}
        vertexColors
        transparent
        opacity={lerp(0.55, 0.30, progress)}
        sizeAttenuation
      />
    </points>
  );
}

// =========================================================================
// 5. Interactive Cursor Lighting
// =========================================================================
function CursorLight() {
  const lightRef = useRef<THREE.PointLight>(null);

  useFrame((state) => {
    if (lightRef.current) {
      const x = state.pointer.x * 5.0;
      const y = state.pointer.y * 3.5;
      lightRef.current.position.set(x, y, 2.2);
    }
  });

  return <pointLight ref={lightRef} color="#00f0ff" intensity={1.5} distance={12} decay={2} />;
}

// =========================================================================
// 6. Camera Rig
// =========================================================================
function CinematicCameraRig({ smoothProgress }: { smoothProgress: number }) {
  const { camera } = useThree();

  useFrame((state) => {
    const targetY = lerp(0.2, -0.2, smoothProgress);
    const targetZ = lerp(3.8, 3.4, smoothProgress);
    const pointerX = state.pointer.x * 0.16;
    const pointerY = state.pointer.y * 0.12;

    camera.position.x = lerp(camera.position.x, pointerX, 0.02);
    camera.position.y = lerp(camera.position.y, targetY + pointerY, 0.02);
    camera.position.z = lerp(camera.position.z, targetZ, 0.02);
    camera.lookAt(0, 0, -0.5);
  });

  return null;
}

// =========================================================================
// 7. Main Scene Graph (NO CUBE - Pure Large Manifolds)
// =========================================================================
function Scene() {
  const { smoothProgress } = useScrollProgress();
  const [intro, setIntro] = useState(0);

  useEffect(() => {
    let start = Date.now();
    let animId: number;
    const loop = () => {
      const elapsed = (Date.now() - start) / 1800;
      const val = Math.min(elapsed, 1);
      const eased = val * val * (3 - 2 * val);
      setIntro(eased);
      if (val < 1) {
        animId = requestAnimationFrame(loop);
      }
    };
    animId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animId);
  }, []);

  return (
    <>
      <CinematicCameraRig smoothProgress={smoothProgress} />
      <CursorLight />
      <ambientLight intensity={0.45} />
      <directionalLight position={[5, 6, 4]} intensity={0.65} color="#38bdf8" />
      <directionalLight position={[-5, -4, -2]} intensity={0.38} color="#a855f7" />

      {/* Cyber Galaxy Background */}
      <Stars
        radius={35}
        depth={60}
        count={1400}
        factor={2.2}
        saturation={0.7}
        fade
        speed={0.18}
      />

      <AmbientGalaxy progress={smoothProgress} />

      {/* 1. Gaussian Distribution: Large, Edge-to-Edge RIGHT -> LEFT (0% -> 33%) */}
      <BivariateGaussianManifold progress={smoothProgress} intro={intro} />

      {/* 2. Saddle & Lorenz Phase Flow: Large, Edge-to-Edge LEFT -> RIGHT (35% -> 67%) */}
      <LorenzSaddleManifold progress={smoothProgress} intro={intro} />

      {/* 3. Geodesic Bloch-Gyroscope: Large, Edge -> Center Immersion (69% -> 100%) */}
      <GeodesicGyroscopeManifold progress={smoothProgress} intro={intro} />

      <EffectComposer>
        <Bloom
          intensity={0.42}
          luminanceThreshold={0.58}
          luminanceSmoothing={0.85}
          mipmapBlur
        />
        <Vignette offset={0.3} darkness={0.55} />
      </EffectComposer>
    </>
  );
}

export function Scene3D() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  return (
    <div className="scene3d-container">
      <Canvas
        camera={{ position: [0, 0.2, 3.8], fov: 48 }}
        dpr={isMobile ? 1 : [1, 1.5]}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: "high-performance",
        }}
        style={{ background: "transparent" }}
      >
        <Scene />
      </Canvas>
    </div>
  );
}
