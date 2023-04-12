import { IconButton, keyframes, useMediaQuery } from "@mui/material";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import React, { MouseEvent, useState } from "react";
import OpenAI from "./OpenAI";
import TryIcon from "@mui/icons-material/Try";

export function Modal() {
  const [anchorEl, setAnchorEl] = useState(null);
  const changeColorAnimation = keyframes`
    0% {
      ${
        "" /* background: linear-gradient(to right, red 0%, yellow 50%, red); */
      }
      background-position: 0px 0px;
    }
    100% {
      ${
        "" /* background: linear-gradient(to right, yellow 0%, red 50%, yellow); */
      }
      background-position: 144px 0px;
    }
  `;
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
            right: 20,
            color: "#ffffff",
            userSelect: "initial",
            pointerEvents: "initial",
            background: (theme) =>
              `linear-gradient(90deg, ${theme.palette.error.light} 0%, ${theme.palette.error.dark} 50%, ${theme.palette.error.light})`,
            animation: `${changeColorAnimation} 8000ms linear infinite`,
            ["&:hover"]: {
              background: (theme) => theme.palette.info.dark,
            },
          }}>
          <TryIcon />
        </IconButton>
      )}
      <OpenAI open={open} onClose={handleClose} />
    </div>
  );
}
