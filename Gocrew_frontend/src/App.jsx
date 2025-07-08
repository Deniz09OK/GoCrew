import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./Login.jsx";
import Signup from "./Signup.jsx";
import Forgot from "./Forgot.jsx";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  const [count, setCount] = useState(0)

  return (

    <BrowserRouter>
      <Routes>
        {/* Redirection par défaut vers /login */}
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* Pages publiques */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forgot" element={<Forgot />} />

      </Routes>
    </BrowserRouter>
  )
}

export default App
