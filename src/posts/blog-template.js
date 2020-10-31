import React, { useContext } from "react"
import { graphql } from "gatsby"
import { MDXProvider } from "@mdx-js/react"
import { MDXRenderer } from "gatsby-plugin-mdx"
import { Link } from "gatsby"
import styled from "styled-components"
import { ContentWrapper, breakToMobile } from "../components/contentWrapper"
import Img from "gatsby-image"
import { SEO } from "../components/seo"
import { PostStyles } from "./post-styles"
import { GlobalState } from "../context/globalStateContext"
import { Ing, LinkedRecipe } from "../components/ingredientLink"
import { BackButton } from "../components/backButton"

const Highlight = styled.div`
  background-color: var(--color-graphBackground);
  margin: 40px 0;
  padding: 10px 30px 30px 30px;
  border-radius: 10px;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.3);

  @media (max-width: ${breakToMobile}px) {
    margin: 30px 0;
  }
`

const StyledArticle = styled.article`
  max-width: 750px;
  margin: 0 auto;
`

const HeaderImage = ({ headerImg, appInterface }) => {
  return (
    <Img
      style={{
        width: "100%",
        height: appInterface ? "20vmax" : "30vmax",
        maxHeight: "350px",
      }}
      imgStyle={{
        objectFit: "cover",
        width: "100%",
        height: "100%",
      }}
      fluid={headerImg.image}
      alt={headerImg.description ? headerImg.description : ""}
    />
  )
}

const FeatureImgContainer = styled.div`
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.2);
  border-radius: 10px 10px 0 0;
  overflow: hidden;
  @media (max-width: ${breakToMobile - 200}px) {
    box-shadow: initial;
    border-radius: 0;
    margin-left: calc(-50vw + 50%);
    margin-right: calc(-50vw + 50%);
  }
`

const FeatureImage = ({ featureImg }) => {
  return (
    <FeatureImgContainer>
      <Img
        style={{
          width: "100%",
        }}
        imgStyle={{
          width: "100%",
        }}
        fluid={featureImg.image}
        alt={featureImg.description ? featureImg.description : ""}
      />
    </FeatureImgContainer>
  )
}

const Header = styled.header`
  display: flex;
  align-items: baseline;
  position: relative;
  left: -50px;

  @media (max-width: ${breakToMobile}px) {
    position: static;
  }

  p {
    margin-bottom: 0;
  }
`

const HeaderText = styled.div`
  width: 100%;
`

const BlogTemplate = ({ data }) => {
  const context = useContext(GlobalState)

  const fm = data.mdx.frontmatter
  const headerImg = fm.header ? fm.header.childImageSharp.fluid : false
  const featureImg = fm.feature ? fm.feature.childImageSharp.fluid : false

  const shortcodes = {
    Link,
    Ing,
    LinkedRecipe,
    Highlight,
  }

  return (
    <>
      <SEO title={fm.title} />
      {headerImg && (
        <HeaderImage
          appInterface={context.appInterface}
          headerImg={{ image: headerImg, description: fm.headerDescription }}
        />
      )}
      <ContentWrapper headerImg={headerImg}>
        <PostStyles>
          <StyledArticle>
            <Header>
              <BackButton link="/blog" />
              <HeaderText>
                <h1>{fm.title}</h1>
                {fm.date && <p>{fm.date}</p>}
                {!featureImg && <hr />}
              </HeaderText>
            </Header>
            {featureImg && (
              <FeatureImage
                featureImg={{
                  image: featureImg,
                  description: fm.featureDescription,
                }}
              />
            )}
            <MDXProvider components={shortcodes}>
              <MDXRenderer>{data.mdx.body}</MDXRenderer>
            </MDXProvider>
          </StyledArticle>
        </PostStyles>
      </ContentWrapper>
    </>
  )
}

export const pageQuery = graphql`
  query($id: String) {
    mdx(id: { eq: $id }) {
      id
      body
      frontmatter {
        title
        date(formatString: "DD MMMM, YYYY", locale: "fr")
        header {
          childImageSharp {
            fluid(maxWidth: 1500) {
              ...GatsbyImageSharpFluid_withWebp
            }
          }
        }
        headerDescription
        feature {
          childImageSharp {
            fluid(maxWidth: 800) {
              ...GatsbyImageSharpFluid_withWebp
            }
          }
        }
        featureDescription
      }
    }
  }
`

export default BlogTemplate