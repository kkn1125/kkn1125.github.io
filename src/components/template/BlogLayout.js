import { List } from "@mui/material";
import React, { memo } from "react";

function BlogLayout({ children }) {
    return <List sx={{ width: "100%" }}>{children}</List>;
}

export default memo(BlogLayout);
