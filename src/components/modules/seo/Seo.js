import React from "react";
import { Helmet } from "react-helmet";
import { BlogFormat } from "../../../util/formatter";

function Seo({ frontmatter }) {
  const form = BlogFormat(frontmatter);
  const isOne =
    frontmatter.title !== undefined && Object.keys(frontmatter).length === 1;
  const ogs = !isOne
    ? Object.entries(form).map(([k, v], i) =>
        k === "category" || k === "tags" ? (
          v.map((item, idx) => (
            <meta key={idx + item} property={"og:" + k} content={item} />
          ))
        ) : k === "title" ? (
          <meta key={i} property={"og:" + k} content={"devkimson :: " + v} />
        ) : (
          <meta key={i} property={"og:" + k} content={v} />
        )
      )
    : [];
  const ogs2 = !isOne
    ? Object.entries(form).map(([k, v], i) =>
        k === "category" || k === "tags" ? (
          v.map((item, idx) => (
            <meta key={idx + item} property={k} content={item} />
          ))
        ) : k === "title" ? (
          <meta key={i} property={k} content={"devkimson :: " + v} />
        ) : (
          <meta key={i} property={k} content={v} />
        )
      )
    : [];

  return (
    <Helmet>
      {!isOne && ogs.flat(2)}
      {!isOne && ogs2.flat(2)}
      <title>
        {"DEVKIMSON" + (frontmatter.title && " :: " + frontmatter.title)}
      </title>
    </Helmet>
  );
}

export default Seo;
