import { Chip, Stack } from "@mui/material";
import React from "react";
import PropTypes from "prop-types";
import TagIcon from "@mui/icons-material/Tag";
import FolderIcon from "@mui/icons-material/FolderOpenOutlined";
import { navigate } from "gatsby";

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
      <Stack direction='row' justifyContent='space-between'>
        <Stack direction='row' gap={1}>
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
        <Stack direction='row' gap={1}>
          {tags?.map((tag, idx) => (
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
        </Stack>
      </Stack>
    </Stack>
  );
}

BlogCardHashList.propTypes = {
  data: PropTypes.object,
};

export default BlogCardHashList;
