import { Typography } from "@mui/material";
import { Link } from "gatsby";
import React from "react";

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
      <Link to={slug}>{title}</Link>
    </Typography>
  );
}

export default BlogCardTitle;
