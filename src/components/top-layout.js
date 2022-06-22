import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { responsiveFontSizes } from "@mui/material/styles";

import Viewport from "./viewport";
import Layout from "./layout/Layout";
import lightTheme from "../lightTheme";
import darkTheme from "../darkTheme";
import BlogProvider from "./core/BlogProvider";
import { graphql } from "gatsby";
import { readStorage, saveStorage } from "../util/tools";
import PickProvider from "./core/PickProvider";

export const ColorModeContext = createContext({ toggleColorMode: () => {} });

export default function TopLayout({ children }) {
  const [mode, setMode] = useState("light");
  const colorMode = useMemo(
    () => ({
      toggleColorMode: () => {
        setMode((prevMode) => (prevMode === "light" ? "dark" : "light"));
      },
    }),
    []
  );

  const getDesignTokens = (mode) => ({
    palette: {
      mode,
      ...(mode === "light" ? lightTheme : darkTheme),
    },
  });

  const theme = useMemo(() =>
    responsiveFontSizes(createTheme(getDesignTokens(mode)), [mode])
  );

  return (
    <>
      <Viewport />
      <PickProvider>
        <BlogProvider>
          <ColorModeContext.Provider value={colorMode}>
            <ThemeProvider theme={theme}>
              {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
              <CssBaseline />
              <Layout>{children}</Layout>
            </ThemeProvider>
          </ColorModeContext.Provider>
        </BlogProvider>
      </PickProvider>
    </>
  );
}

// https://github.com/hupe1980/gatsby-theme-material-ui/tree/master/packages/gatsby-theme-material-ui-top-layout/src/components
