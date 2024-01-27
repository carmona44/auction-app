import { Navigate, Outlet } from 'react-router-dom'
import React from 'react'
import { useAuth } from './AuthProvider'

export type JustLoggedInState = {
  justLoggedIn: boolean
}

export default function PublicLayout() {
  const { user } = useAuth()

  if (user) {
    const justLoggedInState = { justLoggedIn: true } as JustLoggedInState
    return <Navigate to="/seller/create" state={justLoggedInState} />
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
