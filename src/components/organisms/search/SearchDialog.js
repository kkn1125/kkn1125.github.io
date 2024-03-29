import React, {
  Fragment,
  memo,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import {
  Alert,
  AlertTitle,
  Box,
  Chip,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Stack,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { graphql, Link, StaticQuery } from "gatsby";
import HashList from "../../modules/common/HashList";

function SearchDialog({ children, data, keywords }) {
  const theme = useTheme();
  const [open, setOpen] = useState(false);
  const [result, setResult] = useState([]);
  // const [search, setSearch] = useState(false);
  // const [fullWidth, setFullWidth] = useState(true);
  // const [maxWidth, setMaxWidth] = useState("sm");
  const searchRef = useRef();

  const handleClickOpen = useCallback(() => {
    setResult([]);
    setOpen(true);
    setTimeout(() => {
      searchRef.current.value = getRandomKey();
    }, 100);
  });

  const handleClose = useCallback(() => {
    setOpen(false);
    searchRef.current.value = "";
  });

  function getRandomKey() {
    if (keywords) {
      const filtered = keywords.filter(
        (blog) => blog.node.frontmatter.slug === location.pathname
      );
      if (filtered.length > 0) {
        const { categories, tags } = filtered[0].node.frontmatter;
        const concats = categories.concat(...tags);
        return concats[parseInt((concats.length * Math.random()).toString())];
      } else {
        const index = parseInt(Math.random() * keywords.length);
        const [rand] = keywords.slice(index, index + 1);
        const { tags, categories } = rand.node.frontmatter;
        const concats = categories.concat(...tags);
        return concats[parseInt(Math.random() * concats.length)];
      }
    } else {
      return "";
    }
  }

  return (
    <StaticQuery
      query={graphql`
        {
          allMarkdownRemark(
            sort: { fields: frontmatter___date, order: DESC }
            filter: { frontmatter: { published: { eq: true } } }
          ) {
            edges {
              node {
                frontmatter {
                  slug
                  title
                  description
                  author
                  date(fromNow: false)
                  categories
                  tags
                }
                html
                rawMarkdownBody
              }
            }
          }
        }
      `}
      render={(data) => {
        const {
          allMarkdownRemark: { edges },
        } = data;
        const handleKeyDown = (e) => {
          if (e.key === "Enter") {
            setResult([]);

            const el = searchRef.current;
            const value = el.value;
            if (value === "") return;
            const dataResult = edges
              .filter(
                ({ node: { frontmatter, html, rawMarkdownBody } }) =>
                  frontmatter.title.indexOf(value) > -1 ||
                  html.indexOf(value) > -1 ||
                  frontmatter.slug.indexOf(value) > -1 ||
                  frontmatter.categories.find((it) => it === value) !==
                    undefined ||
                  frontmatter.tags.find((it) => it === value) !== undefined
              )
              .map(({ node: { frontmatter } }) => frontmatter);
            // console.log(result);
            setResult(dataResult);
          }
        };

        return (
          <Fragment>
            <IconButton color='white' onClick={handleClickOpen}>
              <SearchIcon />
            </IconButton>
            <Dialog fullWidth maxWidth={"lg"} open={open} onClose={handleClose}>
              <DialogTitle>🔍 Search</DialogTitle>
              <Box sx={{ px: 3 }}>
                <TextField
                  autoFocus
                  inputRef={searchRef}
                  id='standard-search'
                  label='Blog Search'
                  type='search'
                  variant='standard'
                  fullWidth
                  placeholder='검색어를 입력하세요'
                  onKeyDown={handleKeyDown}
                  sx={{
                    "& label": {
                      color: theme.palette.grey[500],
                    },
                  }}
                />
              </Box>
              <List
                gap={3}
                sx={{
                  px: 3,
                }}>
                {result.length === 0 && searchRef.current?.value && (
                  <Alert severity='warning'>
                    <AlertTitle>Not found 🥲</AlertTitle>
                    <strong>"{searchRef.current.value}"</strong> 관련된 내용이
                    없습니다.
                  </Alert>
                )}
                {result.map((node) => (
                  <ListItem key={node.slug}>
                    <Stack
                      sx={{
                        width: "100%",
                      }}>
                      <Typography gutterBottom>
                        <Link
                          to={node.slug}
                          style={{
                            color: theme.palette.text.primary,
                            textDecoration: "none",
                          }}
                          onClick={() => {
                            setOpen(false);
                            setResult([]);
                            searchRef.current.value = "";
                          }}>
                          {node.title}
                        </Link>
                      </Typography>
                      <Stack
                        direction='row'
                        justifyContent='space-between'
                        gap={1}>
                        <HashList hash={node.categories} types='categories' />
                        <HashList hash={node.tags} types='tags' />
                      </Stack>
                    </Stack>
                  </ListItem>
                ))}
              </List>
              <DialogActions>
                <Button onClick={handleClose}>Close</Button>
              </DialogActions>
            </Dialog>
          </Fragment>
        );
      }}
    />
  );
}

export default memo(SearchDialog);
