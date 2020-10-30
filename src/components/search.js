import React, { useState, useEffect } from "react"
import styled from "styled-components"
import { ingredientsData } from "../posts/ingredients/ingredientsData"
import { Ing } from "./ingredientLink"
import { navigate, useStaticQuery, Link, graphql } from "gatsby"
import slugify from "slugify"
import { searchSVG } from "./icons"

const InputContainer = styled.div`
  border: 2px solid var(--color-hr);
  border-radius: 20px;
  background-color: var(--color-searchBackground);
  padding: 8px 13px;
  height: 37px;
  margin-bottom: 0;
  position: relative;
  z-index: 3;
  display: flex;
  align-items: center;
  box-shadow: 0 1px 2px hsla(0, 0%, 10%, 0.2);
  ${props => props.shadow && "box-shadow: 0 2px 6px hsla(var(--color-searchShadow), 0.2);"}
  width: 100%;

  svg {
    transform: scale(1.2);
    opacity: 0.6;
    margin-right: 10px;
    position: relative;
    top: 1px;
  }
`

const SearchInput = styled.input`
  background-color: transparent;
  border: none;
  padding: 0;
  word-wrap: break-word;
  outline: none;
  tap-highlight-color: transparent;
  font-size: 16px;
  color: var(--color-text);
  width: 100%;
`

const SearchResultList = styled.ul`
  max-height: 60vh;
  overflow-y: auto;
  margin-right: 5%;
  scrollbar-color: var(--color-hr) var(--color-searchBackground);
`

const SearchResultListContainer = styled.div`
  position: absolute;
  top: 55px;
  right: 0;
  width: 100%;
  border-radius: 20px;
  ${props => props.outline && "border: 2px solid var(--color-hr);"}
  box-shadow: 0 4px 14px hsla(var(--color-searchShadow),0.3);
  background-color: var(--color-searchBackground);
  padding: 15px 0;
  overflow: hidden;
`

const CategoryLabel = styled.p`
  position: absolute;
  pointer-events: none;
  text-transform: capitalize;
  top: 8px;
  left: 5%;
  font-size: 12px;
  font-weight: 700;
  color: ${props => {
    switch (props.type) {
      case "blog":
        return "#ADA1FC"
      case "recettes":
        return "#F39973"
      case "Error":
        return "var(--color-negative)"
      default:
        return "var(--color-text)"
    }
  }};
`

const ErrorMessage = styled.p``

const SearchResult = styled.li`
  ${props =>
    props.selected &&
    " background: var(--color-searchListSelected);background: linear-gradient(60deg, hsla(0, 0%, 0%, 0) 0%, hsla(0, 0%, 0%, 0) 5%, var(--color-searchListSelected) 100%); "}
  display: flex;
  position: relative;
  height: 55px;
  margin-top: 1px;

  :last-child {
    hr {
      display: none;
    }
  }

  hr {
    position: absolute;
    width: 95%;
    top: 55px;
    margin: 0 0 0 5%;
    padding: 0;
    height: 1px;
  }

  a,
  ${ErrorMessage} {
    padding: 20px 15px 0 0;
    padding-left: 5%;
    font-size: 16px;
    font-weight: 700;
    width: 100%;
    align-self: center;
    margin: 0;
  }

  :hover {
    ${props =>
      props.selected
        ? " background: var(--color-searchListHover);background: linear-gradient(60deg, hsla(0, 0%, 0%, 0) 0%, hsla(0, 0%, 0%, 0) 5%, var(--color-searchListHover) 100%); "
        : " background: var(--color-searchListSelected);background: linear-gradient(60deg, hsla(0, 0%, 0%, 0) 0%, hsla(0, 0%, 0%, 0) 5%, var(--color-searchListSelected) 100%); "};
  }

  a {
    border: 0 !important;
  }
`

const getSearchResults = (searchText, otherPageTitles) => {
  const safeSearchText = slugify(searchText, { strict: true, replacement: " " })
  const regex = new RegExp(`^${safeSearchText}|\\s${safeSearchText}`, "gi")
  const ingredientMatchList = ingredientsData.filter(ingredient =>
    slugify(ingredient.name, { strict: true, replacement: " " }).match(regex)
  )

  const otherMatchingPages = otherPageTitles.filter(title =>
    slugify(title.name, { strict: true, replacement: " " }).match(regex)
  )

  return ingredientMatchList.concat(otherMatchingPages)
}

export const Search = ({
  value,
  setValue,
  list,
  setList,
  navBarSearchIsActive,
  setNavBarSearchIsActive,
  setDropDownIsOpen,
  dropDownIsOpen,
  setMobileSearchIsActive,
  mobileSearchIsActive,
  mobile,
  app,
  navBar,
}) => {
  const data = useStaticQuery(graphql`
    query {
      allMdx {
        nodes {
          fields {
            source
          }
          frontmatter {
            title
            customSlug
          }
        }
      }
    }
  `)

  const [indexHighlighted, setIndex] = useState(0)
  const [typedInput, setTypedInput] = useState("")

  let otherPageTitles = []

  data.allMdx.nodes.forEach(node => {
    if (node.fields.source) {
      otherPageTitles.push({
        name: node.frontmatter.title,
        type: node.fields.source,
        customSlug: node.frontmatter.customSlug
          ? node.frontmatter.customSlug
          : false,
      })
    }
  })

  useEffect(() => {
    if (!navBarSearchIsActive) {
      setList([])
      setValue("")
    }
  }, [setList, setValue, navBarSearchIsActive])

  useEffect(() => {
    if (!mobileSearchIsActive) {
      setList([])
      setValue("")
    }
  }, [setList, setValue, mobileSearchIsActive])

  const handleChange = event => {
    setIndex(0)
    setValue(event.target.value)
    setTypedInput(event.target.value)
    if (event.target.value.length) {
      const results = getSearchResults(event.target.value, otherPageTitles)
      if (results.length) {
        setList(results)
      } else {
        setList([{ type: "Error" }])
      }
    } else {
      setList([])
    }
  }

  const handleSearchResultClick = () => {
    (mobile || app) && setMobileSearchIsActive(false)
    mobile && setDropDownIsOpen(false)
    navBar && setNavBarSearchIsActive(false)
  }

  const handleSubmit = async event => {
    event.preventDefault()
    if (list.length && list[0].type !== "Error") {
      await navigate(
        `/${
          list[indexHighlighted].type
            ? list[indexHighlighted].type
            : "ingredients"
        }/${slugify(list[indexHighlighted].name, {
          lower: true,
          strict: true,
        })}`
      )
      mobile && setDropDownIsOpen(false)
      navBar && setNavBarSearchIsActive(false)
    } else if (value.length) {
      setList([{ type: "Error" }])
    }
  }

  const handleKeyDown = event => {
    //if down arrow is pressed
    if (event.which === 40 && indexHighlighted < list.length - 1) {
      setIndex(indexHighlighted + 1)
      setValue(list[indexHighlighted + 1].name)
    }
    //if up arrow is pressed
    else if (event.which === 38) {
      event.preventDefault()
      if (indexHighlighted > 0) {
        setIndex(indexHighlighted - 1)
        setValue(list[indexHighlighted - 1].name)
      } else {
        setValue(typedInput)
      }
      //if escape is pressed
    } else if (event.which === 27) {
      navBar && setNavBarSearchIsActive(false)
    }
  }

  const handleFocus = event => {
    (mobile || app) && setMobileSearchIsActive(true)
    handleChange(event)
  }

  const IngredientSearchResult = ({ element }) => (
    <>
      <CategoryLabel>Ingredients</CategoryLabel>
      <Ing
        onClick={handleSearchResultClick}
        className="searchResult"
        id={element.name}
      >
        {element.name}
      </Ing>
    </>
  )

  const OtherPageSearchResult = ({ element }) => (
    <>
      <CategoryLabel type={element.type}>{element.type}</CategoryLabel>
      <Link
        onClick={handleSearchResultClick}
        className="searchResult"
        to={`/${element.type}${
          element.customSlug
            ? element.customSlug
            : "/" +
              slugify(element.name, {
                lower: true,
                strict: true,
              })
        }`}
      >
        {element.name}
      </Link>
    </>
  )

  const NoResultsFound = ({ element }) => (
    <>
      <CategoryLabel type={element.type}>Désolé !</CategoryLabel>
      <ErrorMessage>Aucun résultat trouvé</ErrorMessage>
    </>
  )

  return (
    <>
      <form onSubmit={handleSubmit}>
        <InputContainer shadow={!((mobile || app) && mobileSearchIsActive === false)}>
          {searchSVG}
          <SearchInput
            // Autofocus only happens after search button is pressed therefore focus is expected
            // eslint-disable-next-line jsx-a11y/no-autofocus
            autoFocus={!(mobile || app)}
            aria-label="Search"
            placeholder="Ingredients, recettes, blog posts..."
            type="text"
            value={value}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            onFocus={handleFocus}
          />
        </InputContainer>
        {list && list.length > 0 && (
          <SearchResultListContainer outline={mobile || app}>
            <SearchResultList>
              {list.map((element, index) => (
                <SearchResult
                  selected={index === indexHighlighted}
                  key={element.name ? element.name : "Error"}
                >
                  {element.months ? (
                    <IngredientSearchResult element={element} />
                  ) : element.type !== "Error" ? (
                    <OtherPageSearchResult element={element} />
                  ) : (
                    <NoResultsFound element={element} />
                  )}
                  <hr />
                </SearchResult>
              ))}
            </SearchResultList>
          </SearchResultListContainer>
        )}
      </form>
    </>
  )
}
