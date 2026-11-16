import * as React from "react"
import type { HeadFC, PageProps } from "gatsby"
import Layout from "../components/layout/Layout"
import Work from "../components/sections/Work"
import Products from "../components/sections/Products"
import Videos from "../components/sections/Videos"
import Writing from "../components/sections/Writing"
import Certificates from "../components/sections/Certificates"
import Experience from "../components/sections/Experience"
import Contact from "../components/sections/Contact"

const IndexPage: React.FC<PageProps> = () => {
    return (
        <Layout>
            <h1 className="sr-only">Mahmudur Rahman</h1>
            <Work />
            <Products />
            <Videos limit={3} />
            <Writing limit={3} />
            <Certificates />
            <Experience />
            <Contact />
        </Layout>
    )
}

export default IndexPage

export const Head: HeadFC = () => <title>Mahmudur Rahman</title>
