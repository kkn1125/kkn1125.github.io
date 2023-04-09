import { Avatar, Divider, Stack, Typography } from "@mui/material";
import { Link } from "gatsby";
import React from "react";

function BlogCardInfo({ data, noavatar }) {
  const updatedAt = new Date(data.modified?.replace("|", ""));
  const createdAt = new Date(data.date.replace("|", ""));
  const compare = updatedAt > createdAt;
  const isSame = data.modified === data.date;
  const isUpdated =
    !isSame &&
    updatedAt.getTime() <
      new Date(
        new Date().getFullYear(),
        new Date().getMonth(),
        new Date().getDate() + 1
      ).getTime();
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
      <Stack
        direction='row'
        gap={1}
        component='div'
        color='GrayText'
        sx={{
          fontSize: 12,
          [`& > *`]: {
            fontSize: "inherit !important",
          },
        }}>
        <Typography
          component='span'
          sx={{
            ...(isUpdated && { textDecorationLine: "line-through" }),
          }}>
          {data.date}
        </Typography>
        {isUpdated && (
          <>
            <Typography component='span'>⇒</Typography>
            <Typography component='span'>
              ✏️
              {data.modified}
            </Typography>
          </>
        )}
      </Stack>
    </Stack>
  );
}

export default BlogCardInfo;
