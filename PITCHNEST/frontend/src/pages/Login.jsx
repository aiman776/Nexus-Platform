import { useState } from "react";
import { useAuth } from "../store/auth";
import { useNavigate, Link, useLocation } from "react-router-dom"; // ✅ useLocation added
import "./Login.css";

export const Login = () => {
  const navigate = useNavigate();
  const location = useLocation(); // ✅ Moved inside component
  const { storeTokenInLS } = useAuth();

  const [user, setUser] = useState({
    email: "",
    password: "",
  });

  const handleInput = (e) => {
    let name = e.target.name;
    let value = e.target.value;

    setUser({
      ...user,
      [name]: value,
    });
  };

  // ✅ Extract redirect path from query
  const redirectPath =
    new URLSearchParams(location.search).get("redirect") || "/";

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:1000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(user),
      });

      if (response.ok) {
        const responseData = await response.json();
        storeTokenInLS(responseData.token);
        alert("Login Successful");
        setUser({ email: "", password: "" });

        // ✅ Redirect user back to original page (like /mealplan)
        navigate(redirectPath);
      } else {
        alert("Invalid credentials");
        console.log("Invalid credentials");
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <section className="login-page">
        <main>
          {/* 👇 Back to Home Button */}
          <div className="back-home">
            <Link to="/" className="home">
              ← Back to Home
            </Link>
          </div>

          <div className="login-containers">
            <div className="login-form">
              <h1 className="main-heading-login">Login form</h1>
              <br />
              <form onSubmit={handleSubmit}>
                <div>
                  <input
                    type="text"
                    name="email"
                    value={user.email}
                    onChange={handleInput}
                    placeholder=""
                  />
                  <label htmlFor="email">Email</label>
                </div>

                <div>
                  <input
                    type="password"
                    name="password"
                    value={user.password}
                    onChange={handleInput}
                    placeholder=""
                  />
                  <label htmlFor="password">Password</label>
                </div>
                <br />
                <button type="submit" className="btn-submit-login">
                  LOGIN
                </button>
              </form>
            </div>
<p className="register-link">
  Don't have an account?{" "}
  <Link to={`/register?redirect=${redirectPath}`}>Register</Link>
</p>
          </div>
        </main>
      </section>
    </>
  );
};
