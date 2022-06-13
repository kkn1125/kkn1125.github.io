import React, { Fragment, useContext, useEffect, useState } from "react";
import PropTypes from "prop-types";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import CssBaseline from "@mui/material/CssBaseline";
import useScrollTrigger from "@mui/material/useScrollTrigger";
import Slide from "@mui/material/Slide";
import {
  alpha,
  Avatar,
  Box,
  Button,
  Chip,
  Container,
  Fab,
  Fade,
  IconButton,
  InputBase,
  Menu,
  MenuItem,
  Stack,
  styled,
  useTheme,
} from "@mui/material";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import AdbIcon from "@mui/icons-material/Adb";
import MenuIcon from "@mui/icons-material/Menu";
import { Link, navigate } from "gatsby";
import SearchIcon from "@mui/icons-material/Search";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import { ColorModeContext } from "../top-layout";
import axios from "axios";
import { grey } from "@mui/material/colors";
import { uuidv4 } from "../../util/tools";

const pages = [
  {
    name: "blog",
    path: "/blog",
  },
  {
    name: "about",
    path: "/about",
  },
];
// const settings = ["Profile", "Account", "Dashboard", "Logout"];

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
        sx={{ position: "fixed", bottom: 16, right: 16 }}>
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

const Search = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  "&:hover": {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginLeft: 0,
  width: "100%",
  [theme.breakpoints.up("sm")]: {
    marginLeft: theme.spacing(1),
    width: "auto",
  },
}));

const SearchIconWrapper = styled("div")(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: "100%",
  position: "absolute",
  pointerEvents: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: "inherit",
  "& .MuiInputBase-input": {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create("width"),
    width: "100%",
    [theme.breakpoints.up("sm")]: {
      width: "12ch",
      "&:focus": {
        width: "20ch",
      },
    },
  },
}));

export default function HideAppBar(props) {
  const theme = useTheme();
  const colorMode = useContext(ColorModeContext);
  const [anchorElNav, setAnchorElNav] = useState(null);
  // const [anchorElUser, setAnchorElUser] = useState(null);

  const [visitor, setVisitor] = useState({
    today: 0,
    stack: 0,
  });

  useEffect(() => {
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
      ).then((res) => {
        console.log("visit!");
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
            console.warn("[Matches] data is valid.");
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
      ).then((res) => {
        const body = new DOMParser().parseFromString(
          res.data.contents,
          "text/html"
        ).body;
        const table = body.querySelector(
          "#main > div > form > div:nth-child(5) > table"
        );
        const stack = [
          ...table.querySelector("tbody").children,
        ][1].querySelector("td:last-child");
        const today = [
          ...table.querySelector("tbody").children,
        ][2].querySelector("td:last-child");
        setVisitor({
          ...visitor,
          today: today.textContent,
          stack: stack.textContent,
        });
      });
    }, 100);
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

  // const handleCloseUserMenu = () => {
  //   setAnchorElUser(null);
  // };
  return (
    <Fragment>
      <CssBaseline />
      <HideOnScroll {...props}>
        <AppBar>
          <Container maxWidth='xl'>
            <Toolbar disableGutters>
              <Avatar
                variant='rounded'
                alt='logo'
                src='/images/logo-k-color.png'
                sx={{
                  display: { xs: "none", md: "flex" },
                  mr: 1,
                }}
              />
              <Typography
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
                devkimson
              </Typography>

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
                  {pages.map((page) => (
                    <MenuItem key={page.name} onClick={handleCloseNavMenu}>
                      <Typography
                        key={page.name}
                        onClick={handleCloseNavMenu}
                        component={Link}
                        to={page.path}
                        sx={{
                          display: "block",
                          color: (theme) => theme.palette.text.primary,
                          textDecoration: "none",
                          textAlign: "center",
                        }}>
                        {page.name}
                      </Typography>
                    </MenuItem>
                  ))}
                </Menu>
              </Box>
              {/* small size */}
              <Avatar
                variant='rounded'
                alt='logo'
                src='/images/logo-k-color.png'
                sx={{ display: { xs: "flex", md: "none" }, mr: 1 }}
              />
              <Typography
                className='font-main'
                component={Link}
                to='/'
                sx={{
                  pr: 2,
                  fontWeight: 700,
                  textTransform: "uppercase",
                  fontSize: (theme) => theme.typography.pxToRem(TITLE_SIZE),
                  display: { xs: "flex", md: "none" },
                  flexGrow: 1,
                  letterSpacing: ".3rem",
                  color: "inherit",
                  textDecoration: "none",
                }}>
                devkimson
              </Typography>

              {/* big size */}
              <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
                {pages.map((page) => (
                  <Button
                    key={page.name}
                    onClick={handleCloseNavMenu}
                    component={Link}
                    to={page.path}
                    sx={{
                      my: 2,
                      display: "block",
                      color: (theme) => theme.palette.text.secondary,
                      textDecoration: "none",
                      textAlign: "center",
                    }}>
                    {page.name}
                  </Button>
                ))}
              </Box>
              <Stack direction='row' gap={1} sx={{ mr: 3 }}>
                <Chip
                  color='primary'
                  label={"오늘 방문자 " + visitor.today + " 명"}
                />
                <Chip
                  color='primary'
                  label={"누적 방문자 " + visitor.stack + " 명"}
                />
              </Stack>
              <Search>
                <SearchIconWrapper>
                  <SearchIcon />
                </SearchIconWrapper>
                <StyledInputBase
                  placeholder='Search…'
                  inputProps={{ "aria-label": "search" }}
                />
              </Search>
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
