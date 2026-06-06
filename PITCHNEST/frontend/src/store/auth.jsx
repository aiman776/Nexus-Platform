import { createContext, useContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => {
    return localStorage.getItem("token") || "";
  });

  const [user, setUser] = useState(null);

  const storeTokenInLS = (serverToken) => {
    setToken(serverToken);
    localStorage.setItem("token", serverToken);
  };

  const isLoggedIn = !!token;

  const LogoutUser = () => {
    setToken("");
    setUser(null);
    localStorage.removeItem("token");
  };

  const authFetch = async (url, options = {}) => {
    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      ...(options.headers || {}),
    };
    const res = await fetch(url, { ...options, headers });
    return res;
  };

  // ✅ Token ho to user fetch karo
  useEffect(() => {
    const fetchUser = async () => {
      if (!token) return;
      try {
        // ✅ Fix: sahi URL
        const res = await fetch("http://localhost:1000/api/profile", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await res.json();
        if (res.ok) setUser(data);
      } catch (err) {
        console.error("User fetch error:", err);
      }
    };
    fetchUser();
  }, [token]);

  return (
    <AuthContext.Provider
      value={{ isLoggedIn, storeTokenInLS, LogoutUser, token, authFetch, user }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const authContextValue = useContext(AuthContext);
  if (!authContextValue) {
    throw new Error("useAuth used outside of the Provider");
  }
  return authContextValue;
};