import { Link, useStaticQuery, graphql } from "gatsby"
import React, { useState } from "react"
import styled from "styled-components"
import { SettingsIcon } from "./settingsIcon"
import { widthPercent, maxWidth, breakToMobile } from "./contentWrapper"
import { useWindowWidth } from "./customHooks"

const NavWrapper = styled.nav`
  position: fixed;
  top: 0;
  width: 100%;
  height: 55px;
  background-color: var(--color-nav);
  display: flex;
  justify-content: space-between;
  z-index: 3;
  box-shadow: 0 10px 20px hsla(0, 0%, 10%, 0.1);
  transition: all 0.3s;
  align-items: center;
`

const MenuButton = styled.button`
  font-size: 16px;
  font-weight: 700;
  padding: 10px;
  margin-right: 10px;
`

const HorizontalNavList = styled.ul`
  display: flex;
  justify-content: flex-end;
  margin-right: 15px;

  li {
    margin-left: 5px;
    @media (max-width: ${breakToMobile}px) {
      margin-left: 0;
    }
  }

  a {
    color: var(--color-navText);
    padding: 5px 8px;
    font-weight: 700;
    transition: color 0.2s;

    &:hover {
      color: var(--color-activeLink);
    }
  }
`

const PageTitle = styled(Link)`
  position: fixed;
  padding: 10px;
  left: calc(50% - min(${widthPercent / 2}%, ${maxWidth / 2}px) - 10px);
  font-family: Quicksand, sans-serif;
  font-size: 24px;
  color: var(--color-navTitle);
  letter-spacing: 2px;
  text-transform: uppercase;
  font-weight: 700;
  transition: color 0.2s;

  &:hover {
    color: var(--color-activeLink);
  }

  @media (max-width: ${breakToMobile}px) {
    position: static;
    font-size: 21px;
  }
`

const DropDownOptions = styled.section`
  width: 100%;
  position: fixed;
  z-index: 2;
  text-align: center;
  background-color: hsla(250, 10%, 11%, 0.99);
  padding: 25px;
  padding-top: 80px;
  border-radius: 0 0 20px 20px;
  box-shadow: 0 10px 20px hsla(0, 0%, 10%, 0.1);
  li {
    margin: 0 20%;
  }
  a {
    color: var(--color-navText);
    display: inline-block;
    font-size: 18px;
    font-weight: 700;
    line-height: 1.5;
    padding: 8px;
    width: 80%;
    &:hover {
      color: var(--color-activeLink);
    }
  }
  transform: ${props => (props.open ? "translateY(0)" : "translateY(-100%)")};
  transition: transform 0.4s;
`

export const DesktopNav = ({ settingsIsOpen, toggleSettings }) => {
  const data = useStaticQuery(graphql`
    query SiteTitleQuery {
      site {
        siteMetadata {
          title
        }
      }
    }
  `)

  const navOptions = [
    {
      name: "About",
      link: "/",
    },
    {
      name: "Recettes",
      link: "/recettes",
    },
    {
      name: "Ingredients",
      link: "/ingredients",
    },
    {
      name: "Blog",
      link: "/blog",
    },
  ]

  const HorizontalNav = () => {
    const activeStyle = { border: "solid 1px", borderRadius: "8px" }
    return (
      <HorizontalNavList>
        {navOptions.map(element => (
          <li>
            <Link to={element.link} activeStyle={activeStyle}>
              {element.name}
            </Link>
          </li>
        ))}
      </HorizontalNavList>
    )
  }

  const windowWidth = useWindowWidth()
  const [dropDownIsOpen, setDropDownIsOpen] = useState(false)
  return (
    <>
      <DropDownOptions open={dropDownIsOpen}>
        <ul>
          {navOptions.map((element, index) => (
            <li>
              <Link onClick={() => setDropDownIsOpen(!dropDownIsOpen)} to={element.link}>{element.name}</Link>
              {index < navOptions.length - 1 && <hr />}
            </li>
          ))}
        </ul>
      </DropDownOptions>
      <NavWrapper>
        <SettingsIcon />
        <PageTitle to="/">{data.site.siteMetadata.title}</PageTitle>
        {windowWidth > 700 ? (
          <HorizontalNav />
        ) : (
          <MenuButton onClick={() => setDropDownIsOpen(!dropDownIsOpen)}>Menu</MenuButton>
        )}
      </NavWrapper>
    </>
  )
}
