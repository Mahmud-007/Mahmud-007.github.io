import path from "path"
import type { GatsbyNode } from "gatsby"
import caseStudies from "./src/data/caseStudies.json"

type StudyRef = { slug: string; title: string }

/** One page per case study at /work/<slug>/, with links to its neighbours. */
export const createPages: GatsbyNode["createPages"] = async ({ actions }) => {
  const template = path.resolve("src/templates/CaseStudy.tsx")
  const studies = caseStudies as Array<StudyRef & Record<string, unknown>>
  const ref = (s?: StudyRef): StudyRef | null => (s ? { slug: s.slug, title: s.title } : null)

  studies.forEach((study, i) => {
    actions.createPage({
      path: `/work/${study.slug}/`,
      component: template,
      context: {
        study,
        prev: ref(studies[i - 1]),
        next: ref(studies[i + 1]),
      },
    })
  })
}
