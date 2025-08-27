import { Routes, Route } from 'react-router-dom'
// Pages
import Login from './pages/Login'
import Events from './pages/Events'
import Register from './pages/Register'
import CreateEvent from './pages/CreateEvent'
import MoreInfo from './pages/MoreInfo';
import VerificationPage from './pages/VerificationPage'
import ConfirmEmail from './pages/ConfirmEmail'
import StartPage from './pages/StartPage'
import MyEvents from './pages/MyEvents'
import Friends from './pages/Friends'
// Components
import ProtectedRoute from './components/ProtectedRoute'
import Navbar from "./components/Navbar"
import Slideshow from './components/Slideshow'
import PublicRoute from './components/PublicRoute'

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
    <>
      <header>
        <Navbar />
      </header>

      <main style={{ paddingTop: "120px", paddingBottom: "40px" }}>
        <Slideshow />
        <Routes>
          <Route path="/" element={
            <PublicRoute>
              <StartPage />
            </PublicRoute>
          } />
          <Route path="/login" element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          } />
          <Route path="/register" element={
            <PublicRoute>
              <Register />
            </PublicRoute>
          } />
          <Route path="/verificationPage" element={
            <PublicRoute>
              <VerificationPage />
            </PublicRoute>
          } />
          <Route path="/confirm-email" element={
            <PublicRoute>
              <ConfirmEmail />
            </PublicRoute>
          } />
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
          <Route path="/my-events" element={
            <ProtectedRoute>
              <MyEvents />
            </ProtectedRoute>
          } />
          <Route path="/more-info/:eventId" element={
            <ProtectedRoute>
              <MoreInfo />
            </ProtectedRoute>
          } />
          <Route path="/friends" element={
            <ProtectedRoute>
              <Friends />
            </ProtectedRoute>
          } />
          <Route path="*" element={<div>404 Not Found</div>} />
        </Routes>
      </main>
    </>
  )
}
