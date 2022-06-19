import React, {
  useEffect,
  useRef,
  useState,
} from "react";
import { graphql } from "gatsby";
import hljs from "highlight.js";
import "./BlogPost.css";
import "highlight.js/styles/monokai.css";
import {
  Grid,
  Typography,
  List,
  ListItemButton,
  ListItemText,
  CardMedia,
  Paper,
  Divider,
  Box,
  useTheme,
  CircularProgress,
  Stack,
} from "@mui/material";
import Seo from "../common/Seo";
import BlogCardInfo from "../blog/BlogCardInfo";

export default function Template({ data }) {
  const {
    markdownRemark: {
      frontmatter,
      rawMarkdownBody,
      html,
      headings,
      wordCount: { words },
    },
  } = data;
  const commentEl = useRef();
  const theme = useTheme();
  const [mode, setMode] = useState(false);

  useEffect(() => {
    const scriptEl = document.createElement("script");
    scriptEl.setAttribute("src", "https://utteranc.es/client.js");
    scriptEl.setAttribute("repo", "kkn1125/blog-comments");
    scriptEl.setAttribute("issue-term", "pathname");
    scriptEl.setAttribute(
      "theme",
      theme.palette.mode === "light" ? "github-light" : "gruvbox-dark"
    );
    scriptEl.setAttribute("crossorigin", "anonymous");
    scriptEl.async = true;
    commentEl.current.innerHTML = "";
    if (commentEl.current.innerHTML === "") {
      setMode(true);
    }
    commentEl.current.appendChild(scriptEl);
    setTimeout(() => {
      setMode(false);
    }, 500);
  }, [theme.palette.mode]);

  useEffect(() => {
    hljs.configure({});
    hljs.highlightAll();
  }, []);

  const [selectedIndex, setSelectedIndex] = useState(0);

  const handleListItemClick = (event, index, value, depth) => {
    setSelectedIndex(index);
    if (typeof window !== "undefined") {
      // code here
      const titles = [...document.querySelectorAll(`h${depth}`)];
      for (let i = 0; i < titles.length; i++) {
        if (titles[i].textContent === value) {
          titles[i].scrollIntoView(true);
          break;
        }
      }
    }
  };

  return (
    <>
      <Seo frontmatter={frontmatter} />
      <Grid container justifyContent='center' gap={5}>
        <Grid item xs={12} md={2}>
          <List
            sx={{
              width: "100%",
              maxWidth: {
                md: 360,
                xs: "100%",
              },
              position: "sticky",
              top: (theme) => theme.spacing(70 * 0.125),
              overflow: "auto",
              maxHeight: 300,
              "& ul": { padding: 0 },
            }}>
            {headings.map(({ value, depth }, idx) => (
              <ListItemButton
                key={value + idx}
                selected={selectedIndex === idx}
                onClick={(event) =>
                  handleListItemClick(event, idx, value, depth)
                }>
                <ListItemText
                  primary={value}
                  sx={{
                    pl: 2 * (depth - 1),
                  }}
                />
              </ListItemButton>
            ))}
          </List>
        </Grid>

        <Grid item xs={12} md={8}>
          <Paper elevation={10}>
            <CardMedia
              component='img'
              image={frontmatter.image}
              alt={frontmatter.image}
              sx={{
                maxHeight: 450,
                objectFit: "cover",
                objectPosition: "0% 65%",
                mb: 5,
              }}
            />
          </Paper>

          <Typography
            gutterBottom
            variant='h3'
            sx={{
              fontWeight: "bold",
              letterSpacing: 1.5,
              wordSpacing: 1,
            }}>
            {frontmatter.title}
          </Typography>
          <Divider
            sx={{
              my: 2,
            }}
          />
          <BlogCardInfo data={frontmatter} />
          {/* 본문 */}
          <Box
            sx={{
              my: 5,
            }}>
            <div
              className='blog-post'
              style={{
                letterSpacing: 0.9,
                wordSpacing: 2.5,
              }}
              dangerouslySetInnerHTML={{
                __html: html,
              }}
              // dangerouslySetInnerHTML={{
              //   __html: memoMarkdown,
              // }}
              // children={html}
            />
          </Box>
          <div>
            {mode && (
              <Stack
                direction='row'
                justifyContent='center'
                sx={{
                  my: 5,
                }}>
                <CircularProgress color='success' />
              </Stack>
            )}
            <Box
              sx={{
                display: mode ? "hidden" : "block",
                "& .utterances": {
                  maxWidth: "90%",
                },
              }}
              ref={commentEl}
            />
          </div>
        </Grid>
      </Grid>
    </>
  );
}

export const pageQuery = graphql`
  query ($path: String!) {
    markdownRemark(
      frontmatter: { slug: { eq: $path }, published: { eq: true } }
    ) {
      frontmatter {
        image
        description
        slug
        title
        author
        categories
        tags
        date(formatString: "YYYY-MM-DD")
      }
      html
      rawMarkdownBody
      headings {
        value
        depth
      }
      wordCount {
        words
      }
    }
  }
`;
