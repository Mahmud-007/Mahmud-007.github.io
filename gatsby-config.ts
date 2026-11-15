import type { GatsbyConfig } from "gatsby";

const config: GatsbyConfig = {
  siteMetadata: {
    title: `Mahmudur Rahman Portfolio`,
    siteUrl: `https://Mahmud-007.github.io`,
    description: `Work, writing, videos and certificates of Mahmudur Rahman.`,
  },
  graphqlTypegen: true,
  pathPrefix: "/",
  plugins: [
    "gatsby-plugin-postcss",
    "gatsby-plugin-image",
    "gatsby-plugin-sharp",
    "gatsby-transformer-sharp",
    {
      resolve: "gatsby-source-filesystem",
      options: {
        name: "images",
        path: "./src/images/",
      },
      __key: "images",
    },
    {
      resolve: "gatsby-source-filesystem",
      options: {
        name: "data",
        path: "./src/data/",
      },
      __key: "data",
    },
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: `Mahmudur Rahman Portfolio`,
        short_name: `Mahmudur Rahman`,
        start_url: `/`,
        background_color: `#f3efe6`,
        theme_color: `#1a1814`,
        display: `minimal-ui`,
        icon: `src/images/icon.png`,
      },
    },
  ],
};

export default config;
