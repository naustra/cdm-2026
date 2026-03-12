import { lazy } from 'react'
import { Routes, Route } from 'react-router-dom'
import Matches from './Matches'

const View = lazy(() => import('./View/Details'))

export default function Index() {
  return (
    <Routes>
      <Route path="/:id" element={<View />} />
      <Route path="/" element={<Matches />} />
    </Routes>
  )
}
