import { Routes, Route } from 'react-router-dom'
// Pages
import Login from './pages/Login'
import Events from './pages/Events'
import Register from './pages/Register'
import FriendEvents from "./pages/FriendEvents"
import CreateEvent from './pages/CreateEvent'
// Components
import ProtectedRoute from './components/ProtectedRoute'
import Navbar from "./components/Navbar"
import Slideshow from './components/Slideshow'

import './App.css'

export default function App() {
  return (
    <div>
      <Navbar />
      <Slideshow />
      <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/events" element={
        <ProtectedRoute>
          <Events />
        </ProtectedRoute>
      } />
      <Route path="friendevents" element={
        <ProtectedRoute>
          <FriendEvents />
        </ProtectedRoute>
      } />
      <Route path="/create-event" element={
        <ProtectedRoute>
          <CreateEvent />
        </ProtectedRoute>
      } />
      <Route path="*" element={<div>404 Not Found</div>} />
      </Routes>
    </div>
    
  )
}
