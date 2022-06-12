import React from "react";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import { Box, CardActionArea, Stack } from "@mui/material";
import BlogCardInfo from "../common/BlogCardInfo";
import BlogCardHashList from "./BlogCardHashList";
import { Link, navigate } from "gatsby";
import { cutText } from "../../util/tools";

function BlogCard({ data, height }) {
  return (
    <>
      <CardActionArea
        onClick={(e) => navigate(data.slug)}
        sx={{
          height: height,
          minHeight: 300,
        }}>
        <CardMedia
          component='img'
          image={data.image.replace(/assets/g, "")}
          alt='cover'
          sx={{
            height: height,
            minHeight: 300,
            backgroundColor: "#fff",
          }}
        />
      </CardActionArea>
      <CardContent
        sx={{
          p: 5,
          width: "100%",
        }}>
        <Stack
          justifyContent='space-between'
          sx={{
            height: "100%",
          }}>
          <Box>
            <Typography
              gutterBottom
              variant='h4'
              component='div'
              sx={{
                "& a": {
                  color: (theme) => theme.palette.text.primary,
                  textDecoration: "none",
                },
              }}>
              <Link to={data.slug}>{data.title}</Link>
            </Typography>
            <BlogCardInfo data={data} />
            <Typography
              variant='body2'
              color='text'
              sx={{
                my: 5,
              }}>
              {cutText(data.description, 150)}
            </Typography>
          </Box>
          <Box>
            <BlogCardHashList data={data} />
          </Box>
        </Stack>
      </CardContent>
    </>
  );
}

export default BlogCard;
