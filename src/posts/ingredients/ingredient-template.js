import React, { useContext } from "react"
import { graphql } from "gatsby"
import styled from "styled-components"
import { SEO } from "../../components/seo"
import { ContentWrapper } from "../../components/contentWrapper"
import { ListOfRecipes } from "../../components/listOfRecipes"
import { GlobalState } from "../../context/globalStateContext"
import { ingredientsData } from "./ingredientsData"
import { IndividualSeasonalChart } from "../../components/individualSeasonalChart"
import { tickSVG, crossSVG } from "../../components/icons"
import { monthIndexToName } from "../../components/smallReusableFunctions"
import { BackButton } from "../../components/backButton"

const IngredientStyles = styled.div`
  h1 {
    font-size: 32px;
    margin-bottom: 5px;
  }

  h2 {
    font-size: 26px;
    svg {
      transform: scale(1.5);
      margin-left: 6px;
    }
  }

  main {
    margin-top: 50px;
  }
`

const Header = styled.header`
  display: flex;
  align-items: baseline;
  p {
    margin-bottom: 0;
  }
`

const HeaderText = styled.div`
  width: 100%;
`

const IngredientTemplate = ({ pageContext, data }) => {
  const context = useContext(GlobalState)

  const ingredientObject = ingredientsData.find(
    ingredient => ingredient.name === pageContext.name
  )

  let currentlyInSeason

  if (ingredientObject) {
    currentlyInSeason = ingredientObject.months[context.currentMonth]
  }

  let seasonalIndicator
  let icon

  if (currentlyInSeason !== undefined) {
    if (ingredientObject.months.some(month => !month)) {
      seasonalIndicator = currentlyInSeason
        ? `En saison en ${monthIndexToName(context.currentMonth)}`
        : `Hors saison en ${monthIndexToName(context.currentMonth)}`
      icon = currentlyInSeason ? tickSVG : crossSVG
    } else {
      seasonalIndicator = "Disponible toute l'année"
      icon = tickSVG
    }
  } else {
    seasonalIndicator = "Pas encore d'information"
  }

  const recipeList = data.allMdx.nodes

  const recipesWithIngredient = new Set(
    recipeList.filter(recipe => {
      if (recipe.frontmatter.linkedRecipes) {
        return (
          recipe.frontmatter.ingredients.includes(pageContext.name) ||
          recipe.frontmatter.linkedRecipes.some(linkedRecipe => {
            const foundLinkedRecipe = recipeList.find(
              element => element.frontmatter.title === linkedRecipe
            )
            return (
              foundLinkedRecipe &&
              foundLinkedRecipe.frontmatter.ingredients.includes(
                pageContext.name
              )
            )
          })
        )
      } else return recipe.frontmatter.ingredients.includes(pageContext.name)
    })
  )

  return (
    <IngredientStyles>
      <SEO title={pageContext.name} />
      <ContentWrapper>
        <Header>
          <BackButton link="/ingredients" />
          <HeaderText>
            <h1>{pageContext.name}</h1>
          </HeaderText>
        </Header>
        <hr />
        <main>
          {ingredientObject && (
            <>
              <h2>
                {seasonalIndicator} {icon}
              </h2>
              <hr />
              <IndividualSeasonalChart data={ingredientObject} />
            </>
          )}
          <h2>Recettes proposées</h2>
          <hr />
          <ListOfRecipes recipeList={[...recipesWithIngredient]} />
        </main>
      </ContentWrapper>
    </IngredientStyles>
  )
}

export const pageQuery = graphql`
  query {
    allMdx(filter: { fields: { source: { eq: "recettes" } } }) {
      nodes {
        id
        frontmatter {
          title
          feature {
            childImageSharp {
              fluid(maxWidth: 800) {
                ...GatsbyImageSharpFluid_withWebp
              }
            }
          }
          featureDescription
          vegan
          veganOption
          vegetarian
          prepTime
          cookTime
          feeds
          course
          ingredients
          linkedRecipes
        }
      }
    }
  }
`

export default IngredientTemplate
