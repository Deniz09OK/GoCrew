import './App.css'
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./Login.jsx";
import Signup from "./Signup.jsx";
import Forgot from "./Forgot.jsx";
import LandingPage from "./LandingPage.jsx";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Page d’accueil */}
        <Route path="/" element={<LandingPage />} />

        {/* Pages publiques */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forgot" element={<Forgot />} />

        {/* Redirection si la route n’existe pas */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
