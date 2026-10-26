import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";
import logo from "../assets/aksharam-logo.jpeg";

const Login = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    const enteredEmail = email.trim().toLowerCase();

    // Demo admin account
    const admin = {
      email: "admin@gmail.com",
      password: "123456",
      name: "Admin",
      role: "admin",
    };

    // Demo staff account
    const staff = {
      email: "staff@gmail.com",
      password: "123456",
      name: "Staff Member",
      role: "staff",
    };

    let user = null;

    if (
      enteredEmail === admin.email &&
      password === admin.password
    ) {
      user = admin;
    } else if (
      enteredEmail === staff.email &&
      password === staff.password
    ) {
      user = staff;
    }

    if (!user) {
      setError("Invalid email or password.");
      return;
    }

    // Save login information without changing the page design
    localStorage.setItem("isLoggedIn", "true");
    localStorage.setItem("userRole", user.role);
    localStorage.setItem("userName", user.name);
    localStorage.setItem("loggedInUser", user.name);
    localStorage.setItem("loggedInEmail", user.email);
    localStorage.setItem("staffName", user.name);

    localStorage.setItem(
      "loggedInUserData",
      JSON.stringify({
        name: user.name,
        email: user.email,
        role: user.role,
      })
    );

    // Open the appropriate dashboard
    if (user.role === "admin") {
      navigate("/admin/dashboard");
    } else {
      navigate("/staff/dashboard");
    }
  };

  return (
    <div className="login-page">

      {/* LEFT SECTION */}
      <div className="left-section">

        <img
          src={logo}
          alt="Aksharam Trust Logo"
          className="logo"
        />

        <h1>Welcome! Let's Make a Difference Together</h1>

        <p>
          Empowering lives through education, care and compassion
        </p>

      </div>

      {/* LOGIN CARD */}
      <div className="login-card">

        <h2>Hello!</h2>

        <p>Empowering Minds, Inspiring Futures.</p>

        <h3>Login your account</h3>

        <form onSubmit={handleSubmit}>

          {/* EMAIL */}
          <div className="input-group">
            <label htmlFor="email">Email</label>

            <input
              id="email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setError("");
              }}
              required
            />
          </div>

          {/* PASSWORD */}
          <div className="input-group">
            <label htmlFor="password">Password</label>

            <input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError("");
              }}
              required
            />
          </div>

          {/* SHOW PASSWORD */}
          <div className="options">
            <label>
              <input
                type="checkbox"
                checked={showPassword}
                onChange={() =>
                  setShowPassword(!showPassword)
                }
              />
              Show Password
            </label>

            <span
              className="forgot-password"
              onClick={() =>
                setError("Please contact the administrator to reset your password.")
              }
            >
              Forgot Password?
            </span>
          </div>

          {/* ERROR MESSAGE */}
          {error && (
            <p className="login-error" role="alert">
              {error}
            </p>
          )}

          {/* LOGIN BUTTON */}
          <button type="submit">
            Login
          </button>

        </form>

        <div className="signup">
          <p>
            Don't have an account? <span>Sign Up</span>
          </p>
        </div>

      </div>
    </div>
  );
};

export default Login;