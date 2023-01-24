module.exports = {
  pathPrefix: "/",
  siteMetadata: {
    title: `blog`,
    siteUrl: `https://kkn1125.github.io`,
  },
  // More easily incorporate content into your pages through automatic TypeScript type generation and better GraphQL IntelliSense.
  // If you use VSCode you can also use the GraphQL plugin
  // Learn more at: https://gatsby.dev/graphql-typegen
  plugins: [
    "gatsby-plugin-react-helmet",
    {
      resolve: `gatsby-plugin-material-ui`,
      options: {
        pathToEmotionCacheProps: `src/emotion-cache-props`,
      },
    },
    "gatsby-plugin-image",
    "gatsby-plugin-sharp",
    "gatsby-plugin-advanced-sitemap",
    // {
    //   resolve: `gatsby-plugin-typegen`,
    //   options: {
    //     outputPath: `src/__generated__/gatsby-types.d.ts`,
    //     emitSchema: {
    //       'src/__generated__/gatsby-schema.graphql': true,
    //     },
    //   },
    // },
    {
      resolve: "gatsby-plugin-google-analytics",
      options: {
        trackingId: "UA-179074259-1",
      },
    },
    {
      resolve: "gatsby-plugin-manifest",
      options: {
        icon: "src/images/icon.png",
      },
    },
    {
      resolve: "gatsby-source-filesystem",
      options: {
        name: `images`,
        path: `${__dirname}/src/images`,
      },
    },
    {
      resolve: "gatsby-source-filesystem",
      options: {
        name: `blog`,
        path: `${__dirname}/src/blog`,
      },
    },
    {
      resolve: `gatsby-transformer-remark`,
      options: {
        // Footnotes mode (default: true)
        footnotes: true,
        // GitHub Flavored Markdown mode (default: true)
        gfm: true,
        // Plugins configs
        plugins: [],
      },
    },
    {
      resolve: "gatsby-plugin-anchor-links",
      options: {
        offset: -100,
      },
    },
    {
      resolve: "gatsby-plugin-robots-txt",
      options: {
        host: "https://kkn1125.github.io/",
        sitemap: "https://kkn1125.github.io/sitemap.xml",
        policy: [
          {
            userAgent: "*",
            allow: "/",
            disAllow: "/assets/images/kim.jpg",
            sitemap: "https://kkn1125.github.io/sitemap.xml",
          },
        ],
      },
    },
    {
      resolve: "gatsby-plugin-sitemap",
      options: {
        query: `
        {
          tags: allMarkdownRemark(
            sort: {fields: frontmatter___date, order: DESC}
            filter: {frontmatter: {published: {eq: true}}}
          ) {
            edges {
              node {
                frontmatter {
                  slug
                  date
                  modified
                }
              }
            }
          }
        }
      `,
        resolvePages: ({
          tags: {
            edges: { node: allPages },
          },
        }) => {
          console.log(allPages);
          const wpNodeMap = allPages.reduce((acc, node) => {
            const uri = node.path;
            acc[uri] = node;

            return acc;
          }, {});

          return allPages.map((page) => {
            return { ...page, ...wpNodeMap[page.path] };
          });
        },
        serialize: ({ path, date }) => {
          return {
            url: path,
            lastmod: modifiedGmt,
          };
        },
      },
    },
  ],
};
