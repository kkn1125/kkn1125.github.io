import React from "react";

import TopLayout from "./components/top-layout";
import "../src/components/top-layout.css";

export default function wrapWithProvider({ element }) {
  return <TopLayout>{element}</TopLayout>;
}
