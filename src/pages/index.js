import { graphql } from "gatsby";
import React from "react";
import Grid from "@mui/material/Grid";
import { Paper } from "@mui/material";
import Seo from "../components/modules/seo/Seo";
import BlogCard from "../components/organisms/blog/BlogCard";
import Calendar from "../components/organisms/calendar/Calendar";
import { Helmet } from "react-helmet";

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
    <>
      <Helmet>
        <meta property='og:title' content='devkimson blog' />
        <meta
          property='og:description'
          content='기능 설계와 편리한 서비스에 관심이 많은 웹 개발자의 gatsby 블로그 입니다.'
        />
        <meta property='og:author' content='kkn1125' />
        <meta property='og:image' content='/images/logo-k-color.png' />
      </Helmet>
      <Seo frontmatter={{ title: "" }} />
      <Grid container spacing={12}>
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
        <Grid item xs>
          <Paper elevation={3} sx={{ p: 5, display: "flex" }}>
            <Calendar />
          </Paper>
        </Grid>
      </Grid>
    </>
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
