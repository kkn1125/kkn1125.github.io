import { IconButton, useMediaQuery } from "@mui/material";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import React, { MouseEvent, useState } from "react";
import OpenAI from "./OpenAI";
import TryIcon from "@mui/icons-material/Try";

export function Modal() {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div>
      {!open && (
        <IconButton
          color='inherit'
          id='basic-button'
          aria-controls={open ? "basic-menu" : undefined}
          aria-haspopup='true'
          aria-expanded={open ? "true" : undefined}
          onClick={handleClick}
          size='large'
          sx={{
            position: "fixed",
            bottom: (theme) =>
              useMediaQuery(theme.breakpoints.down("md")) ? 75 : 75,
            right: 16,
            color: "#ffffff",
            userSelect: "initial",
            pointerEvents: "initial",
            backgroundColor: (theme) => theme.palette.primary.light,
            ["&:hover"]: {
              backgroundColor: (theme) => theme.palette.primary.dark,
            },
          }}>
          <TryIcon />
        </IconButton>
      )}
      <OpenAI open={open} onClose={handleClose} />
    </div>
  );
}
