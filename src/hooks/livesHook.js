import { graphql, useStaticQuery } from "gatsby";

function LivesHook(props) {
  const {
    allMarkdownRemark: { edges },
  } = useStaticQuery(graphql`
    {
      allMarkdownRemark(
        sort: { fields: frontmatter___date, order: DESC }
        filter: {
          frontmatter: { layout: { eq: "lives" }, published: { eq: true } }
        }
      ) {
        edges {
          node {
            frontmatter {
              slug
              title
              description
              author
              date(fromNow: false, formatString: "YYYY-MM-DD HH:mm")
              categories
              tags
              image
            }
          }
        }
      }
    }
  `);
  return edges;
}

export default LivesHook;
