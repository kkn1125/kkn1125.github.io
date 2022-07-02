import {
  blue,
  deepOrange,
  green,
  grey,
  lightBlue,
  lightGreen,
  red,
} from "@mui/material/colors";

const lightTheme = {
  primary: {
    main: blue[500],
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
    main: "#ffffff",
  },
  text: {
    primary: "#000000",
    secondary: "#ffffff",
  },
  GrayText: '#b1b1b1',
  divider: grey[700],
  contrastThreshold: 3,
  tonalOffset: 0.2,
  background: {
    default: "#ffffff",
  },
};

export default lightTheme;
