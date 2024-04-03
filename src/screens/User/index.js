import { Routes, Route } from 'react-router-dom'
import User from './User'

export default function Index() {
  return (
    <Routes>
      <Route path="/:id" element={<User />} />
    </Routes>
  )
}
