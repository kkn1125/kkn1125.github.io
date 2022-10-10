import { Typography } from "@mui/material";
import { Link } from "gatsby";
import React from "react";
import { cutText } from "../../../util/tools";

function BlogCardTitle({ title, slug }) {
  return (
    <Typography
      gutterBottom
      variant='h4'
      component='div'
      sx={{
        position: "relative",
        fontWeight: 700,
        color: "transparent",
        ["& a"]: {
          color: (theme) => theme.palette.text.primary,
          textDecoration: "none",
          backgroundImage: "linear-gradient(to right, #000, #000)",
          ["-webkit-background-clip"]: "text",
          ["-webkit-text-fill-color"]: "transparent",
        },
        ["& a::before "]: {
          userSelect: "none",
          pointerEvents: "none",
          content: `"${cutText(title, 45)}"`,
          position: "absolute",
          top: 0,
          right: 0,
          bottom: 0,
          left: 0,
          opacity: 0,
          transition: "opacity 300ms",
          width: 0,
          backgroundImage:
            "-webkit-linear-gradient(45deg, #09009f, #00ff95 80%)",
          ["-webkit-background-clip"]: "text",
          ["-webkit-text-fill-color"]: "transparent",
        },
        ["& a:hover::before "]: {
          width: "100%",
          opacity: 1,
        },
      }}>
      <Link to={slug} title={title}>
        {cutText(title, 45)}
      </Link>
    </Typography>
  );
}

export default BlogCardTitle;
