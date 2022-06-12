import React, { useEffect, useMemo, useState } from "react";
import { graphql } from "gatsby";
import { Markdown } from "../../util/mdParser";
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
} from "@mui/material";
import { AnchorLink } from "gatsby-plugin-anchor-links";
import BlogCardInfo from "../common/BlogCardInfo";

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

  const [selectedIndex, setSelectedIndex] = useState(0);

  const handleListItemClick = (event, index, value, depth) => {
    setSelectedIndex(index);
    const titles = [...document.querySelectorAll(`h${depth}`)];
    for (let i = 0; i < titles.length; i++) {
      if (titles[i].textContent === value) {
        titles[i].scrollIntoView(true);
        break;
      }
    }
  };

  const memoMarkdown = useMemo(
    () =>
      Markdown.parse(rawMarkdownBody, {
        ol: "list-group reset",
        ul: "list-group reset",
        li: "list-item",
        blockquote: "blockquote blockquote-info",
        h: false,
        indent: 4,
      }),
    []
  );

  useEffect(() => {
    hljs.configure({});
    hljs.highlightAll();
  }, []);

  return (
    <Grid container justifyContent='center' gap={5}>
      <Grid item xs={12} md={2}>
        <List
          sx={{
            width: "100%",
            maxWidth: 360,
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
            image={frontmatter.image.replace(/assets/g, "")}
            alt={frontmatter.image}
            sx={{
              maxHeight: 450,
              objectFit: "cover",
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
            // dangerouslySetInnerHTML={{ __html: html }}
            dangerouslySetInnerHTML={{
              __html: memoMarkdown,
            }}
            // children={html}
          />
        </Box>
      </Grid>
    </Grid>
  );
}

export const pageQuery = graphql`
  query ($path: String!) {
    markdownRemark(frontmatter: { slug: { eq: $path } }) {
      frontmatter {
        image
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
