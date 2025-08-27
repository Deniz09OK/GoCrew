import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./Login.jsx";
import Signup from "./Signup.jsx";
import Forgot from "./Forgot.jsx";
import Dashboard from "./Dashbord.jsx";
import Messages from "./pages/Messages.jsx";
import Announcements from './pages/Announcements.jsx';
import Trips from './pages/Trips.jsx';
import HomeDashboard from './pages/HomeDashboard.jsx';
import Home from './Home.jsx'
import AppLayout from './components/AppLayout.jsx';

function App() {
  const [count, setCount] = useState(0)

  return (

    <BrowserRouter>
      <Routes>
        {/* Redirection par défaut vers /login */}

        {/* Pages publiques */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forgot" element={<Forgot />} />


        {/* Pages protégées */}
        <Route element={<AppLayout />}>
        <Route path="/home" element={<HomeDashboard />} />
        <Route path="/dashboard" element={<Dashboard />} />
       <Route path="/messages" element={<Messages />} />
        <Route path="/announcements" element={<Announcements />} />
        <Route path="/trips" element={<Trips />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
