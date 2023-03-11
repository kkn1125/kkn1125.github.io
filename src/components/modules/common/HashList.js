import { Chip, Stack, Tooltip, Typography } from "@mui/material";
import React from "react";
import TagIcon from "@mui/icons-material/Tag";
import FolderIcon from "@mui/icons-material/FolderOpenOutlined";
import { Link, navigate } from "gatsby";

function HashList({ hash, types }) {
  const handleClickForHash = (e, slug) => {
    navigate(`/${types}/` + slug + "/");
  };

  return (
    <Stack
      direction='row'
      justifyContent='flex-end'
      gap={0.5}
      sx={{ flexWrap: "wrap" }}>
      {hash?.slice(0, 3)?.map((type, idx) => (
        <Chip
          key={"type" + type + idx}
          color={types === "categories" ? "secondary" : "info"}
          label={type}
          variant='outlined'
          size='small'
          icon={types === "categories" ? <FolderIcon /> : <TagIcon />}
          onClick={(e) => {
            handleClickForHash(e, type);
          }}
          sx={{
            px: 0.5,
          }}
        />
      ))}
      {hash.length > 3 && (
        <Tooltip
          title={hash?.slice(3).map((type) => (
            <Chip
              key={type}
              size='small'
              color={types === "categories" ? "secondary" : "info"}
              label={type}
              onClick={(e) => {
                handleClickForHash(e, type);
              }}
            />
          ))}
          PopperProps={{
            sx: {
              [`& .MuiTooltip-tooltip.MuiTooltip-tooltipPlacementBottom`]: {
                display: "flex",
                gap: "0.5rem",
                py: "0.7rem",
                px: "1rem",
              },
            },
          }}>
          <Typography
            sx={{
              color: (theme) => theme.palette.GrayText,
              fontSize: (theme) => theme.typography.pxToRem(12),
              lineHeight: (theme) => theme.typography.pxToRem(24),
            }}>
            +{hash.length - 3}
          </Typography>
        </Tooltip>
      )}
    </Stack>
  );
}

export default HashList;
