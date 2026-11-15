import * as React from "react"
import type { HeadFC, PageProps } from "gatsby"
import Layout from "../components/layout/Layout"
import Work from "../components/sections/Work"
import Experience from "../components/sections/Experience"
import Writing from "../components/sections/Writing"
import Contact from "../components/sections/Contact"

const IndexPage: React.FC<PageProps> = () => {
    return (
        <Layout>
            <Work />
            <Experience />
            <Writing />
            <Contact />
        </Layout>
    )
}

export default IndexPage

export const Head: HeadFC = () => <title>Mahmudur Rahman</title>
