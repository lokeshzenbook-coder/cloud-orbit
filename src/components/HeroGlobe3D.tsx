import { Canvas, useFrame } from "@react-three/fiber";
import { Html, Icosahedron, Stars } from "@react-three/drei";
import { Suspense, useMemo, useRef, useState } from "react";
import * as THREE from "three";

type Tool = { label: string; color: string };

const TOOLS: Tool[] = [
  { label: "AWS", color: "#FF9900" },
  { label: "Docker", color: "#2496ED" },
  { label: "Kubernetes", color: "#326CE5" },
  { label: "Terraform", color: "#7B42BC" },
  { label: "Argo CD", color: "#EF7B4D" },
  { label: "GitHub Actions", color: "#22c55e" },
  { label: "Jenkins", color: "#D33833" },
  { label: "GitLab", color: "#FC6D26" },
  { label: "Prometheus", color: "#E6522C" },
  { label: "Grafana", color: "#F46800" },
  { label: "Linux", color: "#eab308" },
  { label: "Python", color: "#3776AB" },
  { label: "Ansible", color: "#EE0000" },
  { label: "Istio", color: "#466BB0" },
  { label: "Vault", color: "#FFEC6E" },
];

/* Fibonacci sphere for even distribution */
function fibonacciSphere(n: number, radius: number): THREE.Vector3[] {
  const pts: THREE.Vector3[] = [];
  const phi = Math.PI * (Math.sqrt(5) - 1);
  for (let i = 0; i < n; i++) {
    const y = 1 - (i / (n - 1)) * 2;
    const r = Math.sqrt(1 - y * y);
    const t = phi * i;
    pts.push(new THREE.Vector3(Math.cos(t) * r, y, Math.sin(t) * r).multiplyScalar(radius));
  }
  return pts;
}

function GlobeCore() {
  const group = useRef<THREE.Group>(null);
  useFrame((_, dt) => {
    if (group.current) {
      group.current.rotation.y += dt * 0.18;
      group.current.rotation.x = Math.sin(performance.now() * 0.0002) * 0.15;
    }
  });
  return (
    <group ref={group}>
      {/* Inner glow sphere */}
      <mesh>
        <sphereGeometry args={[1.35, 48, 48]} />
        <meshBasicMaterial color="#0b1230" transparent opacity={0.6} />
      </mesh>
      {/* Wireframe globe */}
      <Icosahedron args={[1.5, 3]}>
        <meshBasicMaterial color="#3b82f6" wireframe transparent opacity={0.35} />
      </Icosahedron>
      {/* Outer subtle sphere */}
      <mesh>
        <sphereGeometry args={[1.52, 64, 64]} />
        <meshBasicMaterial color="#7c3aed" wireframe transparent opacity={0.12} />
      </mesh>
    </group>
  );
}

function OrbitingTools() {
  const group = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState<string | null>(null);

  const positions = useMemo(() => fibonacciSphere(TOOLS.length, 2.6), []);

  useFrame((_, dt) => {
    if (group.current) group.current.rotation.y += dt * 0.08;
  });

  return (
    <group ref={group}>
      {/* Orbit ring */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[2.6, 0.005, 8, 128]} />
        <meshBasicMaterial color="#00d4ff" transparent opacity={0.35} />
      </mesh>
      <mesh rotation={[Math.PI / 3, Math.PI / 4, 0]}>
        <torusGeometry args={[2.6, 0.004, 8, 128]} />
        <meshBasicMaterial color="#7c3aed" transparent opacity={0.25} />
      </mesh>

      {TOOLS.map((tool, i) => {
        const p = positions[i];
        const isHover = hovered === tool.label;
        return (
          <group key={tool.label} position={[p.x, p.y, p.z]}>
            {/* dot */}
            <mesh>
              <sphereGeometry args={[isHover ? 0.09 : 0.06, 16, 16]} />
              <meshBasicMaterial color={tool.color} />
            </mesh>
            {/* soft halo */}
            <mesh>
              <sphereGeometry args={[0.14, 16, 16]} />
              <meshBasicMaterial color={tool.color} transparent opacity={0.15} />
            </mesh>
            {/* Label */}
            <Html
              center
              distanceFactor={8}
              zIndexRange={[10, 0]}
              style={{ pointerEvents: "auto" }}
            >
              <button
                type="button"
                onMouseEnter={() => setHovered(tool.label)}
                onMouseLeave={() => setHovered(null)}
                onFocus={() => setHovered(tool.label)}
                onBlur={() => setHovered(null)}
                aria-label={tool.label}
                className="whitespace-nowrap select-none font-mono text-[10px] px-2 py-1 rounded-md border backdrop-blur-md transition-all duration-200"
                style={{
                  borderColor: `${tool.color}55`,
                  background: `${tool.color}12`,
                  color: tool.color,
                  boxShadow: isHover
                    ? `0 0 16px ${tool.color}bb, 0 0 32px ${tool.color}55`
                    : `0 0 8px ${tool.color}44`,
                  transform: isHover ? "scale(1.15)" : "scale(1)",
                }}
              >
                {tool.label}
              </button>
            </Html>
          </group>
        );
      })}
    </group>
  );
}

export default function HeroGlobe3D() {
  return (
    <div className="relative h-[420px] w-full">
      <Canvas
        dpr={[1, 1.5]}
        camera={{ position: [0, 0, 6.2], fov: 45 }}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      >
        <ambientLight intensity={0.6} />
        <pointLight position={[5, 5, 5]} intensity={0.8} color="#00d4ff" />
        <pointLight position={[-5, -3, -5]} intensity={0.6} color="#7c3aed" />
        <Suspense fallback={null}>
          <Stars radius={30} depth={40} count={800} factor={3} saturation={0} fade speed={0.5} />
          <GlobeCore />
          <OrbitingTools />
        </Suspense>
      </Canvas>
      {/* Radial vignette */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(circle at center, transparent 55%, rgba(11,15,25,0.85) 100%)",
        }}
      />
    </div>
  );
}
