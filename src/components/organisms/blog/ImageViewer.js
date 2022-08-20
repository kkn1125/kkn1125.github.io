import { Box, Button, CardActionArea, CardMedia, Stack } from "@mui/material";
import React from "react";

function ImageViewer({ image }) {
  return (
    <Box
      sx={{
        width: "100vw",
        height: "100vh",
        backgroundColor: "#000000a5",
        position: "fixed",
        top: 0,
        left: 0,
        zIndex: 2000,
      }}>
      <Stack direction='row' justifyContent='flex-end'>
        <Button
          color='error'
          variant='contained'
          sx={{
            mt: 2,
            mr: {
              xs: 2,
              md: 4,
            },
          }}>
          &times;
        </Button>
      </Stack>
      <Box
        component={Stack}
        direction='row'
        justifyContent='center'
        align='center'
        sx={{
          maxWidth: "90%",
          height: "80%",
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
        }}>
        <Box
          sx={{
            overflow: "auto",
            height: "fit-content",
            maxHeight: "100%",
          }}>
          <CardMedia
            component='img'
            image={image}
            alt='cover'
            sx={{
              objectFit: "cover",
              width: "auto",
              height: "auto",
            }}
          />
        </Box>
      </Box>
    </Box>
  );
}

export default ImageViewer;
