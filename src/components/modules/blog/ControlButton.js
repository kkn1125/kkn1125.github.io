import { Box, Typography } from "@mui/material";
import { navigate } from "gatsby";
import React from "react";
import { cutText } from "../../../util/tools";

function ControlButton({ controlPost, side }) {
  return (
    <Box
      onClick={() => controlPost && navigate(controlPost.slug)}
      sx={{
        cursor: "pointer",
        py: 1,
        px: 3,
        minHeight: 90,
        textAlign: side === "prev" ? "left" : "right",
        borderWidth: 1,
        borderColor: "GrayText",
        borderStyle: "solid",
        transition: "color, background-color 150ms ease-in-out",
        "& a": {
          textDecoration: "none",
          color: (theme) => theme.palette.info.main,
        },
        "&:hover": {
          backgroundColor: (theme) => theme.palette.success.main,
          borderColor: (theme) => theme.palette.success.main,
          "& p:first-of-type": {
            color: (theme) => theme.palette.white.main,
          },
          "& p:last-child": {
            color: (theme) => theme.palette.white.main + "a5",
          },
        },
      }}>
      <Typography color='grey'>
        {controlPost ? side.toUpperCase() : "No Post"}
      </Typography>
      <Typography color='GrayText'>
        {controlPost
          ? cutText(controlPost.title, 70, "...")
          : side === "next"
          ? "열심히 다음 글을 준비 중 입니다! 🛠️"
          : "첫 글입니다."}
      </Typography>
    </Box>
  );
}

export default ControlButton;
