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
    url: "https://github.com/kkn1125/",
    target: "_blank",
  },
  {
    icon: <InventoryIcon fontSize='small' />,
    name: "Portfolio",
    url: "https://kkn1125.github.io/portfolio/",
    target: "_blank",
  },
  {
    icon: <MenuBookIcon fontSize='small' />,
    name: "Wiki",
    url: "https://kkn1125.github.io/wikimson/",
    target: "_blank",
  },
];

function About() {
    return (
    <Container maxWidth="md">
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
        2023-03-11 일자 기준으로 점검된 개인 블로그 입니다. 버그나 포스팅 중 잘못된 사항이 있다면 언제든지 이슈로 알려주시면 감사하겠습니다.
      </Alert>
      <Typography variant='body1'>
        Gatsby로 만든 블로그입니다.
        회사 일정과 개인 일정으로 인해 블로그 포스팅이 이전과 달리 현저하게 줄어들었습니다. 최대한 일주일 1포스팅을 지키려 하고 있습니다.
        계속해서 블로그를 관리하면서 보기 불편한 점 등을 찾아 개선하는 노력을
        기울이고 있습니다. 감사합니다 😊
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
    </Container>
  );
}

export default About;
