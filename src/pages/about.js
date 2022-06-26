import {
  Alert,
  Button,
  Container,
  Divider,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Typography,
} from "@mui/material";
import GitHubIcon from "@mui/icons-material/GitHub";
import InventoryIcon from "@mui/icons-material/Inventory";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import { Link } from "gatsby";
import React from "react";

const rows = [
  {
    icon: <GitHubIcon fontSize='small' />,
    name: "Github",
    url: "https://github.com/kkn1125",
    target: "_blank",
  },
  {
    icon: <InventoryIcon fontSize='small' />,
    name: "Portfolio",
    url: "https://kkn1125.github.io/portfolio",
    target: "_blank",
  },
  {
    icon: <MenuBookIcon fontSize='small' />,
    name: "Wiki",
    url: "https://kkn1125.github.io/wikimson",
    target: "_blank",
  },
];

function About() {
  return (
    <>
      <Typography variant='h3' gutterBottom className='font-main'>
        About
      </Typography>
      <Divider
        sx={{
          mt: 2,
          mb: 5,
        }}
      />
      <Alert severity='success' sx={{ mb: 3 }}>
        현재 2022-06-26 기준으로 MUI + React + gatsby 환경 구축해서 기존에
        jekyll 기반이던 블로그를 변경 및 이식이 완료된 상태입니다.
      </Alert>
      <Typography variant='body1'>
        Gatsby로 만든 블로그입니다.
        <del>
          2일동안 mui로 개발해서 많이 조잡하고, 블로그 이전 작업이 아직
          미비하므로 양해바랍니다 🙇‍♂️
        </del>
      </Typography>
      <Typography variant='body1'>
        계속해서 블로그를 관리하면서 보기 불편한 점 등을 찾아 개선하는 노력을
        기울이고 있습니다 😊
      </Typography>
      <TableContainer component={Paper} sx={{ my: 3 }}>
        <Table size='small' aria-label='a dense table'>
          <TableBody>
            {rows.map(({ icon, name, url, target }) => (
              <TableRow
                key={name}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
                <TableCell component='th' scope='row'>
                  <Stack direction='row' alignItems='center' gap={1}>
                    {icon}
                    {name}
                  </Stack>
                </TableCell>
                <TableCell
                  align='right'
                  sx={{
                    "& a": {
                      color: (theme) => theme.palette.primary.main,
                      textDecoration: "none",
                    },
                  }}>
                  <a href={url} target={target}>
                    {url}
                  </a>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Button component={Link} to='/' color='info' variant='contained'>
        Home
      </Button>
    </>
  );
}

export default About;
