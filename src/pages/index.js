import FolderIcon from "@mui/icons-material/Folder";
import {
  Avatar,
  Box,
  Button,
  Divider,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Paper,
  Stack,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import Grid from "@mui/material/Grid";
import axios from "axios";
import { graphql, navigate } from "gatsby";
import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import Seo from "../components/modules/seo/Seo";
import Calendar from "../components/organisms/calendar/Calendar";
import BlogHook from "../hooks/blogHook";
import LivesHook from "../hooks/livesHook";
import { API_BASE_PATH, API_PATH } from "../util/globals";
import { cutText } from "../util/tools";

// markup
const IndexPage = (
  {
    /* data */
  }
) => {
  const viewCount = 5;
  const theme = useTheme();
  const blogs = BlogHook();
  const lives = LivesHook();

  // const [ blogDone, setBlogDone ] = useState(false);
  const [blogViewMore, setBlogViewMore] = useState(viewCount);
  const [livesViewMore, setLivesViewMore] = useState(viewCount);

  const [blogInfos, setBlogInfos] = useState([]);
  // console.log(blogs)
  // const {
  //   allMarkdownRemark: { edges },
  // } = data;
  // const [
  //   {
  //     node: { frontmatter: firstPost },
  //   },
  //   ...otherPost
  // ] = edges;
  // const blogs = BlogHook();

  const checkBlogLimit = () => {
    setBlogViewMore(blogViewMore + viewCount);
  };

  const checkLivesLimit = () => {
    setLivesViewMore(livesViewMore + viewCount);
  };

  useEffect(() => {
    // (async function () {
    //   const res = await axios.post(
    //     API_PATH + API_BASE_PATH + "/posts/bulk",
    //     {
    //       headers: {
    //         "Content-Type": "application/json",
    //       },
    //     },
    //     {
    //       posts: blogs.map((bg) => bg.node.frontmatter),
    //     }
    //   );
    //   const list = await res.json();
    //   setBlogInfos(list.payload || []);
    // })();
  }, []);

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
            variant='h1'
            gutterBottom
            sx={{
              fontSize: (theme) => theme.typography.pxToRem(32) + " !important",
              // borderBottomColor: "#777777",
              // borderBottomWidth: 5,
              // borderBottomStyle: "solid",
              fontWeight: 700,
              // pb: 2,
            }}>
            Features 📌
          </Typography>
          <List
            dense={true}
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
              gap: 2,
            }}>
            {blogs
              .slice(0, blogViewMore)
              .map(({ node: { frontmatter: post } }) => (
                <ListItem
                  key={post.layout + post.slug + post.title}
                  onClick={(e) => navigate(post.slug)}
                  sx={{
                    cursor: "pointer",
                    alignItems: "flex-start",
                  }}>
                  <ListItemAvatar
                    sx={{
                      pt: 1,
                    }}>
                    <Avatar src={post.image}>{/* <FolderIcon /> */}</Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={cutText(
                      post.title,
                      useMediaQuery(theme.breakpoints.up("md")) ? 50 : 15
                    )}
                    primaryTypographyProps={{
                      sx: (theme) => ({
                        fontSize: theme.typography.pxToRem(24),
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
                  {/* <Stack direction='row'>
                  <Typography sx={{ flex: 1 }}>👓</Typography>
                  <Typography sx={{ flex: 1 }}>
                    {blogInfos.find((bi) => bi.slug === post.slug)?.likes || 0}
                  </Typography>
                </Stack> */}
                </ListItem>
              ))}
          </List>
          <Box
            sx={{
              textAlign: "center",
            }}>
            <Button
              color='info'
              variant='contained'
              onClick={() => {
                navigate("/blog/");
                // checkBlogLimit();
              }}>
              더 보기 📂
            </Button>
          </Box>
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
        <Grid item xs={12}>
          <Typography
            component='div'
            variant='h1'
            gutterBottom
            sx={{
              fontSize: (theme) => theme.typography.pxToRem(32) + " !important",
              // borderBottomColor: "#777777",
              // borderBottomWidth: 5,
              // borderBottomStyle: "solid",
              fontWeight: 700,
              // pb: 2,
            }}>
            Lives 👨‍💻
          </Typography>
          <List
            dense={true}
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
              gap: 2,
            }}>
            {lives
              .slice(0, blogViewMore)
              .map(({ node: { frontmatter: post } }) => (
                <ListItem
                  key={post.layout + post.slug + post.title}
                  onClick={(e) => navigate(post.slug)}
                  sx={{
                    cursor: "pointer",
                    alignItems: "flex-start",
                  }}>
                  <ListItemAvatar
                    sx={{
                      pt: 1,
                    }}>
                    <Avatar src={post.image}>{/* <FolderIcon /> */}</Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={cutText(
                      post.title,
                      useMediaQuery(theme.breakpoints.up("md")) ? 50 : 15
                    )}
                    primaryTypographyProps={{
                      sx: (theme) => ({
                        fontSize: theme.typography.pxToRem(24),
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
                  {/* <Stack direction='row'>
                  <Typography sx={{ flex: 1 }}>👓</Typography>
                  <Typography sx={{ flex: 1 }}>
                    {blogInfos.find((bi) => bi.slug === post.slug)?.likes || 0}
                  </Typography>
                </Stack> */}
                </ListItem>
              ))}
          </List>
          <Box
            sx={{
              textAlign: "center",
            }}>
            <Button
              color='info'
              variant='contained'
              onClick={() => {
                navigate("/lives/");
                // checkBlogLimit();
              }}>
              더 보기 📂
            </Button>
          </Box>
        </Grid>
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

// export const query = graphql`
//   {
//     allMarkdownRemark(
//       sort: { fields: frontmatter___date, order: DESC }
//       limit: 5
//       filter: {
//         frontmatter: { layout: { eq: "post" }, published: { eq: true } }
//       }
//     ) {
//       edges {
//         node {
//           frontmatter {
//             slug
//             title
//             description
//             author
//             date(fromNow: false, formatString: "YYYY-MM-DD HH:mm")
//             categories
//             tags
//             image
//           }
//         }
//       }
//     }
//   }
// `;

export default IndexPage;
