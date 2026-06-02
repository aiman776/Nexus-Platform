import { BrowserRouter as Router, Routes, Route, Outlet } from "react-router-dom";

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

const App = () => {
  return (
    <Router>
      <Routes>

        {/* 🔵 Main Layout Routes */}
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

        </Route>

        {/* 🟡 Auth Layout Routes */}
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/profile" element={<Profile />} />
        </Route>

        {/* 🔴 Error Page */}
        <Route path="/*" element={<Error />} />

      </Routes>
    </Router>
  );
};

export default App;