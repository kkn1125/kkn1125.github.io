import { Chip, Stack, Tooltip, Typography } from "@mui/material";
import React from "react";
import PropTypes from "prop-types";
import TagIcon from "@mui/icons-material/Tag";
import FolderIcon from "@mui/icons-material/FolderOpenOutlined";
import { Link, navigate } from "gatsby";

function BlogCardHashList({ data, setOpen }) {
  const { categories, tags } = data;

  const handleClickForCategories = (e, slug) => {
    navigate("/categories/" + slug);
  };

  const handleClickForTags = (e, slug) => {
    navigate("/tags/" + slug);
  };

  return (
    <Stack>
      <Stack direction='row' justifyContent='space-between' gap={1}>
        <Stack direction='row' gap={0.5}>
          {categories?.map((category, id) => (
            <Chip
              key={"category" + category + id}
              color='info'
              label={category}
              variant='outlined'
              size='small'
              icon={<FolderIcon />}
              onClick={(e) => {
                handleClickForCategories(e, category);
                setOpen && setOpen(false);
              }}
              sx={{
                px: 0.5,
              }}
            />
          ))}
        </Stack>
        <Stack
          direction='row'
          justifyContent='flex-end'
          gap={0.5}
          sx={{ flexWrap: "wrap" }}>
          {tags?.slice(0, 3)?.map((tag, idx) => (
            <Chip
              key={"tag" + tag + idx}
              color='warning'
              label={tag}
              variant='outlined'
              size='small'
              icon={<TagIcon />}
              onClick={(e) => {
                handleClickForTags(e, tag);
                setOpen && setOpen(false);
              }}
              sx={{
                px: 0.5,
              }}
            />
          ))}
          {tags.length > 3 && (
            <Tooltip
              title={tags?.slice(3).map((tag) => (
                <Chip
                  key={tag}
                  size='small'
                  color='warning'
                  label={tag}
                  onClick={(e) => {
                    handleClickForTags(e, tag);
                    setOpen && setOpen(false);
                  }}
                />
              ))}>
              <Typography
                sx={{
                  color: (theme) => theme.palette.GrayText,
                  fontSize: (theme) => theme.typography.pxToRem(12),
                  lineHeight: (theme) => theme.typography.pxToRem(24),
                }}>
                +{tags.length - 3}
              </Typography>
            </Tooltip>
          )}
        </Stack>
      </Stack>
    </Stack>
  );
}

BlogCardHashList.propTypes = {
  data: PropTypes.object,
};

export default BlogCardHashList;
