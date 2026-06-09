import { BrowserRouter as Router, Routes, Route, Outlet, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { io } from 'socket.io-client';
import { useAuth } from "./store/auth";

import { Home } from "./pages/Home";
import { Register } from "./pages/Register";
import { Login } from "./pages/Login";
import { Navbar } from "./Components/Navbar";
import { Error } from "./pages/error";
import { Logout } from "./pages/Logout";
import Profile from "./pages/Profile";
import EntrepreneurDashboard from "./pages/dashboard/EntrepreneurDashboard";
import InvestorDashboard from "./pages/dashboard/InvestorDashboard";
import HelpPage from "./pages/dashboard/HelpPage";
import SettingsPage from "./pages/dashboard/SettingsPage";
import DocumentsPage from "./pages/dashboard/DocumentsPage";
import DealsPage from "./pages/dashboard/DealsPage";
import NotificationsPage from "./pages/dashboard/NotificationsPage";
import MessagesPage from "./pages/dashboard/MessagesPage";
import FindStartupsPage from "./pages/dashboard/FindStartupsPage";
import InvestorsPage from "./pages/dashboard/InvestorsPage";
import EntrepreneurProfile from "./pages/dashboard/EntrepreneurProfile";
import InvestorProfile from "./pages/dashboard/InvestorProfile";
import MeetingsPage from "./pages/dashboard/MeetingsPage";
import VideoCallPage from "./pages/dashboard/VideoCallPage";

import "./App.css";

const socket = io('http://localhost:1000');

// ✅ Layouts
const MainLayout = () => (
  <>
    <Navbar />
    <Outlet />
  </>
);

const AuthLayout = () => (
  <>
    <Outlet />
  </>
);

const AppContent = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [incomingCall, setIncomingCall] = useState(null);

  useEffect(() => {
    if (user?._id) {
      socket.emit('register-user', user._id);
      socket.on('incoming-call', ({ callerId, callerName, roomId }) => {
        setIncomingCall({ callerId, callerName, roomId });
      });
      socket.on('call-declined', () => {
        alert('Call declined!');
      });
    }
    return () => {
      socket.off('incoming-call');
      socket.off('call-declined');
    };
  }, [user]);

  const handleAccept = () => {
    socket.emit('accept-call', { callerId: incomingCall.callerId, roomId: incomingCall.roomId });
    setIncomingCall(null);
    navigate(`/video-call/${incomingCall.roomId}`);
  };

  const handleDecline = () => {
    socket.emit('decline-call', { callerId: incomingCall.callerId });
    setIncomingCall(null);
  };

  return (
    <>
      {/* ✅ Incoming Call Popup */}
      {incomingCall && (
        <div className="incoming-call-popup">
          <div className="incoming-call-box">
            <div className="call-avatar">
              {incomingCall.callerName?.charAt(0).toUpperCase()}
            </div>
            <h3>{incomingCall.callerName}</h3>
            <p>Incoming Video Call...</p>
            <div className="call-btns">
              <button className="call-accept-btn" onClick={handleAccept}>Accept</button>
              <button className="call-decline-btn" onClick={handleDecline}>Decline</button>
            </div>
          </div>
        </div>
      )}

      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/logout" element={<Logout />} />
          <Route path="/dashboard/entrepreneur" element={<EntrepreneurDashboard />} />
          <Route path="/dashboard/investor" element={<InvestorDashboard />} />
          <Route path="/help" element={<HelpPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/documents" element={<DocumentsPage />} />
          <Route path="/deals" element={<DealsPage />} />
          <Route path="/notifications" element={<NotificationsPage />} />
          <Route path="/messages" element={<MessagesPage />} />
          <Route path="/find-startups" element={<FindStartupsPage />} />
          <Route path="/find-investors" element={<InvestorsPage />} />
          <Route path="/entrepreneur/:id" element={<EntrepreneurProfile />} />
          <Route path="/investor/:id" element={<InvestorProfile />} />
          <Route path="/meetings" element={<MeetingsPage />} />
          <Route path="/video-call/:roomId" element={<VideoCallPage />} />
        </Route>

        <Route element={<AuthLayout />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/profile" element={<Profile />} />
        </Route>

        <Route path="/*" element={<Error />} />
      </Routes>
    </>
  );
};

const App = () => {
  return (
    <Router>
      <AppContent />
    </Router>
  );
};

export default App;