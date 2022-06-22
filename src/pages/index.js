import { graphql } from "gatsby";
import * as React from "react";
import Grid from "@mui/material/Grid";
import { Paper, styled } from "@mui/material";
import BlogCard from "../components/blog/BlogCard";

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
        <BlogCard main data={firstPost} height={"calc(20vw + 100px)"} />
      </Grid>
      {/* card */}
      {otherPost.map(({ node: { frontmatter: post } }) => (
        <Grid key={post.title} item xs={12} md={6}>
          <BlogCard data={post} height={300} />
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
