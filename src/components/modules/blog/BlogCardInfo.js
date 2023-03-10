import { Avatar, Divider, Stack, Typography } from "@mui/material";
import { Link } from "gatsby";
import React from "react";

function BlogCardInfo({ data, noavatar }) {
  return (
    <Stack direction='row' alignItems='center'>
      {!noavatar && (
        <Avatar
          alt='avatar'
          src='https://avatars.githubusercontent.com/u/71887242?v=4'
          sx={{
            width: 32,
            height: 32,
            mr: 1,
          }}
        />
      )}
      <Typography
        component='a'
        href='https://github.com/kkn1125/'
        target='_blank'
        color='text.primary'
        variant='caption'
        sx={{
          textDecoration: "none",
        }}>
        {data.author}
      </Typography>
      <Divider
        orientation='vertical'
        flexItem
        sx={{
          mx: 2,
          my: 0.9,
        }}
      />
      <Typography
        component='div'
        color='GrayText'
        sx={{
          fontSize: 12,
        }}>
        {data.date}
      </Typography>
    </Stack>
  );
}

export default BlogCardInfo;
