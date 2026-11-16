import path from "path"
import type { GatsbyNode } from "gatsby"
import caseStudies from "./src/data/caseStudies.json"
import profile from "./src/data/profile.json"
import fallbackVideos from "./src/data/videos.json"
import { isFeed, parseFeed, resolveVideos, type VideoLike } from "./src/utils/youtube"

type StudyRef = { slug: string; title: string }

const FEED_TIMEOUT_MS = 8000

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

/** Declared up front so `allVideo` queries work even when there are no videos at all. */
export const createSchemaCustomization: GatsbyNode["createSchemaCustomization"] = ({ actions }) => {
  actions.createTypes(`
    type Video implements Node {
      videoId: String!
      title: String!
      publishedAt: String!
      thumbnail: String!
      url: String!
    }
  `)
}

/** Reads the channel's public feed. An empty channel returns []; anything that is not a feed throws. */
async function fetchFeed(channelId: string): Promise<VideoLike[]> {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), FEED_TIMEOUT_MS)
  try {
    const res = await fetch(`https://www.youtube.com/feeds/videos.xml?channel_id=${channelId}`, {
      signal: controller.signal,
    })
    if (!res.ok) throw new Error(`feed responded ${res.status}`)
    const xml = await res.text()
    if (!isFeed(xml)) throw new Error("response was not a feed")
    return parseFeed(xml)
  } finally {
    clearTimeout(timer)
  }
}

/**
 * Build-time snapshot of the channel's videos. The build must never fail because YouTube was
 * unreachable, so every failure falls back to the committed src/data/videos.json.
 */
export const sourceNodes: GatsbyNode["sourceNodes"] = async ({
  actions,
  createNodeId,
  createContentDigest,
  reporter,
}) => {
  const channelId = profile.youtube?.channelId ?? ""
  let live: VideoLike[] | null = null

  if (channelId) {
    try {
      live = await fetchFeed(channelId)
      reporter.info(`YouTube: ${live.length} videos from the live feed`)
    } catch (error) {
      reporter.warn(`YouTube: live feed unavailable (${(error as Error).message}); using src/data/videos.json`)
    }
  }

  const videos = resolveVideos(channelId, live, fallbackVideos as VideoLike[])

  videos.forEach((video) => {
    const fields = {
      videoId: video.id,
      title: video.title,
      publishedAt: video.publishedAt,
      thumbnail: video.thumbnail,
      url: video.url,
    }
    actions.createNode({
      ...fields,
      id: createNodeId(`video-${video.id}`),
      internal: { type: "Video", contentDigest: createContentDigest(fields) },
    })
  })
}
