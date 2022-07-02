import { List } from "@mui/material";
import React from "react";

function BlogLayout({ children }) {
  return <List sx={{ width: "100%" }}>{children}</List>;
}

export default BlogLayout;
