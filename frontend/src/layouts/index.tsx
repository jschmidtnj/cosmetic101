import React from "react";
import PropTypes from "prop-types";
import Loadable from "@loadable/component";
import Helmet from "react-helmet";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
// import { useStaticQuery, graphql } from "gatsby";

// import Header from "../components/header";
import "./index.scss";

toast.configure({
  autoClose: 4000,
  draggable: false,
  newestOnTop: true,
  position: toast.POSITION.TOP_RIGHT,
});

const Fonts = Loadable(() => import("../components/fontloader"));

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
      <Helmet>
        <script
          src={`https://www.google.com/recaptcha/api.js?render=${process.env.GATSBY_RECAPTCHA_SITE_KEY}`}
        ></script>
      </Helmet>
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
