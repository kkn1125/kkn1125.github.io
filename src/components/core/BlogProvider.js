import React, { useReducer } from "react";
import { BlogInfoContext } from "./blogInfoContext";

const defaultBlogInfo = {
  title: null,
  description: null,
  author: null,
  categorie: null,
  tags: null,
  image: null,
  published_time: null,
};

const blogInfoReducer = function (state, action) {
  switch (action.type) {
    case "UPDATE":
      return {
        ...state,
        ...action.data,
      };
  }
};

function BlogProvider({ children }) {
  const [blogState, dispatch] = useReducer(blogInfoReducer, defaultBlogInfo);

  const update = (info) => {
    dispatch({ type: "UPDATE", data: info });
  };

  const blogInfoContext = {
    title: blogState.title,
    description: blogState.description,
    author: blogState.author,
    categories: blogState.categorie,
    tags: blogState.tags,
    image: blogState.image,
    published_time: blogState.published_time,
    update: update,
  };

  return (
    <BlogInfoContext.Provider value={blogInfoContext}>
      {children}
    </BlogInfoContext.Provider>
  );
}

export default BlogProvider;

{
  /* <meta property="og:title" content="devkimson blog" />
      <meta property="og:description" content="devkimson blog" />
      <meta property="og:image" content="/images/logo-k-color.png" /> */
}
