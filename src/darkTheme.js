import {
  deepOrange,
  green,
  grey,
  lightBlue,
  lightGreen,
  red,
} from "@mui/material/colors";

const darkTheme = {
  primary: {
    main: deepOrange[500],
  },
  secondary: {
    main: lightGreen[500],
  },
  info: {
    main: lightBlue[500],
  },
  success: {
    main: green[500],
  },
  danger: {
    main: red[500],
  },
  warning: {
    main: deepOrange[500],
  },
  white: {
    main: "#fff",
  },
  text: {
    primary: "#fff",
    secondary: grey[500],
  },
  GrayText: "#b1b1b1",
  divider: deepOrange[700],
  contrastThreshold: 3,
  tonalOffset: 0.2,
  background: {
    default: grey[900],
  },
};

export default darkTheme;
