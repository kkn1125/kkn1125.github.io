function format(/** @type {Date} */ date, form) {
  return form.replace(/YYYY|MM|dd|HH|mm|ss|SSS|AP/g, ($1) => {
    const hour = date.getHours();
    switch ($1) {
      case "YYYY":
        return date.getFullYear().toString().padStart(2, "0");
      case "MM":
        return (date.getMonth() + 1).toString().padStart(2, "0");
      case "dd":
        return date.getDate().toString().padStart(2, "0");
      case "HH":
        return hour.toString().padStart(2, "0");
      case "mm":
        return date.getMinutes().toString().padStart(2, "0");
      case "ss":
        return date.getSeconds().toString().padStart(2, "0");
      case "SSS":
        return date.getMilliseconds().toString().padStart(3, "0");
      case "AP":
        return hour > 12 ? "PM" : "AM";
      default:
        return $1;
    }
  });
}

const dotenv = require("dotenv");
const path = require("path");
const mode = process.env.NODE_ENV;
console.log(mode);
dotenv.config({
  path: path.join(path.resolve(), `.env`),
});
dotenv.config({
  path: path.join(path.resolve(), `.env.${mode}`),
});
const KEY = process.env.GATSBY_SECRET_KEY;
module.exports = {
  pathPrefix: "/",
  siteMetadata: {
    title: `blog`,
    siteUrl: process.env.GATSBY_BLOG_PATH,
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
        host: `${process.env.GATSBY_BLOG_PATH}/`,
        sitemap: `${process.env.GATSBY_BLOG_PATH}/sitemap.xml`,
        policy: [
          {
            userAgent: "*",
            allow: "/",
            disAllow: "/assets/images/kim.jpg",
            sitemap: `${process.env.GATSBY_BLOG_PATH}/sitemap.xml`,
          },
        ],
      },
    },
    // {
    //   resolve: "gatsby-plugin-sitemap",
    //   options: {
    //     query: `
    //     {
    //       tags: allMarkdownRemark(
    //         sort: {fields: frontmatter___date, order: DESC}
    //         filter: {frontmatter: {published: {eq: true}}}
    //       ) {
    //         edges {
    //           node {
    //             frontmatter {
    //               slug
    //               date
    //               modified
    //             }
    //           }
    //         }
    //       }
    //     }
    //   `,
    //     resolveSiteUrl: () => "https://kkn1125.github.io/",
    //     resolvePages: ({
    //       tags: {
    //         edges: { node: allPages },
    //       },
    //     }) => {
    //       const wpNodeMap = allPages.reduce((acc, node) => {
    //         const uri = node.path;
    //         acc[uri] = node;

    //         return acc;
    //       }, {});

    //       return allPages.map((page) => {
    //         return { ...page, ...wpNodeMap[page.path] };
    //       });
    //     },
    //     serialize: ({ path, date }) => {
    //       return {
    //         url: path.match(/\/$/g) ? path : path + "/",
    //         lastmod: format(new Date(), "YYYY-MM-ddTHH:mm:ss.SSSZ"),
    //       };
    //     },
    //   },
    // },
  ],
};
