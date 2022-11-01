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
import AddGiftForm from './components/gifts/AddGiftForm';
import RedirectPage from './components/RedirectPage';
import ProfilePage from './components/profile/ProfilePage';
import LoggedOut from './components/LoggedOut';
import OauthLogin from './components/OauthLogin';
import VerifyEmail from './components/VerifyEmail';
import About from './components/About';
import EventInfo from './components/events/EventInfo';




const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <AuthContextProvider>
  <Router>
    <Routes>
      <Route path="/" element={<App />}>
        <Route path="/" element={<Login />} />
        <Route path="/oauth" element={<OauthLogin />} />
        <Route path="/auth" element={<VerifyEmail />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/dashboard" element={<RequireAuth><Dashboard /></RequireAuth>} />
        <Route path="/dashboard/eventinfo/:event" element={<RequireAuth><EventInfo /></RequireAuth>} />
        <Route path="/dashboard/user/:profile" element={<RequireAuth><ProfilePage /></RequireAuth>} />
        <Route path="/dashboard/:id" element={<RequireAuth><AddGiftForm /></RequireAuth>} />
        <Route path="/departure" element={<LoggedOut />} />
        <Route path="/about" element={<About />} />
        <Route path="*" element={<RedirectPage />} />
      </Route>
    </Routes>
  </Router>
  </AuthContextProvider>
);


