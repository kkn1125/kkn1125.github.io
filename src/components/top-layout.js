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
import { API_BASE_PATH, API_PATH } from "../util/globals";

const ColorModeContext = createContext({ toggleColorMode: () => {} });

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

  async function initializeUser() {
    // console.log(API_PATH);
    const res = await fetch(API_PATH + API_BASE_PATH + "/users/initialize", {
      method: "post",
    });
    try {
      const json = await res.json();
      console.log("json", json);
      if (json?.ok) {
        if (!localStorage.getItem("users")) {
          localStorage.setItem("users", JSON.stringify({}));
        }
        const userStorage = JSON.parse(localStorage.getItem("users"));
        // const { token, ip, hash, expiredIn } = json.payload;
        Object.assign(userStorage, json.payload);
        localStorage.setItem("users", JSON.stringify(userStorage));
      }
    } catch (error) {
      console.log(error);
      const text = await res.text();
      console.log("text", text);
    }
  }
  initializeUser();
  console.log("[TEST]", "반복 실행되는가");

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

export { ColorModeContext };

// https://github.com/hupe1980/gatsby-theme-material-ui/tree/master/packages/gatsby-theme-material-ui-top-layout/src/components
