import * as React from "react"
import type { HeadFC, PageProps } from "gatsby"
import Layout from "../components/layout/Layout"
import MoreLink from "../components/ui/MoreLink"

const NotFoundPage: React.FC<PageProps> = () => (
    <Layout>
        <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-red m-0">Correction</p>
        <h1 className="mt-3 mb-4 font-display font-black tracking-[-0.03em] leading-[0.95] text-4xl sm:text-5xl">
            This page was never printed.
        </h1>
        <p className="text-[19px] italic text-ink-soft mb-6">The address may be old or mistyped.</p>
        <MoreLink label="Back to the front page" to="/" />
    </Layout>
)

export default NotFoundPage

export const Head: HeadFC = () => <title>Not found — Mahmudur Rahman</title>
