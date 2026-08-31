import * as React from "react"
import type { HeadFC, PageProps } from "gatsby"
import Layout from "../components/layout/Layout"
import Hero from "../components/sections/Hero"
import Experience from "../components/sections/Experience"
import Projects from "../components/sections/Projects"
import Skills from "../components/sections/Skills"
import Certifications from "../components/sections/Certifications"
import AiWorkflow from "../components/sections/AiWorkflow"
import Writing from "../components/sections/Writing"
import Speaking from "../components/sections/Speaking"
import Contact from "../components/sections/Contact"

const IndexPage: React.FC<PageProps> = () => {
    return (
        <Layout>
            <Hero />
            <Experience />
            <Projects />
            <Skills />
            <Certifications />
            <AiWorkflow />
            <Writing />
            <Speaking />
            <Contact />
        </Layout>
    )
}

export default IndexPage

export const Head: HeadFC = () => <title>Mahmudur Rahman | Portfolio</title>
