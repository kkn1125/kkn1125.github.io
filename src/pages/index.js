import { graphql } from "gatsby";
import * as React from "react";
import Grid from "@mui/material/Grid";
import { Paper, styled } from "@mui/material";
import BlogCard from "../components/blog/BlogCard";

const PaperBlock = styled(Paper)(({ theme }) => ({
  borderRadius: 15,
  overflow: "hidden",
}));

// markup
const IndexPage = ({ data }) => {
  const {
    allMarkdownRemark: { edges },
  } = data;
  const [
    {
      node: { frontmatter: firstPost },
    },
    ...otherPost
  ] = edges;

  return (
    <Grid container spacing={10}>
      {/* main */}
      <Grid item xs={12}>
        <PaperBlock
          elevation={2}
          sx={{
            display: {
              xs: "block",
              md: "flex",
            },
          }}>
          <BlogCard data={firstPost} height={"calc(20vw + 100px)"} />
        </PaperBlock>
      </Grid>
      {/* card */}
      {otherPost.map(({ node: { frontmatter: post } }) => (
        <Grid key={post.title} item xs={12} md={6}>
          <PaperBlock elevation={2}>
            <BlogCard data={post} height={300} />
          </PaperBlock>
        </Grid>
      ))}
    </Grid>
  );
};

export const query = graphql`
  {
    allMarkdownRemark(
      sort: { fields: frontmatter___date, order: DESC }
      limit: 5
      filter: { frontmatter: { published: { eq: true } } }
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
`;

export default IndexPage;
