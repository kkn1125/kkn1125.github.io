import { Box, Paper, Stack, styled, useTheme } from "@mui/material";
import CardContent from "@mui/material/CardContent";
import { navigate } from "gatsby";
import React, { memo } from "react";
import BlogCardDesc from "../../modules/blog/BlogCardDesc";
import BlogCardInfo from "../../modules/blog/BlogCardInfo";
import BlogCardTitle from "../../modules/blog/BlogCardTitle";
import Favorite from "../../modules/common/Favorite";
import HashList from "../../modules/common/HashList";

const PaperBlock = styled(Paper)(({ theme }) => ({
  borderRadius: 15,
  overflow: "hidden",
}));

function BlogCard({ data, height, main = false }) {
  const theme = useTheme();
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

      <Box
        component='div'
        onClick={(e) => navigate(data.slug)}
        // src={}
        // alt='cover'
        sx={{
          width: "100%",
          maxWidth: 700,
          overflow: "hidden",
          backgroundColor: "#fff",
          cursor: "pointer",
          [`&:hover::before`]: {
            transform: "scale(1.1)",
            // backgroundSize: "contain",
          },
          [`&::before`]: {
            display: "inline-block",
            content: '""',
            height: height,
            width: "100%",
            objectFit: "cover",
            transition: "100ms ease-in-out",
            backgroundImage: `url(${data.image.replace(/assets/g, "")})`,
            backgroundSize: "cover",
            backgroundRepeat: "no-repeat",
            backgroundPosition: "center center",
          },
        }}
      />
      <CardContent
        sx={{
          p: {
            md: 5,
            xs: 2,
          },
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

export default memo(BlogCard);
