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

function Categories(props) {
  const {
    pageContext: { count, category },
    data,
  } = props;
  const {
    allMarkdownRemark: { edges },
  } = data;

  return (
    <Box>
      <Seo frontmatter={{ title: "Categories" }} />
      <Typography className='font-main' variant='h2' component='span'>
        Category
      </Typography>
      <Typography
        className='font-main'
        variant='h2'
        component='span'
        color='danger.primary'
        sx={{
          ml: 2,
        }}>
        {category.toUpperCase()} [{count}]
      </Typography>
      <Divider
        sx={{
          mt: 2,
          mb: 5,
        }}
      />
      <Grid container gap={5}>
        {edges.map(({ node: { frontmatter: info } }) => (
          <BlogCard key={info.title} main data={info} height={400} />
        ))}
      </Grid>
    </Box>
  );
}

export default Categories;

export const query = graphql`
  query ($category: String) {
    allMarkdownRemark(
      sort: { fields: frontmatter___date, order: DESC }
      filter: {
        frontmatter: { published: { eq: true }, categories: { eq: $category } }
      }
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
