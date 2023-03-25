const path = require(`path`);
// Log out information after a build is done
exports.onPostBuild = ({ reporter }) => {
  reporter.info(`Your Gatsby site has been built!`);
};
// Create blog pages dynamically
exports.createPages = async ({ graphql, actions, ...props }) => {
  const { createPage } = actions;
  const blogListTemplate = path.resolve(`src/components/template/BlogPage.js`);
  const blogPostTemplate = path.resolve(`src/components/template/BlogPost.js`);
  const categoriesTemplate = path.resolve(
    `src/components/template/Categories.js`
  );
  const tagsTemplate = path.resolve(`src/components/template/Tags.js`);
  /* lives */
  const livesListTemplate = path.resolve(
    `src/components/template/LivesPage.js`
  );
  const livesPostTemplate = path.resolve(
    `src/components/template/LivesPost.js`
  );
  const livesCategoriesTemplate = path.resolve(
    `src/components/template/LivesCategories.js`
  );
  const livesTagsTemplate = path.resolve(
    `src/components/template/LivesTags.js`
  );

  const result = await graphql(`
    {
      blog: allMarkdownRemark(
        sort: { fields: [frontmatter___date], order: DESC }
        filter: {
          frontmatter: { layout: { eq: "post" }, published: { eq: true } }
        }
      ) {
        edges {
          node {
            frontmatter {
              title
              slug
            }
          }

          next {
            frontmatter {
              author
              categories
              tags
              title
              date(formatString: "YYYY-MM-DD HH:mm")
              slug
              modified(formatString: "YYYY-MM-DD HH:mm")
              published
            }
          }
          previous {
            frontmatter {
              author
              title
              tags
              slug
              date(formatString: "YYYY-MM-DD HH:mm")
              description
              modified(formatString: "YYYY-MM-DD HH:mm")
              published
              categories
            }
          }
        }
      }

      categories: allMarkdownRemark(
        sort: { fields: frontmatter___date, order: DESC }
        filter: {
          frontmatter: { layout: { eq: "post" }, published: { eq: true } }
        }
      ) {
        group(field: frontmatter___categories) {
          totalCount
          fieldValue
        }
      }

      tags: allMarkdownRemark(
        sort: { fields: frontmatter___date, order: DESC }
        filter: {
          frontmatter: { layout: { eq: "post" }, published: { eq: true } }
        }
      ) {
        group(field: frontmatter___tags) {
          totalCount
          fieldValue
        }
      }

      lives: allMarkdownRemark(
        sort: { fields: [frontmatter___date], order: DESC }
        filter: {
          frontmatter: { layout: { eq: "lives" }, published: { eq: true } }
        }
      ) {
        edges {
          node {
            frontmatter {
              title
              slug
            }
          }

          next {
            frontmatter {
              author
              categories
              tags
              title
              date(formatString: "YYYY-MM-DD HH:mm")
              slug
              modified(formatString: "YYYY-MM-DD HH:mm")
              published
            }
          }
          previous {
            frontmatter {
              author
              title
              tags
              slug
              date(formatString: "YYYY-MM-DD HH:mm")
              description
              modified(formatString: "YYYY-MM-DD HH:mm")
              published
              categories
            }
          }
        }
      }

      livesCategories: allMarkdownRemark(
        sort: { fields: frontmatter___date, order: DESC }
        filter: {
          frontmatter: { layout: { eq: "lives" }, published: { eq: true } }
        }
      ) {
        group(field: frontmatter___categories) {
          totalCount
          fieldValue
        }
      }

      livesTags: allMarkdownRemark(
        sort: { fields: frontmatter___date, order: DESC }
        filter: {
          frontmatter: { layout: { eq: "lives" }, published: { eq: true } }
        }
      ) {
        group(field: frontmatter___tags) {
          totalCount
          fieldValue
        }
      }
    }
  `);

  const blogCount = result.data.blog.edges.length;
  const perBlogPage = 10;
  const pageNum = Math.ceil(blogCount / perBlogPage);
  result.data.blog.edges.forEach((edge, i, o) => {
    if (Math.ceil(o.length / perBlogPage) >= i + 1) {
      createPage({
        path: i === 0 ? `/blog/` : `/blog/${i + 1}/`,
        component: blogListTemplate,
        context: {
          title: edge.node.frontmatter.title,
          limit: perBlogPage,
          skip: i * perBlogPage,
          pageNum,
          currentPage: i + 1,
        },
      });
    }
  });

  result.data.blog.edges.forEach((edge) => {
    // console.log(edge.node.frontmatter.slug)
    createPage({
      path: `${edge.node.frontmatter.slug}`,
      component: blogPostTemplate,
      context: {
        previous: edge.previous,
        next: edge.next,
      },
    });
  });
  result.data.categories.group.forEach((group) => {
    // console.log(group.fieldValue)
    createPage({
      path: `categories/${group.fieldValue}/`,
      component: categoriesTemplate,
      context: {
        count: group.totalCount,
        category: group.fieldValue,
      },
    });
  });
  result.data.tags.group.forEach((group) => {
    createPage({
      path: `tags/${group.fieldValue}/`,
      component: tagsTemplate,
      context: {
        count: group.totalCount,
        tag: group.fieldValue,
      },
    });
  });

  /* lives */
  const livesCount = result.data.lives.edges.length;
  const perLivesPage = 10;
  const livesPageNum = Math.ceil(livesCount / perLivesPage);
  result.data.lives.edges.forEach((edge, i, o) => {
    if (Math.ceil(o.length / perLivesPage) >= i + 1) {
      createPage({
        path: i === 0 ? `/lives/` : `/lives/${i + 1}/`,
        component: livesListTemplate,
        context: {
          title: edge.node.frontmatter.title,
          limit: perLivesPage,
          skip: i * perLivesPage,
          livesPageNum,
          currentPage: i + 1,
        },
      });
    }
  });

  result.data.lives.edges.forEach((edge) => {
    // console.log(edge.node.frontmatter.slug)
    createPage({
      path: `${edge.node.frontmatter.slug}`,
      component: livesPostTemplate,
      context: {
        previous: edge.previous,
        next: edge.next,
      },
    });
  });
  result.data.livesCategories.group.forEach((group) => {
    // console.log(group.fieldValue)
    createPage({
      path: `lives/categories/${group.fieldValue}/`,
      component: livesCategoriesTemplate,
      context: {
        count: group.totalCount,
        category: group.fieldValue,
      },
    });
  });
  result.data.livesTags.group.forEach((group) => {
    createPage({
      path: `lives/tags/${group.fieldValue}/`,
      component: livesTagsTemplate,
      context: {
        count: group.totalCount,
        tag: group.fieldValue,
      },
    });
  });
};

// https://stackoverflow.com/questions/57748844/how-do-i-use-multiple-createpage-routes-in-gatsby-node-js

// https://swas.io/blog/using-multiple-queries-on-gatsbyjs-createpages-node-api/
