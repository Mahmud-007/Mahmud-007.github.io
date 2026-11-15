import * as React from "react"
import type { HeadFC, PageProps } from "gatsby"
import Layout from "../components/layout/Layout"
import LeadStory from "../components/sections/LeadStory"
import Work from "../components/sections/Work"
import Products from "../components/sections/Products"
import Experience from "../components/sections/Experience"
import Contact from "../components/sections/Contact"

const IndexPage: React.FC<PageProps> = () => {
    return (
        <Layout>
            <LeadStory />
            <Work />
            <Products />
            <Experience />
            <Contact />
        </Layout>
    )
}

export default IndexPage

export const Head: HeadFC = () => <title>Mahmudur Rahman</title>
