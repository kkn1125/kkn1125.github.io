import FolderIcon from "@mui/icons-material/Folder";
import {
  Avatar,
  Divider,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Paper,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import Grid from "@mui/material/Grid";
import { graphql, navigate } from "gatsby";
import React from "react";
import { Helmet } from "react-helmet";
import Seo from "../components/modules/seo/Seo";
import Calendar from "../components/organisms/calendar/Calendar";
import { cutText } from "../util/tools";

// markup
const IndexPage = ({ data }) => {
  const theme = useTheme();
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
        {/* listify */}
        <Grid item xs={12}>
          <Typography
            component='div'
            variant='h3'
            gutterBottom
            sx={{
              borderBottomColor: "#ccc",
              borderBottomWidth: 1,
              borderBottomStyle: "solid",
              fontWeight: 700,
              pb: 2,
            }}>
            Features
          </Typography>
          <List
            dense={true}
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
              gap: 2,
            }}>
            {edges.map(({ node: { frontmatter: post } }) => (
              <ListItem
                key={post.title}
                onClick={(e) => navigate(post.slug)}
                sx={{
                  cursor: "pointer",
                  alignItems: "flex-start",
                }}>
                <ListItemAvatar
                  sx={{
                    pt: 1,
                  }}>
                  <Avatar>
                    <FolderIcon />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={cutText(
                    post.title,
                    useMediaQuery(theme.breakpoints.up("md")) ? 50 : 15
                  )}
                  primaryTypographyProps={{
                    sx: (theme) => ({
                      fontSize: theme.typography.pxToRem(28),
                      fontWeight: 700,
                    }),
                  }}
                  secondary={cutText(
                    post.description,
                    useMediaQuery(theme.breakpoints.up("md")) ? 150 : 35
                  )}
                  secondaryTypographyProps={{
                    sx: {
                      color: "#888",
                    },
                  }}
                />
              </ListItem>
            ))}
          </List>
        </Grid>
        <Divider
          flexItem
          sx={{
            width: "inherit",
            mt: 7,
            borderColor: "#ccc",
            display: useMediaQuery(theme.breakpoints.up("md"))
              ? "block"
              : "none",
          }}
        />
        {/* main */}
        {/* <Grid item xs={12}>
          <BlogCard
            main
            data={firstPost}
            height={
              useMediaQuery(theme.breakpoints.up("md"))
                ? "calc(20vw + 100px)"
                : 200
            }
          />
        </Grid> */}
        {/* card */}
        {/* {otherPost.map(({ node: { frontmatter: post } }) => (
          <Grid key={post.title} item xs={12} md={6}>
            <BlogCard
              data={post}
              height={useMediaQuery(theme.breakpoints.up("md")) ? 300 : 200}
            />
          </Grid>
        ))} */}
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
