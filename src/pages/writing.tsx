import * as React from "react"
import type { HeadFC, PageProps } from "gatsby"
import Layout from "../components/layout/Layout"
import Writing from "../components/sections/Writing"
import MoreLink from "../components/ui/MoreLink"

const WritingPage: React.FC<PageProps> = () => (
    <Layout>
        <MoreLink label="← Front page" to="/" arrow={false} />
        <h1 className="mt-6 mb-8 font-display font-black leading-[0.95] text-4xl sm:text-5xl">
            Writing
        </h1>
        <Writing />
    </Layout>
)

export default WritingPage

export const Head: HeadFC = () => <title>Writing — Mahmudur Rahman</title>
