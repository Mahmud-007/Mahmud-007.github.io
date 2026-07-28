import * as React from "react"
import type { HeadFC, PageProps } from "gatsby"
import Layout from "../components/Layout"
import Hero from "../components/Hero"
import About from "../components/About"
import Experience from "../components/Experience"
import Projects from "../components/Projects"
import Skills from "../components/Skills"
import Certifications from "../components/Certifications"
import AiWorkflow from "../components/AiWorkflow"
import Blog from "../components/Blog"
import Speaking from "../components/Speaking"
import Contact from "../components/Contact"

const IndexPage: React.FC<PageProps> = () => {
    return (
        <Layout>
            <Hero />
            <About />
            <Experience />
            <Projects />
            <Skills />
            <Certifications />
            <AiWorkflow />
            <Blog />
            <Speaking />
            <Contact />
        </Layout>
    )
}

export default IndexPage

export const Head: HeadFC = () => <title>Mahmudur Rahman | Portfolio</title>
