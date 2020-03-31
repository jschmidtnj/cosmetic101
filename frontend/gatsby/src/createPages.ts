import path from "path";

interface CreatePagesArgs {
  graphql: any;
  actions: any;
}

interface NodeType {
  id: string;
  uid: string;
}

export default async (args: CreatePagesArgs) => {
  const { createPage } = args.actions;

  // Query all Pages with their IDs and template data.
  const pages = await args.graphql(`
    {
      allPrismicBlogPost {
        nodes {
          id
          uid
        }
      }
    }
  `);

  const blogPostTemplate = path.resolve("./src/templates/blog.tsx");
  // Create pages for each Page in Prismic using the selected template.
  pages.data.allPrismicBlogPost.nodes.forEach((node: NodeType) => {
    createPage({
      path: `/blog/${node.uid}`,
      component: blogPostTemplate,
      context: {
        id: node.id,
      },
    });
  });
};
