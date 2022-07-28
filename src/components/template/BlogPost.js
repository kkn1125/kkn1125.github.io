import React, { memo, useEffect, useRef, useState } from "react";
import { graphql, Link } from "gatsby";
import "./BlogPost.css";
import "highlight.js/styles/monokai.css";
import parse from "html-react-parser";
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
import BlogCardInfo from "../modules/blog/BlogCardInfo";
import SyntaxHighlighter from "react-syntax-highlighter";
import { atelierPlateauDark } from "react-syntax-highlighter/src/styles/hljs";
import HashList from "../modules/common/HashList";
import Seo from "../modules/seo/Seo";
import Favorite from "../modules/common/Favorite";
import { cutText } from "../../util/tools";
import ControlButton from "../modules/blog/ControlButton";

function Template({ data, pageContext }) {
  const { previous, next } = pageContext;
  const { frontmatter: prevPost } = previous || { frontmatter: undefined };
  const { frontmatter: nextPost } = next || { frontmatter: undefined };
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
      <Grid
        container
        justifyContent='center'
        sx={{
          flexWrap: { xs: "wrap", md: "nowrap" },
          gap: 5,
        }}>
        <Grid item xs={12} md={3}>
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

        <Grid item xs={12} md={9}>
          <Paper elevation={10}>
            <CardMedia
              component='img'
              image={frontmatter.image}
              alt={frontmatter.image}
              sx={{
                maxHeight: 450,
                objectFit: "cover",
                objectPosition: "0% 50%",
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
            <Favorite data={frontmatter} fixed={false} />
          </Typography>
          <Divider
            sx={{
              my: 2,
              borderColor: "#e1e1e1",
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
              }}>
              {parse(html, {
                replace: (domNode) => {
                  if (domNode.name && domNode.name.match(/h[1-6]/g)) {
                    domNode.attribs["class"] = "title";
                  }
                  if (domNode.name && domNode.name === "a") {
                    domNode.attribs["target"] = "_blank";
                  }
                  if (domNode.name === "pre") {
                    const children = domNode.children[0];
                    if (children.type === "tag" && children.name === "code") {
                      return (
                        <SyntaxHighlighter
                          showLineNumbers
                          language={
                            domNode.children[0].attribs?.class
                              ?.split("-")
                              ?.pop() || "plaintext"
                          }
                          style={atelierPlateauDark}>
                          {domNode.children
                            ? domNode.children[0].children[0].data.trim()
                            : ""}
                        </SyntaxHighlighter>
                      );
                    }
                  }
                },
              })}
            </div>
          </Box>
          <Divider
            sx={{
              my: 2,
              borderColor: "#e1e1e1",
            }}
          />
          <Stack
            direction='row'
            justifyContent='space-between'
            gap={1}
            sx={{ mt: 3 }}>
            <HashList hash={frontmatter.categories} types='categories' />
            <HashList hash={frontmatter.tags} types='tags' />
          </Stack>
          <Stack
            direction={{
              xs: "column",
              md: "row",
            }}
            justifyContent='space-between'
            sx={{
              my: 4.5,
              gap: 3,
            }}>
            <Box sx={{ flex: 1 }}>
              {<ControlButton controlPost={nextPost} side={"prev"} />}
            </Box>
            <Box sx={{ flex: 1 }}>
              {<ControlButton controlPost={prevPost} side={"next"} />}
            </Box>
          </Stack>
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
        date(formatString: "YYYY-MM-DD | HH:mm")
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

export default memo(Template);
