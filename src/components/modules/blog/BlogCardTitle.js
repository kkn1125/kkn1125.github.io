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
        "& a": {
          color: (theme) => theme.palette.text.primary,
          textDecoration: "none",
        },
      }}>
      <Link to={slug} title={title}>{cutText(title, 45)}</Link>
    </Typography>
  );
}

export default BlogCardTitle;
