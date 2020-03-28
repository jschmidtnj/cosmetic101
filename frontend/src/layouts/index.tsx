import React from "react";
import PropTypes from "prop-types";
import Loadable from "@loadable/component";
// import { useStaticQuery, graphql } from "gatsby";

// import Header from "../components/header";
import "./index.scss";

const Fonts = Loadable(() => import("../components/fontloader"))

interface LayoutArgs {
  children: any;
}

interface IndexLayoutProps {
  site: {
    siteMetadata: {
      title: string;
    };
  };
}

const Layout = (args: LayoutArgs) => {
  /*
  const data: IndexLayoutProps = useStaticQuery(graphql`
    query SiteTitleQuery {
      site {
        siteMetadata {
          title
        }
      }
    }
  `);
  */

  return (
    <>
      {/*<Header siteTitle={data.site.siteMetadata.title} />*/}
      <Fonts />
      <div
        style={{
          margin: 0,
          padding: 0,
        }}
      >
        <main>{args.children}</main>
        {/*<footer>© {new Date().getFullYear()}, Cosmetic101</footer>*/}
      </div>
    </>
  );
};

Layout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default Layout;
