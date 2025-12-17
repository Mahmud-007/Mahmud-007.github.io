import * as React from "react"
import type { HeadFC, PageProps } from "gatsby"
import Layout from "../components/Layout"
import SkillsGlobe3D from "../components/SkillsGlobe3D"

const IndexPage: React.FC<PageProps> = () => {
  return (
    <Layout>
        {/* <h1>Skills Globe 3D</h1> */}
      <SkillsGlobe3D />

    </Layout>
  )
}

export default IndexPage

export const Head: HeadFC = () => <title>Mahmudur Rahman | Portfolio</title>
