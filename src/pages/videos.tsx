import * as React from "react"
import type { HeadFC, PageProps } from "gatsby"
import Layout from "../components/layout/Layout"
import Videos from "../components/sections/Videos"
import MoreLink from "../components/ui/MoreLink"
import profile from "../data/profile.json"
import { useBuildVideos } from "../hooks/useVideos"

const channelUrl = `https://www.youtube.com/${profile.youtube.handle}`

const VideosPage: React.FC<PageProps> = () => {
    const hasVideos = useBuildVideos().length > 0

    return (
        <Layout>
            <MoreLink label="← Front page" to="/" arrow={false} />
            <h1 className="mt-6 mb-8 font-display font-black tracking-[-0.03em] leading-[0.95] text-4xl sm:text-5xl">
                Videos
            </h1>
            {hasVideos ? (
                <Videos full />
            ) : (
                <p className="text-[19px] italic text-ink-soft">Nothing here yet.</p>
            )}
            <MoreLink label="The channel on YouTube" to={channelUrl} />
        </Layout>
    )
}

export default VideosPage

export const Head: HeadFC = () => <title>Videos — Mahmudur Rahman</title>
