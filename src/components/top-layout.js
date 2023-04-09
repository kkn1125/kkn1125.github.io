import React, { createContext, useEffect, useMemo, useState } from "react";
import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider, createTheme, css } from "@mui/material/styles";
import { responsiveFontSizes } from "@mui/material/styles";

import Viewport from "./viewport";
import Layout from "./template/Layout";
import lightTheme from "../lightTheme";
import darkTheme from "../darkTheme";
import BlogProvider from "../context/BlogProvider";
import PickProvider from "../context/PickProvider";
import { API_BASE_PATH, API_PATH } from "../util/globals";
import { Modal } from "./organisms/dev/Modal";
import axios from "axios";
import { ApiProvider } from "../hooks/apiHooks";
import { GlobalStyles } from "@mui/material";

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
    // const res = await axios.post(
    //   API_PATH + API_BASE_PATH + "/users/initialize"
    // );
    // try {
    //   const json = await res.json();
    //   console.log("json", json);
    //   if (json?.ok) {
    //     if (!localStorage.getItem("users")) {
    //       localStorage.setItem("users", JSON.stringify({}));
    //     }
    //     const userStorage = JSON.parse(localStorage.getItem("users"));
    //     // const { token, ip, hash, expiredIn } = json.payload;
    //     Object.assign(userStorage, json.payload);
    //     localStorage.setItem("users", JSON.stringify(userStorage));
    //   }
    // } catch (error) {
    //   console.log(error);
    //   const text = await res.text();
    //   console.log("text", text);
    // }
  }
  // initializeUser();
  // console.log("[TEST]", "반복 실행되는가");

  return (
    <>
      <GlobalStyles
        styles={(theme) => css`
          ::selection {
            color: inherit;
            background: ${theme.palette.secondary.dark}56;
          }
          .blog-post a[href] {
            color: ${theme.palette.success.dark};
            font-weight: 700;
            text-decoration-line: underline !important;
          }

          .blog-post strong {
            text-emphasis: filled red;
          }

          ::-webkit-scrollbar {
            width: 8px;
            background-color: #373C0056;
          }
          ::-webkit-scrollbar-thumb {
            width: 8px;
            ${
              "" /* border-left: 3px solid #8a8a7e;
            border-right: 3px solid #8a8a7e; */
            }
            background-color: #373C00;
            ${"" /* border-radius: 5px; */}
          }

          ${
            "" /* .blog-post strong::after {
            content: "　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　";
            overflow: hidden;
            position: absolute;
            top: 5px;
            left: 0;
            right: 0;
            bottom: 0;
            display: inline-block;
            width: inherit;
            text-decoration-line: underline;
            text-decoration-style: wavy;
            text-decoration-thickness: from-font;
            text-decoration-color: black;
            color: transparent;
            font-size: 2rem;
          } */
          }
        `}
      />
      <Viewport />
      <ApiProvider>
        <PickProvider>
          <BlogProvider>
            <ColorModeContext.Provider value={colorMode}>
              <ThemeProvider theme={theme}>
                {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
                <CssBaseline />
                <Layout>{children}</Layout>
                <Modal />
              </ThemeProvider>
            </ColorModeContext.Provider>
          </BlogProvider>
        </PickProvider>
      </ApiProvider>
    </>
  );
}

export { ColorModeContext };

// https://github.com/hupe1980/gatsby-theme-material-ui/tree/master/packages/gatsby-theme-material-ui-top-layout/src/components
