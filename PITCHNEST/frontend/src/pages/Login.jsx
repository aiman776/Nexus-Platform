import { useState } from "react";
import { useAuth } from "../store/auth";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { Mail, Lock, Briefcase, TrendingUp } from "lucide-react";
import "./Login.css";

export const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { storeTokenInLS } = useAuth();

  const [user, setUser] = useState({
    email: "",
    password: "",
    role: "entrepreneur",
  });

  const redirectPath =
    new URLSearchParams(location.search).get("redirect") || "/dashboard";

  const handleInput = (e) => {
    const { name, value } = e.target;
    setUser({ ...user, [name]: value });
  };

  const handleRole = (selectedRole) => {
    setUser({ ...user, role: selectedRole });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:1000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(user),
      });
      if (response.ok) {
        const responseData = await response.json();
        storeTokenInLS(responseData.token);
        alert("Login Successful");
        setUser({ email: "", password: "", role: "entrepreneur" });
        if (user.role === "investor") {
          navigate("/dashboard/investor");
        } else {
          navigate("/dashboard/entrepreneur");
        }
      } else {
        alert("Invalid credentials");
      }
    } catch (error) {
      console.log(error);
    }
  };

  // ✅ Demo credentials
  const demoCredentials = {
    entrepreneur: {
      email: "entrepreneur@demo.com",
      password: "demo1234",
      role: "entrepreneur",
    },
    investor: {
      email: "investor@demo.com",
      password: "demo1234",
      role: "investor",
    },
  };

  // ✅ Sirf form fill karo - login nahi
  const handleDemo = (role) => {
    const creds = demoCredentials[role];
    setUser(creds);
  };

  return (
    <section className="login-page">

      {/* Back to Home - fixed top left */}
      <div className="back-home">
        <Link to="/" className="home">← Back to Home</Link>
      </div>

      <main className="login-main">

        {/* Logo */}
        <div className="login-logo">
          <img src="/pitchnest-logo.png" alt="Logo" />
        </div>

        <h1 className="login-title">Sign in to PITCHNEST</h1>
        <p className="login-subtitle">Connect with investors and entrepreneurs</p>

        <div className="login-containers">

          {/* Role Selection */}
          <p className="role-label">I am a</p>
          <div className="role-buttons">
            <button
              type="button"
              className={`role-btn ${user.role === "entrepreneur" ? "active" : ""}`}
              onClick={() => handleRole("entrepreneur")}
            >
              <Briefcase size={18} /> Entrepreneur
            </button>
            <button
              type="button"
              className={`role-btn ${user.role === "investor" ? "active" : ""}`}
              onClick={() => handleRole("investor")}
            >
              <TrendingUp size={18} /> Investor
            </button>
          </div>

          {/* Form */}
          <form className="login-form" onSubmit={handleSubmit}>
            <div>
              <span className="input-icon"><Mail size={16} /></span>
              <input
                id="email"
                type="email"
                name="email"
                value={user.email}
                onChange={handleInput}
                placeholder=" "
                required
              />
              <label htmlFor="email">Email address</label>
            </div>

            <div>
              <span className="input-icon"><Lock size={16} /></span>
              <input
                id="password"
                type="password"
                name="password"
                value={user.password}
                onChange={handleInput}
                placeholder=" "
                required
              />
              <label htmlFor="password">Password</label>
            </div>

            {/* Remember me + Forgot password */}
            <div className="remember-row">
              <label className="remember-me">
                <input type="checkbox" /> Remember me
              </label>
              <a href="#" className="forgot-link">Forgot your password?</a>
            </div>

            <button type="submit" className="btn-submit-login">
              Sign in
            </button>

            {/* ✅ Demo accounts - sirf form fill */}
            <div className="demo-accounts">
              <p className="demo-title">Demo Accounts</p>
              <div className="demo-buttons">
                <button
                  type="button"
                  className="demo-btn"
                  onClick={() => handleDemo("entrepreneur")}
                >
                  <Briefcase size={16} /> Entrepreneur Demo
                </button>
                <button
                  type="button"
                  className="demo-btn"
                  onClick={() => handleDemo("investor")}
                >
                  <TrendingUp size={16} /> Investor Demo
                </button>
              </div>
            </div>
          </form>

          {/* Or divider */}
          <div className="or-divider">
            <span></span>
            <p>Or</p>
            <span></span>
          </div>

          <p className="register-link">
            Don't have an account?{" "}
            <Link to={`/register?redirect=${redirectPath}`}>Sign up</Link>
          </p>
        </div>
      </main>
    </section>
  );
};