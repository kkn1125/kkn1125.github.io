import { IconButton, Tooltip } from "@mui/material";
import React, { memo, useContext } from "react";

import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import { PickContext } from "../../../context/pickContext";

function Favorite({ data, fixed = true }) {
  const pick = useContext(PickContext);
  const handleClick = (e, data) => {
    e.preventDefault();
    if (pick.find(data)) {
      pick.deletes(data.slug);
    } else {
      pick.add(data);
    }
    pick.save();
    pick.read();
  };
  const vibrateAnimation = {
    animation: `vibrate 1000ms ease-in-out infinite`,
    "@keyframes vibrate": {
      "0%": { transform: "rotate(0deg)" },
      "5%": { transform: "rotate(10deg)" },
      "10%": { transform: "rotate(20deg)" },
      "15%": { transform: "rotate(10deg)" },
      "20%": { transform: "rotate(-20deg)" },
      "25%": { transform: "rotate(-10deg)" },
      "30%": { transform: "rotate(0deg)" },
      "100%": { transform: "rotate(0deg)" },
    },
  };

  return (
    <Tooltip title='Favorites!' placement='top'>
      <IconButton
        onClick={(e) => handleClick(e, data)}
        sx={{
          ...(fixed && {
            position: "absolute",
            top: (theme) => theme.typography.pxToRem(20),
            right: (theme) => theme.typography.pxToRem(20),
            zIndex: 5,
          }),
        }}>
        {pick.find(data) ? (
          <FavoriteIcon
            color='danger'
            sx={{
              ...vibrateAnimation,
            }}
          />
        ) : (
          <FavoriteBorderIcon
            color='danger'
            sx={{
              ...vibrateAnimation,
            }}
          />
        )}
      </IconButton>
    </Tooltip>
  );
}

export default memo(Favorite);
