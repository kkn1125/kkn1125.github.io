import React, { useCallback, useEffect, useState } from "react";
import { Box, Container, useTheme } from "@mui/material";
import HideAppBar from "../organisms/navigation/HideAppBar";
import Christmas from "../organisms/special/Christmas";
// tsconfig에 global.d.ts 내용을 include해야 ts, tsx외의 파일을 TypeScript에서 인식할 수 있게 된다.
// ref : https://stackoverflow.com/questions/40382842/cant-import-css-scss-modules-typescript-says-cannot-find-module

const Layout = ({ children }) => {
  const theme = useTheme();

  return (
    <>
      <HideAppBar />
      <Container maxWidth="xl">
        <Box component='main' my={10}>
          {children}
        </Box>
        <Christmas />
      </Container>
    </>
  );
};

export default Layout;
