import React from "react";
import SkillsGlobe3D from "../components/SkillsGlobe3D";

const OntenetPage = () => {
    return (
        <main style={{ minHeight: "100vh", background: "#05070a", color: "white", fontFamily: "sans-serif" }}>
            <header style={{ padding: "20px 40px", borderBottom: "1px solid rgba(255,255,255,0.1)" }}>
                {/* <h1 style={{ margin: 0, fontSize: "1.5rem" }}>Antigravity 3D Skills</h1> */}
            </header>

            <div style={{ maxWidth: 1200, margin: "40px auto", padding: "0 20px" }}>
                <h2 style={{ marginBottom: 30, textAlign: "center", opacity: 0.8 }}>Interactive Skill Universe</h2>

                {/* The 3D Component */}
                <SkillsGlobe3D />

                <div style={{ marginTop: 60, textAlign: "center", opacity: 0.5, fontSize: "0.9rem" }}>
                    <p>Built with React Three Fiber & Gatsby</p>
                </div>
            </div>
        </main>
    );
};

export default OntenetPage;

export const Head = () => <title>3D Skills | Mahmud Portfolio</title>;
