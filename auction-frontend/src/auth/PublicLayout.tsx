import { Navigate, Outlet } from 'react-router-dom'
import React from 'react'
import { useAuth } from './AuthProvider'

export default function PublicLayout() {
  const { user } = useAuth()

  if (user) {
    return <Navigate to="/" />
  }
  return (
    <div className="app">
      <header className="header">
        <p className="py-3 px-3">Auction app</p>
      </header>
      <Outlet />
    </div>
  )
}