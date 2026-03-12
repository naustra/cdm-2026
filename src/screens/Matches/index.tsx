import { Routes, Route } from 'react-router-dom'
import View from './View'
import Matches from './Matches'

export default function Index() {
  return (
    <Routes>
      <Route path="/:id" element={<View />} />
      <Route path="/" element={<Matches />} />
    </Routes>
  )
}
