import { Typography } from "@mui/material";
import React from "react";
import { cutText } from "../../../util/tools";

function BlogCardDesc({desc}) {
  return (
    <Typography
      variant='body2'
      color='text'
      sx={{
        my: 5,
      }}>
      {cutText(desc, 80)}
    </Typography>
  );
}

export default BlogCardDesc;
