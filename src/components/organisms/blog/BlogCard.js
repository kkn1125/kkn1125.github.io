import React, { useContext } from "react";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import {
  Box,
  CardActionArea,
  Paper,
  Stack,
  styled,
} from "@mui/material";
import {  navigate } from "gatsby";
import HashList from "../../modules/common/HashList";
import BlogCardInfo from "../../modules/blog/BlogCardInfo";
import BlogCardDesc from "../../modules/blog/BlogCardDesc";
import BlogCardTitle from "../../modules/blog/BlogCardTitle";
import Favorite from "../../modules/common/Favorite";

const PaperBlock = styled(Paper)(({ theme }) => ({
  borderRadius: 15,
  overflow: "hidden",
}));

function BlogCard({ data, height, main = false }) {
  return (
    <PaperBlock
      elevation={2}
      sx={{
        ...(main && {
          display: {
            xs: "block",
            md: "flex",
          },
        }),
        width: "100%",
        position: "relative",
      }}>
      <Favorite data={data} />
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
            objectFit: "cover",
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
            <BlogCardTitle title={data.title} slug={data.slug} />
            <BlogCardInfo data={data} />
            <BlogCardDesc desc={data.description} />
          </Box>
          <Stack direction='row' justifyContent='space-between' gap={1}>
            <HashList hash={data.categories} types='categories' />
            <HashList hash={data.tags} types='tags' />
          </Stack>
        </Stack>
      </CardContent>
    </PaperBlock>
  );
}

export default BlogCard;
