import React, { useContext, useEffect } from "react";
import { Helmet } from "react-helmet";
import { BlogInfoContext } from "./core/blogInfoContext";

export default function Viewport({ children }) {
  const context = useContext(BlogInfoContext);
  return (
    <Helmet>
      {/* To ensure proper rendering and touch zooming for all devices, add the responsive viewport meta tag to your <head> element. */}
      <meta property='og:type' content='website' />
      <meta property='og:url' content='https://kkn1125.github.io' />
      <meta name='viewport' content='initial-scale=1, width=device-width' />
      {children}
    </Helmet>
  );
}
