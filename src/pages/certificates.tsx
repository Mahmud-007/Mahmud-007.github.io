import * as React from "react"
import type { HeadFC, PageProps } from "gatsby"
import Layout from "../components/layout/Layout"
import Certificates from "../components/sections/Certificates"
import MoreLink from "../components/ui/MoreLink"

const CertificatesPage: React.FC<PageProps> = () => (
    <Layout>
        <MoreLink label="← Front page" to="/" arrow={false} />
        <h1 className="mt-6 mb-8 font-display font-black leading-[0.95] text-4xl sm:text-5xl">
            Certificates
        </h1>
        <Certificates />
    </Layout>
)

export default CertificatesPage

export const Head: HeadFC = () => <title>Certificates — Mahmudur Rahman</title>
