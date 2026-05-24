import { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom"; // ✅ Added useLocation
import { useAuth } from "../store/auth"; 
import "./Register.css";

export const Register = () => {
  const navigate = useNavigate();
  const location = useLocation(); // ✅ to read redirect path
  const { storeTokenInLS } = useAuth();

  const [user, setUser] = useState({
    username: "",
    email: "",
    phone: "",
    password: "",
    age: "",
  });

  const handleInput = (e) => {
    let name = e.target.name;
    let value = e.target.value;

    setUser({
      ...user,
      [name]: value,
    });
  };

  // ✅ Extract redirect path (default "/")
  const redirectPath =
    new URLSearchParams(location.search).get("redirect") || "/";

 const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    const response = await fetch("http://localhost:7000/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(user),
    });

    const responseData = await response.json();

    if (response.ok) {
      alert("Registration Successful");
      storeTokenInLS(responseData.token);

      setUser({ username: "", email: "", phone: "", password: "", age: "" });
      navigate(redirectPath);
    } else {
      alert(responseData.msg || "Registration failed");
    }
  } catch (error) {
    console.error(error);
    alert("Server error");
  }
};


  return (
    <>
      <section className="Register-page">
        <main>
          {/* 👇 Back to Home Button */}
          <div className="back-home-reg">
            <Link to="/" className="home-reg">
              ← Back to Home
            </Link>
          </div>

          <div className="reg-container">
  <div className="login-form">
    <h1 className="main-heading-login">Registration Form</h1>

    <form onSubmit={handleSubmit}>
      <div>
        <input type="text" name="username" value={user.username} onChange={handleInput} placeholder="" required />
        <label htmlFor="username">Username</label>
      </div>

      <div>
        <input type="text" name="email" value={user.email} onChange={handleInput} placeholder="" required />
        <label htmlFor="email">Email</label>
      </div>

      <div>
        <input type="number" name="phone" value={user.phone} onChange={handleInput} placeholder="" required />
        <label htmlFor="phone">Phone</label>
      </div>

      <div>
        <input type="password" name="password" value={user.password} onChange={handleInput} placeholder="" required />
        <label htmlFor="password">Password</label>
      </div>

      <div>
        <input type="number" name="age" value={user.age} onChange={handleInput} placeholder="" required />
        <label htmlFor="age">Age</label>
      </div>

      <br />

      <button type="submit" className="btn-submit-login">
        Register Now
      </button>
    </form>

    <p className="login-link">
      Already have an account? <Link to={`/login?redirect=${redirectPath}`}>Login</Link>
    </p>
  </div>
</div>

        </main>
      </section>
    </>
  );
};
