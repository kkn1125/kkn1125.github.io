import {
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Typography,
  Divider,
  Box,
  Stack,
  Pagination,
  PaginationItem,
} from "@mui/material";
import { graphql, Link } from "gatsby";
import React, { Fragment, useState } from "react";
import BlogLayout from "../layout/BlogLayout";
import BlogCardInfo from "../common/BlogCardInfo";
import { cutText } from "../../util/tools";
import BlogCardHashList from "../common/BlogCardHashList";

const BlogPage = ({ data, pageContext }) => {
  const { limit, skip, pageNum, currentPage } = pageContext;

  const [page, setPage] = useState(1);
  const handleChange = (event, value) => {
    setPage(value);
  };

  return (
    <BlogLayout>
      <Typography className='font-main' variant='h3'>
        Blog
      </Typography>
      <Divider
        sx={{
          mt: 2,
          mb: 5,
        }}
      />
      {data.allMarkdownRemark.edges.map((edge, idx, o) => (
        <Fragment key={edge.node.id}>
          <ListItem alignItems='flex-start'>
            <ListItemAvatar>
              <Avatar
                alt={edge.node.frontmatter.title.match(/[\w]+/g)[0]}
                src='/static/images/avatar/1.jpg'
              />
            </ListItemAvatar>
            <ListItemText>
              <Typography
                variant='h5'
                component={Link}
                gutterBottom
                to={edge.node.frontmatter.slug}
                sx={{
                  display: "inline-block",
                  color: "primary.main",
                  textDecoration: "none",
                }}>
                {edge.node.frontmatter.title}
              </Typography>
              <Typography
                sx={{
                  color: (theme) => theme.palette.grey[500],
                }}
                gutterBottom
                component='div'
                variant='body2'>
                {cutText(edge.node.frontmatter.description, 30, "─ ")}
              </Typography>
              <BlogCardInfo data={edge.node.frontmatter} noavatar />
              <Box
                component='div'
                sx={{
                  mt: 2,
                }}>
                <BlogCardHashList data={edge.node.frontmatter} />
              </Box>
            </ListItemText>
          </ListItem>
          {o.length - 1 !== idx && <Divider />}
        </Fragment>
      ))}
      <Stack
        spacing={2}
        direction='row'
        justifyContent='center'
        sx={{
          mt: 5,
        }}>
        <Pagination
          size='large'
          // variant='outlined'
          shape='rounded'
          page={currentPage}
          count={pageNum}
          showFirstButton
          showLastButton
          onChange={handleChange}
          renderItem={(item) => (
            <PaginationItem
              component={Link}
              to={`/blog${item.page === 1 ? "" : `/${item.page}`}`}
              {...item}
            />
          )}
        />
      </Stack>
    </BlogLayout>
  );
};

export const query = graphql`
  query ($skip: Int!, $limit: Int!) {
    allMarkdownRemark(
      sort: { fields: [frontmatter___date], order: DESC }
      limit: $limit
      skip: $skip
    ) {
      edges {
        node {
          frontmatter {
            title
            slug
            description
            date(formatString: "YYYY-MM-DD HH:mm")
            categories
            tags
            author
          }
          wordCount {
            words
          }
          id
        }
      }
    }
  }
`;

export default BlogPage;
