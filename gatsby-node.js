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
  const result = await graphql(`
    {
      blog: allMarkdownRemark(
        sort: { fields: [frontmatter___date], order: DESC }
        filter: { frontmatter: { published: { eq: true } } }
      ) {
        edges {
          node {
            frontmatter {
              title
              slug
            }
          }
        }
      }

      categories: allMarkdownRemark(
        sort: { fields: frontmatter___date, order: DESC }
        filter: { frontmatter: { published: { eq: true } } }
      ) {
        group(field: frontmatter___categories) {
          totalCount
          fieldValue
        }
      }

      tags: allMarkdownRemark(
        sort: { fields: frontmatter___date, order: DESC }
        filter: { frontmatter: { published: { eq: true } } }
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
  result.data.blog.edges.forEach((edge, i) => {
    createPage({
      path: i === 0 ? `/blog` : `/blog/${i + 1}`,
      component: blogListTemplate,
      context: {
        title: edge.node.frontmatter.title,
        limit: perBlogPage,
        skip: i * perBlogPage,
        pageNum,
        currentPage: i + 1,
      },
    });
  });

  result.data.blog.edges.forEach((edge) => {
    createPage({
      path: `${edge.node.frontmatter.slug}`,
      component: blogPostTemplate,
      context: {
        title: edge.node.frontmatter.title,
      },
    });
  });
  result.data.categories.group.forEach((group) => {
    createPage({
      path: `categories/${group.fieldValue}`,
      component: categoriesTemplate,
      context: {
        count: group.totalCount,
        category: group.fieldValue,
      },
    });
  });
  result.data.tags.group.forEach((group) => {
    createPage({
      path: `tags/${group.fieldValue}`,
      component: tagsTemplate,
      context: {
        count: group.totalCount,
        tag: group.fieldValue,
      },
    });
  });
};

// https://stackoverflow.com/questions/57748844/how-do-i-use-multiple-createpage-routes-in-gatsby-node-js

// https://swas.io/blog/using-multiple-queries-on-gatsbyjs-createpages-node-api/
