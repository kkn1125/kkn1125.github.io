import { Container, Typography } from "@mui/material";
import { Link } from "gatsby";
import React from "react";

function About() {
  return (
    <Container>
      <Typography variant='h3'>About</Typography>
      <Typography variant='body1'>
        Gatsby로 만든 블로그입니다. 2일동안 mui로 개발해서 많이 조잡하고, 블로그
        이전 작업이 아직 미비하므로 양해바랍니다 🙇‍♂️
      </Typography>
      <a href='https://github.com/kkn1125' taget='_blank'>
        Github
      </a>
    </Container>
  );
}

export default About;
