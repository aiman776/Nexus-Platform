import { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useAuth } from "../store/auth";
import { User, Mail, Phone, Lock, Briefcase, TrendingUp } from "lucide-react";
import "./Register.css";

export const Register = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { storeTokenInLS } = useAuth();

  const [user, setUser] = useState({
    username: "",
    email: "",
    phone: "",
    password: "",
    age: "",
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
      const response = await fetch("http://localhost:1000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(user),
      });
      const responseData = await response.json();
      if (response.ok) {
        alert("Registration Successful");
        storeTokenInLS(responseData.token);
        setUser({ username: "", email: "", phone: "", password: "", age: "", role: "entrepreneur" });

        // ✅ Role ke mutabik dashboard pe bhejo
        if (user.role === "investor") {
          navigate("/dashboard/investor");
        } else {
          navigate("/dashboard/entrepreneur");
        }
      } else {
        alert(responseData.msg || "Registration failed");
      }
    } catch (error) {
      console.error(error);
      alert("Server error");
    }
  };

  return (
    <section className="register-page">

      <div className="back-home-reg">
        <Link to="/" className="home-reg">← Back to Home</Link>
      </div>

      <main className="register-main">

        <div className="reg-logo">
          <img src="/pitchnest-logo.png" alt="Logo" />
        </div>

        <h1 className="reg-title">Create your account</h1>
        <p className="reg-subtitle">Join PITCHNEST to connect with partners</p>

        <div className="reg-container">

          <p className="role-label">I am registering as a</p>
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

          <form className="registration-form" onSubmit={handleSubmit}>
            <div>
              <span className="input-icon"><User size={16} /></span>
              <input id="username" type="text" name="username" value={user.username} onChange={handleInput} placeholder=" " required />
              <label htmlFor="username">Full name</label>
            </div>
            <div>
              <span className="input-icon"><Mail size={16} /></span>
              <input id="email" type="email" name="email" value={user.email} onChange={handleInput} placeholder=" " required />
              <label htmlFor="email">Email address</label>
            </div>
            <div>
              <span className="input-icon"><Phone size={16} /></span>
              <input id="phone" type="number" name="phone" value={user.phone} onChange={handleInput} placeholder=" " required />
              <label htmlFor="phone">Phone number</label>
            </div>
            <div>
              <span className="input-icon"><Lock size={16} /></span>
              <input id="password" type="password" name="password" value={user.password} onChange={handleInput} placeholder=" " required />
              <label htmlFor="password">Password</label>
            </div>
            <div>
              <span className="input-icon"><User size={16} /></span>
              <input id="age" type="number" name="age" value={user.age} onChange={handleInput} placeholder=" " required />
              <label htmlFor="age">Age</label>
            </div>

            <div className="terms-check">
              <input type="checkbox" id="terms" required />
              <label htmlFor="terms">
                I agree to the <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a>
              </label>
            </div>

            <button type="submit" className="btn-submit-reg">
              Create account
            </button>

            <div className="or-divider">
              <span></span>
              <p>Or</p>
              <span></span>
            </div>
          </form>

          <p className="login-link">
            Already have an account? <Link to={`/login?redirect=${redirectPath}`}>Sign in</Link>
          </p>
        </div>
      </main>
    </section>
  );
};