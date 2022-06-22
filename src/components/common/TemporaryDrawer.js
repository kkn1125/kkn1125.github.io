import React, { useState } from "react";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import Button from "@mui/material/Button";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
// import InboxIcon from "@mui/icons-material/MoveToInbox";
// import MailIcon from "@mui/icons-material/Mail";
import BookIcon from "@mui/icons-material/Book";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import CategoryIcon from "@mui/icons-material/Category";
import { Link, navigate } from "gatsby";
import { Typography } from "@mui/material";

const authorInfo = [
  {
    name: "github",
    slug: "https://github.com/kkn1125",
    icon: <BookIcon />,
  },
  {
    name: "wikimson",
    slug: "https://kkn1125.github.io/wikimson",
    icon: <MenuBookIcon />,
  },
  {
    name: "portfolio",
    slug: "https://kkn1125.github.io/portfolio",
    icon: <CategoryIcon />,
  },
];

export default function TemporaryDrawer({ storage, sx, children }) {
  const [state, setState] = useState(false);

  const toggleDrawer = (anchor, open) => (event) => {
    if (
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }

    setState(open);
  };

  const list = (anchor) => (
    <Box
      sx={{ width: 350 }}
      role='presentation'
      onClick={toggleDrawer(anchor, false)}
      onKeyDown={toggleDrawer(anchor, false)}>
      <Typography
        sx={{
          p: (theme) => theme.typography.pxToRem(15),
          fontSize: (theme) => theme.typography.pxToRem(18),
          fontWeight: "bold",
        }}>
        히든 메뉴입니다! 😎
      </Typography>
      <Typography
        sx={{
          px: (theme) => theme.typography.pxToRem(15),
          pb: (theme) => theme.typography.pxToRem(15),
          fontSize: (theme) => theme.typography.pxToRem(12),
          color: (theme) => theme.palette.text.main,
        }}>
        내가 선택한 포스팅 📚
      </Typography>
      <Divider />
      <List>
        {storage.map(({ slug, title }) => (
          <ListItem key={slug} disablePadding onClick={() => navigate(slug)}>
            <ListItemButton>
              {/* <ListItemIcon>
                {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
              </ListItemIcon> */}
              <ListItemText primary={title} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <Divider />
      <List>
        {authorInfo.map(({ name, slug, icon }) => (
          <ListItem
            key={slug}
            disablePadding
            onClick={() => open(slug, "_blank")}>
            <ListItemButton>
              <ListItemIcon>{icon}</ListItemIcon>
              <ListItemText primary={name.toUpperCase()} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <div>
      <Button sx={sx} onClick={toggleDrawer("right", true)}>
        {children}
      </Button>
      <Drawer
        anchor={"right"}
        open={state}
        onClose={toggleDrawer("right", false)}>
        {list("right")}
      </Drawer>
    </div>
  );
}
