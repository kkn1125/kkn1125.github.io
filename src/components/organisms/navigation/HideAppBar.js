import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import MenuIcon from "@mui/icons-material/Menu";
import GroupIcon from "@mui/icons-material/People";
import PersonIcon from "@mui/icons-material/Person";
import {
  Avatar,
  Badge,
  Box,
  Button,
  Chip,
  Container,
  Fab,
  Fade,
  IconButton,
  Menu,
  MenuItem,
  Stack,
  Tooltip,
  useTheme,
} from "@mui/material";
import AppBar from "@mui/material/AppBar";
import CssBaseline from "@mui/material/CssBaseline";
import Slide from "@mui/material/Slide";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import useScrollTrigger from "@mui/material/useScrollTrigger";

import axios from "axios";
import { Link, navigate } from "gatsby";
import PropTypes from "prop-types";
import React, { Fragment, useContext, useEffect, useState } from "react";

import { PickContext } from "../../../context/pickContext";
import BlogHook from "../../../hooks/blogHook";
import LivesHook from "../../../hooks/livesHook";
import { uuidv4 } from "../../../util/tools";
import { ColorModeContext } from "../../top-layout";
import TemporaryDrawer from "../drawer/TemporaryDrawer";
import SearchDialog from "../search/SearchDialog";

const BRAND = "devkimson";

const pages = [
  {
    name: "lives",
    path: "/lives",
  },
  {
    name: "tech",
    path: "/blog",
  },
  {
    name: "about",
    path: "/about",
  },
];

const resConvertData = (res) => {
  const body = new DOMParser().parseFromString(
    res.data.contents,
    "text/html"
  ).body;
  const table = body.querySelectorAll("#main form table.table tbody tr");

  const filtered = [...table].filter((el) => el.textContent.match(/방문자/g));

  const tableEntries = filtered.map((tr) => {
    const [key, value] = tr.children;
    return [key.textContent, value.textContent];
  });
  return Object.fromEntries(tableEntries);
};

const compareWithOrigin = (a, b) => {
  return Object.entries(a).some(([_, __]) => b[_] !== __);
};

const TITLE_SIZE = 25;

function ScrollTop(props) {
  const { children, window } = props;

  // Note that you normally won't need to set the window ref as useScrollTrigger
  // will default to window.
  // This is only being set here because the demo is in an iframe.
  const trigger = useScrollTrigger({
    target: window ? window() : undefined,
    disableHysteresis: true,
    threshold: 100,
  });

  const handleClick = (event) => {
    navigate("#");
    navigate("");
  };

  return (
    <Fade in={trigger}>
      <Box
        onClick={handleClick}
        role='presentation'
        sx={{ position: "fixed", bottom: 16, right: 16, zIndex: 1000 }}>
        {children}
      </Box>
    </Fade>
  );
}

ScrollTop.propTypes = {
  children: PropTypes.element.isRequired,
  window: PropTypes.func,
};

const validTime = 1000 * 60 * 60 * 24;

function HideOnScroll(props) {
  const { children, window } = props;
  const trigger = useScrollTrigger({
    target: window ? window() : undefined,
  });

  return (
    <Slide appear={false} direction='down' in={!trigger}>
      {children}
    </Slide>
  );
}

HideOnScroll.propTypes = {
  children: PropTypes.element.isRequired,
  window: PropTypes.func,
};

function HideAppBar(props) {
  const theme = useTheme();
  const colorMode = useContext(ColorModeContext);
  const [anchorElNav, setAnchorElNav] = useState(null);
  const pick = useContext(PickContext);
  const [blogCount, setBlogCount] = useState(0);
  const [livesCount, setLivesCount] = useState(0);
  const blogs = BlogHook();
  const lives = LivesHook();

  const [visitor, setVisitor] = useState({
    today: 0,
    stack: 0,
  });

  useEffect(() => {
    setBlogCount(blogs.length);
    setLivesCount(lives.length);
    // visite check
    const userInfo = getUserIdentity();

    function isVisitedUser() {
      if (Object.keys(userInfo).length > 0) return true;
      else return false;
    }

    const userCheck = isVisitedUser();

    if (!userCheck) {
      checkVisite(); // update visitor count!
      setUserIdentity({
        sid: navigator.userAgent.replace(/[\s]*/gm, "") + uuidv4(),
        maxTime: new Date().getTime() + validTime,
      });
    } else {
      if (
        userInfo["sid"].startsWith(navigator.userAgent.replace(/[\s]*/gm, ""))
      ) {
        if (new Date().getTime() > new Date(userInfo["maxTime"]).getTime()) {
          checkVisite(); // update visitor count!
          userInfo["maxTime"] = new Date().getTime() + validTime;
          setUserIdentity({
            sid: userInfo["sid"],
            maxTime: userInfo["maxTime"],
          });
        } else {
        }
      }
    }

    function checkVisite() {
      axios(
        `https://api.allorigins.win/get?url=${encodeURIComponent(
          "https://url.kr/6po2f9"
        )}`
      )
        .then((res) => {
          console.log("visit!");
        })
        .catch((e) => {
          // dev.log(e);
        });
    }

    function getUserIdentity() {
      if (window.localStorage) {
        if (!localStorage["userInfo"]) {
          localStorage["userInfo"] = "{}";
        } else {
          const validUserMaxTimeInfo =
            (JSON.parse(localStorage["userInfo"]) &&
              JSON.parse(localStorage["userInfo"])["maxTime"]) ||
            "";
          if (isNaN(validUserMaxTimeInfo)) {
            if (validUserMaxTimeInfo.match(/[^0-9]/gm)) {
              console.info(
                "버그 수정된 버전으로 데이터 변경이 완료되었습니다."
              );
              localStorage["userInfo"] = "{}";
            }
          } else {
            // console.warn("[Matches] data is valid.");
          }
        }
        return JSON.parse(localStorage["userInfo"]);
      }
    }

    function setUserIdentity(userData) {
      window.localStorage &&
        (localStorage["userInfo"] = JSON.stringify(userData));
    }

    localStorage["userInfo"] = JSON.stringify({
      sid: navigator.userAgent.replace(/[\s]*/gm, "") + uuidv4(),
      maxTime: Date.now() + 1000 * 60 * 60 * 24,
    });
    setTimeout(() => {
      axios(
        `https://api.allorigins.win/get?url=${encodeURIComponent(
          "https://url.kr/6po2f9*"
        )}`
      )
        .then((res) => {
          const tableObj = resConvertData(res);

          const getData = {
            today: tableObj["오늘 방문자수"].split(" ").shift(),
            stack: tableObj["누적 방문자수"],
          };

          if (compareWithOrigin(getData, visitor)) {
            setVisitor({
              ...visitor,
              ...getData,
            });
          }
        })
        .catch((e) => {
          // dev.log(e);
        });
    }, 100);

    let refreshVisitant = setInterval(() => {
      axios(
        `https://api.allorigins.win/get?url=${encodeURIComponent(
          "https://url.kr/6po2f9*"
        )}`
      )
        .then((res) => {
          const tableObj = resConvertData(res);

          const getData = {
            today: tableObj["오늘 방문자수"].split(" ").shift(),
            stack: tableObj["누적 방문자수"],
          };

          if (compareWithOrigin(getData, visitor)) {
            setVisitor({
              ...visitor,
              ...getData,
            });
          }
        })
        .catch((e) => {
          // dev.log(e);
        });
    }, 1000 * 30);

    return () => clearInterval(refreshVisitant);
  }, []);

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };
  // const handleOpenUserMenu = (event) => {
  //   setAnchorElUser(event.currentTarget);
  // };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  // const handleSearch = (e) => {
  //   openSearch(!searchToggle);
  // };

  // const handleCloseUserMenu = () => {
  //   setAnchorElUser(null);
  // };
  return (
    <Fragment>
      <CssBaseline />
      <HideOnScroll {...props}>
        <AppBar
          sx={{
            [`&.MuiPaper-root.MuiAppBar-root`]: {
              // backgroundImage: 'linear-gradient(to right, rgba(255, 255, 255, 0.09), rgba(255, 255, 255, 0.5))'
            },
          }}>
          <Container maxWidth='xl'>
            <Toolbar disableGutters>
              <Box>
                <Avatar
                  component={Link}
                  to='/'
                  variant='rounded'
                  alt='logo'
                  src='/images/logo-k-color.png'
                  sx={{
                    display: { xs: "none", md: "flex" },
                    mr: 1,
                  }}
                  title={BRAND}
                />
              </Box>
              {/* <Typography
                className='font-main'
                component={Link}
                to='/'
                sx={{
                  pr: 2,
                  fontWeight: 700,
                  textTransform: "uppercase",
                  fontSize: (theme) => theme.typography.pxToRem(TITLE_SIZE),
                  display: { xs: "none", md: "flex" },
                  letterSpacing: ".3rem",
                  color: "inherit",
                  textDecoration: "none",
                }}>
                {BRAND}
              </Typography> */}

              <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
                <IconButton
                  size='large'
                  aria-label='account of current user'
                  aria-controls='menu-appbar'
                  aria-haspopup='true'
                  onClick={handleOpenNavMenu}
                  color='inherit'>
                  <MenuIcon />
                </IconButton>
                <Menu
                  id='menu-appbar'
                  anchorEl={anchorElNav}
                  anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "left",
                  }}
                  keepMounted
                  transformOrigin={{
                    vertical: "top",
                    horizontal: "left",
                  }}
                  open={Boolean(anchorElNav)}
                  onClose={handleCloseNavMenu}
                  sx={{
                    display: { xs: "block", md: "none" },
                  }}>
                  {pages.map(
                    (page) =>
                      (page.name !== "lives" ||
                        (page === "lives" && livesCount !== 0)) && (
                        <MenuItem key={page.name} onClick={handleCloseNavMenu}>
                          <Typography
                            key={page.name}
                            onClick={handleCloseNavMenu}
                            component={Link}
                            to={page.path + "/"}
                            sx={{
                              display: "block",
                              color: (theme) => theme.palette.text.primary,
                              textDecoration: "none",
                              textAlign: "center",
                              textTransform: "uppercase",
                            }}>
                            {page.name}
                            {page.name.match(/tech|lives/) ? (
                              <>
                                {" "}
                                <Chip
                                  size='small'
                                  label={
                                    page.name === "tech"
                                      ? blogCount
                                      : livesCount
                                  }
                                  color='error'
                                />
                              </>
                            ) : (
                              ""
                            )}
                          </Typography>
                        </MenuItem>
                      )
                  )}
                  {pick.storage.length > 0 && (
                    <MenuItem onClick={handleCloseNavMenu}>
                      <TemporaryDrawer
                        sx={{
                          display: "block",
                          color: (theme) => theme.palette.text.primary,
                          textDecoration: "none",
                          textAlign: "center",
                        }}
                        storage={pick.storage}>
                        <Tooltip title='Hidden Menu!'>
                          <Badge variant='dot' color='warning'>
                            <Typography sx={{ fontWeight: "bold" }}>
                              FAVORITES
                            </Typography>
                          </Badge>
                        </Tooltip>
                      </TemporaryDrawer>
                    </MenuItem>
                  )}
                </Menu>
              </Box>
              {/* small size */}
              <Box
                sx={{
                  flex: { xs: 1, md: 0 },
                }}>
                <Avatar
                  component={Link}
                  to='/'
                  variant='rounded'
                  alt='logo'
                  src='/images/logo-k-color.png'
                  sx={{ display: { xs: "flex", md: "none" }, mr: 1 }}
                  title={BRAND}
                />
              </Box>
              {/* <Typography
                className='font-main'
                component={Link}
                to='/'
                sx={{
                  pr: 2,
                  fontWeight: 700,
                  textTransform: "uppercase",
                  fontSize: (theme) => ({
                    md: theme.typography.pxToRem(TITLE_SIZE),
                    xs: theme.typography.pxToRem(20),
                  }),
                  display: { xs: "flex", md: "none" },
                  flexGrow: 1,
                  letterSpacing: {
                    md: ".3rem",
                    xs: 0,
                  },
                  color: "inherit",
                  textDecoration: "none",
                }}>
                {BRAND}
              </Typography> */}

              {/* big size */}
              <Box
                sx={{
                  flexGrow: 1,
                  display: {
                    xs: "none",
                    md: "flex",
                  },
                  gap: 1,
                }}>
                {pages.map(
                  (page) =>
                    (page.name !== "lives" ||
                      (page === "lives" && livesCount !== 0)) && (
                      <Button
                        key={page.name}
                        onClick={handleCloseNavMenu}
                        component={Link}
                        to={page.path + "/"}
                        sx={{
                          my: 2,
                          display: "block",
                          color: (theme) => theme.palette.text.secondary,
                          textDecoration: "none",
                          textAlign: "center",
                        }}>
                        {page.name}
                        {page.name.match(/tech|lives/) ? (
                          <>
                            {" "}
                            <Chip
                              size='small'
                              label={
                                page.name === "tech" ? blogCount : livesCount
                              }
                              color='error'
                            />
                          </>
                        ) : (
                          ""
                        )}
                      </Button>
                    )
                )}
                {pick.storage.length > 0 && (
                  <TemporaryDrawer
                    sx={{
                      my: 2,
                      display: "block",
                      color: (theme) => theme.palette.text.secondary,
                      textDecoration: "none",
                      textAlign: "center",
                    }}
                    storage={pick.storage}>
                    <Tooltip title='Hidden Menu!'>
                      <Badge
                        badgeContent={pick.storage.length}
                        color='warning'
                        invisible={false}
                        sx={{ fontWeight: "bold" }}>
                        FAVORITES
                      </Badge>
                    </Tooltip>
                  </TemporaryDrawer>
                )}
              </Box>
              <Stack
                direction='row'
                gap={3}
                sx={{
                  mr: 3,
                  display: {
                    xs: "none",
                    md: "flex",
                  },
                }}
                alignItems='center'>
                <Tooltip title='Today visitant'>
                  <Chip
                    color='primary'
                    label={
                      <Stack
                        direction='row'
                        alignItems='center'
                        gap={1}
                        sx={{
                          "& svg": {
                            display: {
                              md: "block",
                              xs: "none",
                            },
                          },
                        }}>
                        <PersonIcon />
                        {visitor.today}
                      </Stack>
                    }
                  />
                </Tooltip>
                <Typography
                  sx={{
                    fontSize: (theme) => theme.typography.pxToRem(16),
                    display: {
                      sm: "inline-block",
                      md: "none",
                    },
                  }}>
                  /
                </Typography>
                <Tooltip title='Total visitant'>
                  <Chip
                    color='primary'
                    label={
                      <Stack
                        direction='row'
                        alignItems='center'
                        gap={1}
                        sx={{
                          "& svg": {
                            display: {
                              md: "block",
                              xs: "none",
                            },
                          },
                        }}>
                        <GroupIcon />
                        {visitor.stack}
                      </Stack>
                    }
                  />
                </Tooltip>
              </Stack>

              <SearchDialog keywords={blogs} />
              {/* <Search>
                  <SearchIconWrapper>
                    <SearchIcon />
                  </SearchIconWrapper>
                  <StyledInputBase
                    placeholder='Search…'
                    inputProps={{ "aria-label": "search" }}
                  />
                </Search> */}

              {/* </SearchDialog> */}
              {/* <StyledInputBase
                  placeholder='Search…'
                  inputProps={{ "aria-label": "search" }}
                /> */}
              {/* save */}
              <Box sx={{ flexGrow: 0 }}>
                <IconButton
                  sx={{ ml: 1 }}
                  onClick={colorMode.toggleColorMode}
                  color='inherit'>
                  {theme.palette.mode === "dark" ? (
                    <Brightness7Icon />
                  ) : (
                    <Brightness4Icon />
                  )}
                </IconButton>
              </Box>
              {/* <Box sx={{ flexGrow: 0 }}>
                <Tooltip title='Open settings'>
                  <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                    <Avatar
                      alt='Remy Sharp'
                      src='/static/images/avatar/2.jpg'
                    />
                  </IconButton>
                </Tooltip>
                <Menu
                  sx={{ mt: "45px" }}
                  id='menu-appbar'
                  anchorEl={anchorElUser}
                  anchorOrigin={{
                    vertical: "top",
                    horizontal: "right",
                  }}
                  keepMounted
                  transformOrigin={{
                    vertical: "top",
                    horizontal: "right",
                  }}
                  open={Boolean(anchorElUser)}
                  onClose={handleCloseUserMenu}>
                  {settings.map((setting) => (
                    <MenuItem key={setting} onClick={handleCloseUserMenu}>
                      <Typography textAlign='center'>{setting}</Typography>
                    </MenuItem>
                  ))}
                </Menu>
              </Box> */}
              {/* save */}
            </Toolbar>
          </Container>
        </AppBar>
      </HideOnScroll>
      <Toolbar id='back-to-top-anchor' />
      <ScrollTop {...props}>
        <Fab size='small' aria-label='scroll back to top'>
          <KeyboardArrowUpIcon />
        </Fab>
      </ScrollTop>
    </Fragment>
  );
}

export default HideAppBar;
