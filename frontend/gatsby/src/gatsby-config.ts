import path from "path";

/* eslint @typescript-eslint/camelcase: 0 */
/* eslint @typescript-eslint/no-unused-vars: 0 */

export default {
  siteMetadata: {
    title: `Cosmetic 101`,
    description: `next-generation skin care`,
    author: `cosmetic101`,
  },
  plugins: [
    `gatsby-plugin-react-helmet`,
    // Add typescript stack into webpack
    `gatsby-plugin-typescript`,
    `gatsby-plugin-sass`,
    // You can have multiple instances of this plugin
    // to read source nodes from different locations on your
    // filesystem.
    {
      resolve: "gatsby-source-filesystem",
      options: {
        path: path.resolve(`./src/assets/images`),
        name: "images",
        ignore: [`**/.*`], // ignore files starting with a dot
      },
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `files`,
        path: path.resolve(`./src/files`),
        ignore: [`**/.*`], // ignore files starting with a dot
      },
    },
    "gatsby-transformer-sharp",
    "gatsby-plugin-sharp",
    {
      resolve: `gatsby-plugin-netlify`,
      options: {
        headers: {}, // option to add more headers. `Link` headers are transformed by the below criteria
        allPageHeaders: [], // option to add headers for all pages. `Link` headers are transformed by the below criteria
        mergeSecurityHeaders: true, // boolean to turn off the default security headers
        mergeLinkHeaders: true, // boolean to turn off the default gatsby js headers
        mergeCachingHeaders: true, // boolean to turn off the default caching headers
        generateMatchPathRewrites: false, // boolean to turn off automatic creation of redirect rules for client only paths
      },
    },
    {
      resolve: `gatsby-plugin-typography`,
      options: {
        pathToConfigModule: `./typography`,
      },
    },
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: `Cosmetic 101`,
        short_name: `cosmetic101`,
        start_url: `/`,
        background_color: `#ffffffc9`,
        theme_color: `#a2466c`,
        display: `standalone`,
        icon: `src/assets/images/icon.png`,
      },
    },
    `gatsby-plugin-offline`,
    {
      resolve: "gatsby-source-prismic",
      options: {
        repositoryName: process.env.GATSBY_PRISMIC_REPO_NAME,
        accessToken: process.env.GATSBY_PRISMIC_API_KEY,
        // See: https://prismic.io/docs/javascript/query-the-api/link-resolving
        linkResolver: ({ node, key, value }) => (doc) => {
          if (doc.type === "blog-post") return `/blog/${doc.uid}`;
          else return "/";
        },
        schemas: {
          // Your custom types mapped to schemas
          blog_post: require(path.resolve(
            `./src/prismic-schemas/blog-post.json`
          )),
        },
        // Set a default language when fetching documents. The default value is
        // '*' which will fetch all languages.
        // See: https://prismic.io/docs/javascript/query-the-api/query-by-language
        lang: "en-us",
        // Set a function to determine if images are downloaded locally and made
        // available for gatsby-transformer-sharp for use with gatsby-image.
        // The document node, field key (i.e. API IfD), and field value are
        // provided to the function, as seen below. This allows you to use
        // different logic for each field if necessary.
        // This defaults to always return false.
        shouldDownloadImage: ({ node, key, value }) => {
          // Return true to download the image or false to skip.
          return false;
        },
        // Set the prefix for the filename where type paths for your schemas are
        // stored. The filename will include the MD5 hash of your schemas after
        // the prefix.
        // This defaults to 'prismic-typepaths---${repositoryName}'.
        typePathsFilenamePrefix: "prismic-files",
      },
    },
    `gatsby-plugin-remove-trailing-slashes`,
    `gatsby-plugin-styled-components`,
  ],
};
