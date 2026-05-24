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
