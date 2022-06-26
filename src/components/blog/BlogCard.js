import React, { useContext } from "react";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import {
  Box,
  CardActionArea,
  IconButton,
  Paper,
  Stack,
  styled,
  Tooltip,
} from "@mui/material";
import BlogCardInfo from "./BlogCardInfo";
import BlogCardHashList from "./BlogCardHashList";
import { Link, navigate } from "gatsby";
import { cutText } from "../../util/tools";
import { PickContext } from "../core/pickContext";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";

const PaperBlock = styled(Paper)(({ theme }) => ({
  borderRadius: 15,
  overflow: "hidden",
}));

function BlogCard({ data, height, main = false }) {
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
      <Tooltip title='Favorites!' placement='top'>
        <IconButton
          onClick={(e) => handleClick(e, data)}
          sx={{
            position: "absolute",
            top: (theme) => theme.typography.pxToRem(20),
            right: (theme) => theme.typography.pxToRem(20),
            zIndex: 5,
          }}>
          {pick.find(data) ? (
            <FavoriteIcon color='danger' />
          ) : (
            <FavoriteBorderIcon color='danger' />
          )}
        </IconButton>
      </Tooltip>
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
            objectFit: 'cover',
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
              {cutText(data.description, 80)}
            </Typography>
          </Box>
          <Box>
            <BlogCardHashList data={data} />
          </Box>
        </Stack>
      </CardContent>
    </PaperBlock>
  );
}

export default BlogCard;
