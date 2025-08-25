import { useState } from 'react'
import './App.css'
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import HomePublic from "./HomePublic.jsx";
import Login from "./Login.jsx";
import Signup from "./Signup.jsx";
import Forgot from "./Forgot.jsx";
import Profile from "./Profile.jsx";
import Crew from "./Crew";


function App() {

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
        
        {/* Page de profil, protégée par authentification */}
        <Route path="/profile" element={<Profile />} />
        <Route path="/crew" element={<Crew />} />

      </Routes>
    </BrowserRouter>
  )
}

export default App
