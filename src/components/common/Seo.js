import React from "react";
import { Helmet } from "react-helmet";
import { BlogFormat } from "../../util/formatter";

function Seo({ frontmatter }) {
  let title;
  const form = BlogFormat(frontmatter);

  const ogs = Object.entries(form).map(([k, v], i) =>
    k === "category" || k === "tags" ? (
      v.map((item, idx) => (
        <meta key={idx + item} property={"og:" + k} content={item} />
      ))
    ) : k === "title" ? (
      <meta key={i} property={"og:" + k} content={"devkimson :: " + v} />
    ) : (
      <meta key={i} property={"og:" + k} content={v} />
    )
  );
  return (
    <Helmet>
      {ogs.flat(2)}
      <title>{"DEVKIMSON :: " + frontmatter.title}</title>
    </Helmet>
  );
}

export default Seo;
