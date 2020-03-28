import React from "react";
import * as yup from "yup";
import { useFormik } from "formik";
import Img, { FluidObject } from "gatsby-image";
import { graphql } from "gatsby";
import { Form } from "react-bootstrap";

import Layout from "../layouts/index";
import SEO from "../components/seo";
import "./index.scss";

interface IndexPageProps {
  data: {
    background: {
      childImageSharp: {
        fluid: FluidObject;
      };
    };
    logo: {
      childImageSharp: {
        fluid: FluidObject;
      };
    };
  };
}

const IndexPage = (args: IndexPageProps) => {
  const formik = useFormik({
    validationSchema: yup.object({
      email: yup
        .string()
        .email("invalid email address")
        .required("required"),
    }),
    onSubmit: values => {
      console.log(values);
    },
    initialValues: {
      email: "",
    }
  })
  return (
    <Layout>
      <SEO title="Cosmetic 101" />
      <div className="middle-container">
        <div className="box">
          <div>
            <Img
              fluid={args.data.logo.childImageSharp.fluid}
              className="logo"
            />
            <h2>COMING SOON</h2>
            <hr />
            <Form.Group
              style={{
                margin: 0,
                padding: 0,
              }}
            >
              <Form.Control
                id="email"
                name="email"
                type="email"
                placeholder="Enter email >"
                onKeyDown={(evt: any) => {
                  if (evt.key === "Enter") {
                    formik.handleSubmit();
                  }
                }}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.email}
                isInvalid={!!formik.errors.email}
              />
              <Form.Control.Feedback className="feedback" type="invalid">
                {formik.errors.email}
              </Form.Control.Feedback>
            </Form.Group>
          </div>
        </div>
      </div>
      <div
        style={{
          height: "100%",
          width: "100%",
          position: "relative",
        }}
      >
        <div
          style={{
            position: "fixed",
            bottom: "0",
            width: "100%",
          }}
        >
          <Img
            className="background-image"
            fluid={args.data.background.childImageSharp.fluid}
          />
        </div>
      </div>
    </Layout>
  );
};

export default IndexPage;

export const query = graphql`
  query {
    background: file(absolutePath: { regex: "//images/background.png/" }) {
      childImageSharp {
        # Specify the image processing specifications right in the query.
        # Makes it trivial to update as your page's design changes.
        fluid(fit: COVER) {
          ...GatsbyImageSharpFluid
        }
      }
    }
    logo: file(absolutePath: { regex: "//images/logo.png/" }) {
      childImageSharp {
        # Specify the image processing specifications right in the query.
        # Makes it trivial to update as your page's design changes.
        fluid(fit: COVER) {
          ...GatsbyImageSharpFluid
        }
      }
    }
  }
`;
