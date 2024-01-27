import React from 'react'
import { NavLink, Outlet } from 'react-router-dom'
import './Buyer.scss'
import { Container } from 'react-bootstrap'

export default function Buyer() {
  return (
    <>
      <Container className="px-4 overflow-visible" fluid>
        <NavLink
          to="auctions"
          className={({ isActive }) =>
            isActive ? 'active nav-link' : 'nav-link'
          }
        >
          Discover
        </NavLink>
        <div className="divider" />
      </Container>
      <Outlet />
    </>
  )
}