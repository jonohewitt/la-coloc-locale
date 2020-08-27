import React from "react"
import { Link } from "gatsby"
import Img from "gatsby-image"
import styled from "styled-components"
import TimeIndicators from "./recipeTimeInfo"

const StyledUL = styled.ul`
  margin-top: 40px;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  grid-gap: 25px;
`

const RecipeCardContainer = styled.li`
  height: 400px;
  @media (max-width: 900px) {
    height: 100%;
  }
`

const RecipeCard = styled.div`
  position: relative;
  background-color: var(--color-graphBackground);
  border-radius: 8px;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.2);
  transition: transform 0.3s;
  overflow: hidden;
  @media (min-width: ${600}px) {
    height: 100%;
  }

  &:hover {
    transform: translateY(-5px);
  }
`

const DairyLabel = styled.div`
  height: 25px;
  border-radius: 5px;
  border: solid 1px;
  color: ${props =>
    props.vegan ? "var(--color-vegan)" : "var(--color-vegetarian)"};
  position: absolute;
  left: 20px;
  bottom: 20px;
  padding: 4px;
  display: flex;
  justify-content: center;
  align-items: center;
`

const DairyIndicator = ({ vegan, vegetarian }) => {
  if (vegan) {
    return <DairyLabel vegan>Vegan</DairyLabel>
  } else if (vegetarian && !vegan) {
    return <DairyLabel>Vegetarian</DairyLabel>
  } else {
    return false
  }
}

const RecipeImage = ({ headerImg, featureImg }) => {
  let usedImage = false

  if (!headerImg.image && featureImg.image) {
    usedImage = featureImg
  } else if (headerImg.image) {
    usedImage = headerImg
  }

  if (usedImage) {
    return (
      <Img
        style={{
          width: "100%",
          maxHeight: "200px",
        }}
        imgStyle={{
          objectFit: "cover",
          width: "100%",
          height: "100%",
        }}
        fluid={usedImage.image}
        alt={usedImage.description ? usedImage.description : ""}
      />
    )
  } else {
    return false
  }
}

const RecipeText = styled.div`
  padding: 10px 20px 20px 20px;
  margin-bottom: 20px;

  hr {
    margin-bottom: 15px;
  }

  h2 {
    margin: 0;
    padding-bottom: 8px;
    line-height: 1.1;
  }
`

const ListOfRecipes = ({ recipeList, filterList }) => (
  <StyledUL>
    {recipeList
      .filter(recipe => {
        if (filterList) {
          let recipeShouldBeIncluded = true

          Object.entries(filterList).forEach(([filter, filterIsApplied]) => {
            const recipePassesFilters =
              !filterIsApplied || recipe.frontmatter[filter] === filterIsApplied
            if (!recipePassesFilters) {
              recipeShouldBeIncluded = false
            }
          })

          return recipeShouldBeIncluded
        } else {
          return true
        }
      })
      .map(recipe => {
        const fm = recipe.frontmatter

        const headerImg =
          fm.header !== null ? fm.header.childImageSharp.fluid : false
        const featureImg =
          fm.feature !== null ? fm.feature.childImageSharp.fluid : false

        return (
          <RecipeCardContainer key={recipe.id}>
            <Link to={`/${fm.category}${fm.slug}`}>
              <RecipeCard>
                <RecipeImage
                  headerImg={{
                    image: headerImg,
                    description: fm.headerDescription,
                  }}
                  featureImg={{
                    image: featureImg,
                    description: fm.featureDescription,
                  }}
                />
                <RecipeText>
                  <h2>{fm.title}</h2>
                  <hr />
                  <p>
                    {fm.course}
                    {fm.feeds && ` • ${fm.feeds} people`}
                  </p>
                </RecipeText>
                <DairyIndicator vegan={fm.vegan} vegetarian={fm.vegetarian} />
                <TimeIndicators prepTime={fm.prepTime} cookTime={fm.cookTime} />
              </RecipeCard>
            </Link>
          </RecipeCardContainer>
        )
      })}
  </StyledUL>
)

export default ListOfRecipes
