import {
  Alert,
  AlertTitle,
  Box,
  CardMedia,
  CircularProgress,
  Container,
  Divider,
  Grid,
  List,
  ListItemButton,
  ListItemText,
  Paper,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";
import axios from "axios";
import { graphql } from "gatsby";
import "highlight.js/styles/monokai.css";
import parse from "html-react-parser";
import React, { memo, useEffect, useRef, useState } from "react";
import SyntaxHighlighter from "react-syntax-highlighter";
import { atelierHeathDark } from "react-syntax-highlighter/src/styles/hljs";
import { API_BASE_PATH, API_PATH } from "../../util/globals";
import BlogCardInfo from "../modules/blog/BlogCardInfo";
import ControlButton from "../modules/blog/ControlButton";
import Favorite from "../modules/common/Favorite";
import HashList from "../modules/common/HashList";
import Seo from "../modules/seo/Seo";
import ImageViewer from "../organisms/blog/ImageViewer";
import "./BlogPost.css";

function Template({ data, pageContext }) {
  const [image, setImage] = useState(null);
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
  const updatedAt = new Date(frontmatter.modified?.replace("|", ""));
  const createdAt = new Date(frontmatter.date.replace("|", ""));
  const isSame = frontmatter.modified === frontmatter.date;
  // const compare = updatedAt > createdAt;
  const isUpdated =
    !isSame &&
    updatedAt.getTime() >
      new Date(
        new Date().getFullYear(),
        new Date().getMonth(),
        new Date().getDate() - 1
      ).getTime();
  const comparedTime = isUpdated ? updatedAt : createdAt;
  const isOverThreeMonth =
    Date.now() >
    new Date(
      comparedTime.getFullYear(),
      comparedTime.getMonth() + 3,
      comparedTime.getDate()
    ).getTime();
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

    function imageViewer(e) {
      if (e.type === "keydown") {
        if (e.key === "Escape") {
          setImage(null);
          document.body.removeAttribute("style");
        }
      } else {
        if (e.target.tagName === "IMG" && e.target.alt !== "logo") {
          setImage(e.target.src);
          document.body.style = "overflow: hidden";
        } else {
          setImage(null);
          document.body.removeAttribute("style");
          return;
        }
      }
    }
    window.addEventListener("click", imageViewer);
    window.addEventListener("keydown", imageViewer);

    (async function () {
      // const res = await axios.get(
      //   API_PATH + API_BASE_PATH + "/posts/slug/" + encodeURI(frontmatter.slug),
      //   {
      //     headers: {
      //       "Content-Type": "application/json",
      //     },
      //   }
      // );
      // const post = await res.json();
      // if (post) {
      //   console.log(post.views);
      //   console.log(post.likes);
      //   await readPost(post.id);
      // }
    })();

    async function readPost(pid) {
      if (localStorage.getItem("users")) {
        const store = JSON.parse(localStorage.getItem("users"));
        if (store.ip && store.hash) {
          const res = await fetch(API_PATH + API_BASE_PATH + "/views/", {
            method: "post",
            headers: {
              "Content-Type": "application/json",
            },
            mode: "no-cors",
            body: {
              hash: store.hash,
              ip: store.ip,
              post_id: pid,
            },
          });
          const data = await res.json();
          console.log(data);
        }
      }
    }
    // readPost();

    return () => {
      window.removeEventListener("click", imageViewer);
      window.removeEventListener("keydown", imageViewer);
    };
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

  const UpdatedPosting = () => (
    <Alert
      variant='outlined'
      severity='success'
      sx={{
        mt: 2,
      }}>
      <AlertTitle>최근 1일 내에 업데이트 된 포스팅입니다!</AlertTitle>
      부족하지만 열심히 개선 중이니 너그럽게 봐주시기 바랍니다 😁
    </Alert>
  );

  const ThreeMonthOverPosting = () => (
    <Alert
      variant='standard'
      severity='warning'
      sx={{
        mt: 2,
      }}>
      <AlertTitle>3개월 이상 지난 포스팅입니다!</AlertTitle>
      포스팅에 소개된 라이브러리나 프레임워크의 버전이 변경되었을 수 있으니 해당
      공식 홈페이지에서 버전 체크를 하시기 바랍니다 🙇‍♂️
    </Alert>
  );

  const PleaseComment = () => (
    <Alert
      variant='standard'
      severity='success'
      sx={{
        mt: 2,
      }}>
      <AlertTitle>자유로운 소통을 원해요 📌</AlertTitle>
      보시는 분들의 댓글 하나하나에 힘을 얻습니다. 😁
      <br />
      해당 포스팅이 유용하지 않다면 피드백과 의견을 공유해주셔도 됩니다! 🙇‍♂️
    </Alert>
  );

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
              // height: '100%',
              "& ul": { padding: 0 },
            }}>
            <Typography
              gutterBottom
              sx={{
                pl: 0,
                fontSize: (theme) => theme.typography.pxToRem(24),
                fontWeight: 700,
                textDecoration: "underline",
              }}>
              INDEX
            </Typography>
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
          <Container maxWidth={"md"}>
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
              sx={{
                fontWeight: "bold",
                letterSpacing: 1.5,
                wordSpacing: 1,
                fontSize: (theme) => theme.typography.pxToRem(32),
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
            {isOverThreeMonth && <ThreeMonthOverPosting />}
            {isUpdated && <UpdatedPosting />}
            <Box
              sx={{
                my: 7,
                "& img": {
                  cursor: "pointer",
                },
              }}>
              <Box
                className='blog-post'
                sx={{
                  letterSpacing: 0.9,
                  wordSpacing: 2.5,
                  fontSize: "0.95rem",
                  "& blockquote": {
                    backgroundColor: (theme) =>
                      theme.palette.mode === "dark" ? "#555555" : "#eeeeee",
                  },
                }}>
                {parse(html, {
                  replace: (domNode) => {
                    if (domNode.name && domNode.name.match(/h[1-6]/g)) {
                      domNode.attribs["class"] = "title";
                    }
                    if (domNode.name && domNode.name === "a") {
                      domNode.attribs["target"] = "_blank";
                    }
                    if (domNode.name === "hr") {
                      domNode.attribs["class"] = "divider";
                    }
                    {
                      /* if (
                      domNode.name === "div" &&
                      domNode.attribs["class"] === "codepen"
                    ) {
                      return (
                        <iframe
                          height={300}
                          style={{ width: "100%" }}
                          scrolling='no'
                          title='javascript-filter-category-example'
                          src='https://codepen.io/kkn1125/embed/yLVpvLK?default-tab=js%2Cresult&theme-id=dark'
                          frameBorder={"no"}
                          loading='lazy'
                          allowTransparency
                          allowFullScreen>
                          See the Pen{" "}
                          <a href='https://codepen.io/kkn1125/pen/yLVpvLK'>
                            test2
                          </a>{" "}
                          by kkn1125 (
                          <a href='https://codepen.io/kkn1125'>@kkn1125</a>) on{" "}
                          <a href='https://codepen.io'>CodePen</a>.
                        </iframe>
                      );
                    } */
                    }

                    if (domNode.name === "pre") {
                      const children = domNode.children[0];
                      if (children.type === "tag" && children.name === "code") {
                        return (
                          <Box
                            sx={{
                              my: 3,
                              position: "relative",
                              [`&::before`]: {
                                content: '""',
                                width: "100%",
                                height: "2rem",
                                backgroundColor: "#555",
                                display: "block",
                                borderTopLeftRadius: 15,
                                borderTopRightRadius: 15,
                              },
                              borderBottomLeftRadius: 15,
                              borderBottomRightRadius: 15,
                              overflow: "hidden",
                            }}>
                            <Typography
                              sx={{
                                position: "absolute",
                                top: 16 * 1,
                                left: 20,
                                transform: "translateY(-50%)",
                                textTransform: "uppercase",
                                fontWeight: 700,
                                color: "#ffffff",
                              }}>
                              {children.attribs.class.split("-").pop()}
                            </Typography>
                            <Box
                              sx={{
                                width: 15,
                                height: 15,
                                backgroundColor: "#f56767",
                                borderRadius: "50%",
                                position: "absolute",
                                top: 16 * 1,
                                right: 80,
                                transform: "translateY(-50%)",
                                transition: "150ms ease",
                                [`&:hover`]: {
                                  transform: "translateY(-50%) scale(1.1)",
                                },
                              }}
                            />
                            <Box
                              sx={{
                                width: 15,
                                height: 15,
                                backgroundColor: "#e9ce63",
                                borderRadius: "50%",
                                position: "absolute",
                                top: 16 * 1,
                                right: 50,
                                transform: "translateY(-50%)",
                                transition: "150ms ease",
                                [`&:hover`]: {
                                  transform: "translateY(-50%) scale(1.1)",
                                },
                              }}
                            />
                            <Box
                              sx={{
                                width: 15,
                                height: 15,
                                backgroundColor: "#68ee85",
                                borderRadius: "50%",
                                position: "absolute",
                                top: 16 * 1,
                                right: 20,
                                transform: "translateY(-50%)",
                                transition: "150ms ease",
                                [`&:hover`]: {
                                  transform: "translateY(-50%) scale(1.1)",
                                },
                              }}
                            />
                            <SyntaxHighlighter
                              showLineNumbers
                              language={
                                domNode.children[0].attribs?.class
                                  ?.split("-")
                                  ?.pop() || "plaintext"
                              }
                              style={atelierHeathDark}>
                              {domNode.children
                                ? domNode.children[0].children[0].data.trim()
                                : ""}
                            </SyntaxHighlighter>
                          </Box>
                        );
                      }
                    }
                  },
                })}
              </Box>
            </Box>
            {isOverThreeMonth && <ThreeMonthOverPosting />}
            {isUpdated && <UpdatedPosting />}

            <PleaseComment />
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
          </Container>
        </Grid>
      </Grid>
      {image && <ImageViewer image={image} />}
    </>
  );
}

export const pageQuery = graphql`
  query ($path: String!) {
    markdownRemark(
      frontmatter: {
        layout: { eq: "post" }
        slug: { eq: $path }
        published: { eq: true }
      }
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
        modified(formatString: "YYYY-MM-DD | HH:mm")
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
