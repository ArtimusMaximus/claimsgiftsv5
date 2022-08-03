import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import Login from './components/Login';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Signup from './components/Signup';
import Dashboard from './components/Dashboard';
import RequireAuth from './components/auth/RequireAuth';
import { AuthContextProvider } from './components/context/AuthContext';
import AddGiftForm from './components/events/AddGiftForm';



const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <AuthContextProvider>
  <Router>
    <Routes>
      <Route path="/" element={<App />}>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/dashboard" element={<RequireAuth><Dashboard /></RequireAuth>} />
        <Route path="/dashboard/:id" element={<RequireAuth><AddGiftForm /></RequireAuth>} />
        <Route path="/logout" element={<Login />} />
      </Route>
    </Routes>
  </Router>
  </AuthContextProvider>
);


