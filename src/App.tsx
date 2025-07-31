import { Routes, Route } from 'react-router-dom'
// Pages
import Login from './pages/Login'
import Events from './pages/Events'
import Register from './pages/Register'
import CreateEvent from './pages/CreateEvent'
import MoreInfo from './pages/MoreInfo';
import VerificationPage from './pages/VerificationPage'
import ConfirmEmail from './pages/ConfirmEmail'
// Components
import ProtectedRoute from './components/ProtectedRoute'
import Navbar from "./components/Navbar"
import Slideshow from './components/Slideshow'

import './App.css'
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

export default function App() {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("jwtToken");
    const expiresAt = localStorage.getItem("jwtExpiresAt");

    if (token && expiresAt) {
      const currentTime = new Date().getTime();
      if (currentTime > parseInt(expiresAt)) {
        localStorage.removeItem("jwtToken");
        localStorage.removeItem("jwtExpiresAt");
        
        navigate("/");
      }
    }
  }, [navigate]);

  return (
    <div>
      <Navbar />
      <Slideshow />
      <main style={{ paddingTop: "120px", paddingBottom: "40px" }}>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/verificationPage" element={<VerificationPage />} />
          <Route path="/confirm-email" element={<ConfirmEmail />} />
          <Route path="/events" element={
            <ProtectedRoute>
              <Events />
            </ProtectedRoute>
          } />
          <Route path="/create-event" element={
            <ProtectedRoute>
              <CreateEvent />
            </ProtectedRoute>
          } />
          <Route path="/more-info/:eventId" element={
            <ProtectedRoute>
              <MoreInfo />
            </ProtectedRoute>
          } />
          <Route path="*" element={<div>404 Not Found</div>} />
        </Routes>
      </main>
    </div>
    
  )
}
