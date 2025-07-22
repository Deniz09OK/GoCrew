import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import HomePublic from "./HomePublic.jsx";
import Login from "./Login.jsx";
import Signup from "./Signup.jsx";
import Forgot from "./Forgot.jsx";
import ProtectedRoute from "./components/ProtectedRoute";
import Homeprivate from "./Homeprivate.jsx";

function App() {
  const [count, setCount] = useState(0)

  return (

    <BrowserRouter>
      <Routes>

        {/* Redirection par défaut vers /home-public */}
        <Route path="/" element={<Navigate to="/home-public" replace />} />

        {/* Pages publiques */}
        <Route path="/home-public" element={<HomePublic />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forgot" element={<Forgot />} />

        {/* Page privée après connexion */}
        <Route path="/homeprivate" element={<Homeprivate />} />

      </Routes>
    </BrowserRouter>
  )
}

export default App
