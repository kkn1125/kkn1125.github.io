import {
  Box,
  Divider,
  Grid,
  Paper,
  Stack,
  styled,
  Typography,
} from "@mui/material";
import { graphql, Link } from "gatsby";
import React from "react";
import BlogCard from "../organisms/blog/BlogCard";
import Seo from "../modules/seo/Seo";

const PaperBlock = styled(Paper)(({ theme }) => ({
  borderRadius: 15,
  overflow: "hidden",
}));

function Tags(props) {
  const {
    pageContext: { count, tag },
    data,
  } = props;
  const {
    allMarkdownRemark: { edges },
  } = data;
  return (
    <Box>
      <Seo frontmatter={{ title: "Tags" }} />
      <Typography className='font-main' variant='h2' component='span'>
        Tag
      </Typography>
      <Typography
        className='font-main'
        variant='h2'
        component='span'
        color='danger.primary'
        sx={{
          ml: 2,
        }}>
        {tag.toUpperCase()} [{count}]
      </Typography>
      <Divider
        sx={{
          mt: 2,
          mb: 5,
        }}
      />
      <Grid container gap={5}>
        {edges.map(({ node: { frontmatter: info, id } }) => (
          <BlogCard key={info.slug + id} main data={info} height={"100%"} />
        ))}
      </Grid>
    </Box>
  );
}

export default Tags;

export const query = graphql`
  query ($tag: String) {
    allMarkdownRemark(
      sort: { fields: frontmatter___date, order: DESC }
      filter: { frontmatter: { layout: { eq: "lives" }, published: { eq: true }, tags: { eq: $tag } } }
    ) {
      edges {
        node {
          frontmatter {
            title
            slug
            author
            categories
            date(formatString: "YYYY-MM-DD HH:mm")
            tags
            description
            image
          }
        }
      }
    }
  }
`;
