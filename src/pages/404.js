import * as React from "react";
import { Link } from "gatsby";
import { Helmet } from "react-helmet";
import {
  Button,
  Card,
  CardActions,
  CardContent,
  Container,
  Typography,
} from "@mui/material";

// markup
const NotFoundPage = () => {
  return (
    <Container>
      <Card
        sx={{
          p: 10,
        }}>
        <CardContent>
          <Typography gutterBottom className='font-main' variant='h3'>
            Page not found
          </Typography>
          <Typography gutterBottom aria-label='Pensive emoji'>
            요청하신 페이지를 찾지 못 했어요 😔
            {process.env.NODE_ENV === "development" ? (
              <Typography variant='body2' color='GrayText'>
                <br />
                <code>src/pages/</code>에서 페이지를 만들어보세요!
                <br />
              </Typography>
            ) : null}
          </Typography>
        </CardContent>
        <CardActions>
          <Button component={Link} to='/'>
            Go home
          </Button>
        </CardActions>
      </Card>
    </Container>
  );
};

export default NotFoundPage;
