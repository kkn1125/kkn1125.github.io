import { Avatar, Divider, Stack, Typography } from "@mui/material";
import React from "react";

function BlogCardInfo({ data, noavatar }) {
  return (
    <Stack direction='row' alignItems='center'>
      {!noavatar && (
        <Avatar
          alt='Cindy Baker'
          src='https://avatars.githubusercontent.com/u/71887242?v=4'
          sx={{
            width: 32,
            height: 32,
            mr: 1,
          }}
        />
      )}
      <Typography component='div' color='GrayText' variant='caption'>
        {data.author}
      </Typography>
      <Divider
        orientation='vertical'
        flexItem
        sx={{
          mx: 2,
          my: 0.5,
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
