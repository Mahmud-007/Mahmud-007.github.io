import React, { useMemo, useRef, useState, useEffect, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Html, useGLTF, Torus } from "@react-three/drei";
import skillsData from "../data/skills.json";

// Type definition for skills data
type SkillsData = Record<string, string[]>;
const skills = skillsData as SkillsData;

// Important for Gatsby - simple browser check
const isBrowser = typeof window !== "undefined";

function RingModel({ pausedRef }: { pausedRef: React.MutableRefObject<boolean> }) {
    const group = useRef<any>(null);

    useFrame((_, delta) => {
        if (!pausedRef.current && group.current) {
            group.current.rotation.y += delta * 0.35; // base rotation speed
        }
    });

    // Fallback procedural ring since the GLB might be missing
    return (
        <group ref={group} scale={1.1} position={[0, -0.2, 0]}>
            {/* A tech-looking torus ring */}
            <Torus args={[2.5, 0.02, 16, 100]} rotation={[Math.PI / 2, 0, 0]}>
                <meshStandardMaterial color="#4a9eff" emissive="#1b2a4a" emissiveIntensity={0.5} roughness={0.2} metalness={0.8} />
            </Torus>
            <Torus args={[2.0, 0.01, 16, 100]} rotation={[Math.PI / 2, 0, 0]}>
                <meshStandardMaterial color="#ffffff" opacity={0.3} transparent />
            </Torus>
        </group>
    );
}

interface ClickableGlobesProps {
    data: SkillsData;
    onPick: (key: string) => void;
    selectedKey: string | null;
    pausedRef: React.MutableRefObject<boolean>;
}

function ClickableGlobes({ data, onPick, selectedKey, pausedRef }: ClickableGlobesProps) {
    const group = useRef<any>(null);

    // Place category globes around a circle
    const items = useMemo(() => {
        const keys = Object.keys(data || {});
        const radius = 2.2;
        return keys.map((k, i) => {
            // Distribute smoothly
            const a = (i / Math.max(1, keys.length)) * Math.PI * 2;
            return {
                key: k,
                position: [Math.cos(a) * radius, 0.35, Math.sin(a) * radius] as [number, number, number],
            };
        });
    }, [data]);

    useFrame((state, delta) => {
        // slow orbit of the globes themselves (separate from base model)
        if (!pausedRef.current && group.current) {
            group.current.rotation.y -= delta * 0.2;
        }
    });

    return (
        <group ref={group}>
            {items.map((it) => {
                const isSelected = it.key === selectedKey;
                return (
                    <mesh
                        key={it.key}
                        position={it.position}
                        onClick={(e) => {
                            e.stopPropagation();
                            onPick(it.key);
                        }}
                        onPointerOver={() => { if (document.body) document.body.style.cursor = "pointer"; }}
                        onPointerOut={() => { if (document.body) document.body.style.cursor = "default"; }}
                    >
                        <sphereGeometry args={[0.28, 32, 32]} />
                        <meshStandardMaterial
                            metalness={0.35}
                            roughness={0.25}
                            emissiveIntensity={0.6}
                            emissive={isSelected ? "white" : "black"}
                            color={isSelected ? "#ffffff" : "#2a3b55"}
                        />
                        <Html center distanceFactor={10} zIndexRange={[100, 0]}>
                            <div
                                style={{
                                    padding: "6px 10px",
                                    borderRadius: 999,
                                    fontSize: 12,
                                    fontFamily: "Inter, sans-serif",
                                    color: "white",
                                    background: "rgba(0,0,0,0.65)",
                                    backdropFilter: "blur(6px)",
                                    border: "1px solid rgba(255,255,255,0.15)",
                                    whiteSpace: "nowrap",
                                    transform: "translateY(-34px)",
                                    pointerEvents: "none",
                                    userSelect: "none"
                                }}
                            >
                                {it.key}
                            </div>
                        </Html>
                    </mesh>
                );
            })}
        </group>
    );
}

const SkillsGlobe3D: React.FC = () => {
    const [selected, setSelected] = useState<string | null>(null);
    const pausedRef = useRef(false);
    const [idleBlend, setIdleBlend] = useState(1); // smooth resume after interaction

    // Smoothly resume rotation after user stops
    useEffect(() => {
        let raf: number;
        const tick = () => {
            const target = pausedRef.current ? 0 : 1;
            setIdleBlend((v) => v + (target - v) * 0.08); // simple lerp
            raf = requestAnimationFrame(tick);
        };
        raf = requestAnimationFrame(tick);
        return () => cancelAnimationFrame(raf);
    }, []);

    // Feed the smoothed blend into pausedRef behavior
    const effectivePausedRef = useRef(false);
    useEffect(() => {
        effectivePausedRef.current = idleBlend < 0.15;
    }, [idleBlend]);

    // Gatsby hydration check
    const [mounted, setMounted] = useState(false);
    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return <div style={{ minHeight: 520 }} />;

    const selectedSkills = selected ? skills[selected] : null;

    return (
        <div
            className="skills-globe-container"
            style={{
                display: "grid",
                gridTemplateColumns: "1fr 340px",
                gap: 16,
                alignItems: "stretch",
                width: "100%",
                minHeight: 520,
            }}
        >
            {/* 3D Scene */}
            <div
                style={{
                    borderRadius: 18,
                    overflow: "hidden",
                    border: "1px solid rgba(255,255,255,0.08)",
                    background: "radial-gradient(circle at 30% 20%, #1b2a4a, #070a12)",
                    position: "relative",
                    minHeight: 500,
                }}
            >
                <Canvas
                    camera={{ position: [0, 1.4, 5.2], fov: 45 }}
                    dpr={[1, 2]}
                >
                    <ambientLight intensity={0.7} />
                    <directionalLight position={[4, 6, 3]} intensity={1.1} />
                    <pointLight position={[-4, 2, -2]} intensity={0.7} />

                    <Suspense fallback={null}>
                        <RingModel pausedRef={effectivePausedRef} />
                        <ClickableGlobes
                            data={skills}
                            selectedKey={selected}
                            pausedRef={effectivePausedRef}
                            onPick={(key) => setSelected((prev) => (prev === key ? null : key))}
                        />
                    </Suspense>

                    <OrbitControls
                        enableDamping
                        dampingFactor={0.08}
                        rotateSpeed={0.6}
                        zoomSpeed={0.6}
                        minDistance={3.6}
                        maxDistance={8.5}
                        onStart={() => {
                            pausedRef.current = true;
                        }}
                        onEnd={() => {
                            pausedRef.current = false;
                        }}
                    />
                </Canvas>

                <div
                    style={{
                        position: "absolute",
                        left: 12,
                        bottom: 12,
                        padding: "8px 10px",
                        fontSize: 11,
                        color: "rgba(255,255,255,0.6)",
                        background: "rgba(0,0,0,0.3)",
                        border: "1px solid rgba(255,255,255,0.05)",
                        borderRadius: 8,
                        backdropFilter: "blur(4px)",
                        pointerEvents: "none",
                    }}
                >
                    Drag to orbit • Scroll to zoom
                </div>
            </div>

            {/* Details sidebar */}
            <div
                style={{
                    borderRadius: 18,
                    border: "1px solid rgba(255,255,255,0.08)",
                    background: "rgba(10,12,18,0.5)",
                    color: "white",
                    padding: 24,
                    display: "flex",
                    flexDirection: "column",
                }}
            >
                <div style={{ fontSize: 13, textTransform: "uppercase", letterSpacing: "0.05em", opacity: 0.5, marginBottom: 8 }}>
                    Selected Category
                </div>
                <div style={{ fontSize: 24, fontWeight: 700, marginBottom: 16, color: selected ? "#fff" : "#667" }}>
                    {selected || "None"}
                </div>

                <div style={{ fontSize: 14, lineHeight: 1.6, opacity: 0.8, flex: 1 }}>
                    {!selected && (
                        <div style={{ display: "flex", flexDirection: "column", gap: 12, marginTop: 20, opacity: 0.5 }}>
                            <p>Interact with the 3D view to explore technical skills.</p>
                        </div>
                    )}

                    {selectedSkills && (
                        <div className="skills-list" style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                            {selectedSkills.map((s) => (
                                <span
                                    key={s}
                                    style={{
                                        background: "rgba(255,255,255,0.1)",
                                        padding: "6px 12px",
                                        borderRadius: 6,
                                        fontSize: 13,
                                        border: "1px solid rgba(255,255,255,0.05)"
                                    }}
                                >
                                    {s}
                                </span>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
export default SkillsGlobe3D;
