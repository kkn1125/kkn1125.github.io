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
          <FavoriteIcon color='danger' />
        ) : (
          <FavoriteBorderIcon color='danger' />
        )}
      </IconButton>
    </Tooltip>
  );
}

export default memo(Favorite);
