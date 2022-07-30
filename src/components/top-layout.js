import React, { createContext, useEffect, useMemo, useState } from "react";
import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { responsiveFontSizes } from "@mui/material/styles";

import Viewport from "./viewport";
import Layout from "./template/Layout";
import lightTheme from "../lightTheme";
import darkTheme from "../darkTheme";
import BlogProvider from "../context/BlogProvider";
import PickProvider from "../context/PickProvider";
import Google050e6145d059bcf0 from "../pages/google050e6145d059bcf0";
import Naverab361a1a39575334bea9d573640c9e21 from "../pages/naverab361a1a39575334bea9d573640c9e21";

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

  useEffect(() => {
    if (location.pathname.match("google050e6145d059bcf0")) {
      return <Google050e6145d059bcf0 />;
    }

    if (location.pathname.match("naverab361a1a39575334bea9d573640c9e21")) {
      return <Naverab361a1a39575334bea9d573640c9e21 />;
    }
  }, []);

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
