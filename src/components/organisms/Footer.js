import { Avatar, Box, Stack, Typography } from "@mui/material";
import { Link, navigate } from "gatsby";
import React from "react";

const BRAND_NAME = "DEVKIMSON";
const TITLE_SIZE = 25;

function Footer() {
  return (
    <Stack
      direction='row'
      alignItems='center'
      justifyContent='space-between'
      sx={{
        p: 3,
        // backgroundImage:
        //   "linear-gradient(to right, rgba(255, 255, 255, 0.09), rgba(255, 255, 255, 0.5))",
        backgroundColor: (theme) =>
          theme.palette.mode === "dark"
            ? "#121212"
            : theme.palette.primary.main,
        color: "#ffffff",
      }}>
      <Stack direction='row' alignItems='center'>
        {/* <Avatar
          variant='rounded'
          alt='logo'
          src='/images/logo-k-color.png'
          sx={{
            display: { xs: "none", md: "flex" },
            mr: 1,
            cursor: "pointer",
          }}
          onClick={() => navigate("/")}
        /> */}
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
          {BRAND_NAME}
        </Typography>
      </Stack>
      <Typography>Copyright 2021. {BRAND_NAME} All rights reserved.</Typography>
      <Box></Box>
    </Stack>
  );
}

export default Footer;
