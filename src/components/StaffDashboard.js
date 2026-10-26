import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./StaffDashboard.css";
import logo from "../assets/aksharam-logo.jpeg";


const StaffDashboard = () => {

  const navigate = useNavigate();

  const [showProfilePopup, setShowProfilePopup] = useState(true);


  // ================================
  // MAIN NAVIGATION ITEMS
  // ================================
  const menuItems = [
    {
      title: "Students",
      icon: "🎓",
      path: "/staff/students/manage",
    },
    {
      title: "Staff",
      icon: "👥",
      path: "/staff/staff/manage",
    },
    {
      title: "Events",
      icon: "📅",
      path: "/staff/events/manage",
    },
    {
      title: "Meetings",
      icon: "📝",
      path: "/staff/meetings/manage",
    },
    // {
    //   title: "Staff Work",
    //   icon: "💼",
    //   path: "/staff/staff-work/manage",
    // },
    {
      title: "Documents",
      icon: "📁",
      path: "/staff/documents/manage",
    },
    {
      title: "Accounts & Donations",
      icon: "💰",
      path: "/accounts",
    },
    {
      title: "Reports",
      icon: "📊",
      path: "/staff/reports/manage",
    },
    {
      title: "Notifications",
      icon: "🔔",
      path: "/staff/notifications/manage",
    },
  ];


  // ================================
  // NAVIGATION
  // ================================
  const handleNavigation = (path) => {
    navigate(path);
  };


  return (
    <div className="dashboard">

      {/* ================= NAVBAR ================= */}
      <header className="top-navbar">

        {/* Logo */}
        <div className="navbar-brand">
          <img src={logo} alt="Aksharam Trust" />
        </div>

                {/* Navigation */}
        <nav className="navbar-menu">

          {/* Dashboard */}
          <button
            className="nav-home active"
            onClick={() => navigate("/admin/dashboard")}
          >
            🏠 Home
          </button>

          {/* Main Modules */}
         {menuItems.map((menu) => (
            <button
              className="nav-module"
              key={menu.title}
              onClick={() => handleNavigation(menu.path)}
            >
              <span>{menu.icon}</span>
              <span>{menu.title}</span>
            </button>
          ))}

        </nav>

{/* ================= STAFF PROFILE ================= */}

<div className="navbar-right">

  <div className="staff-management">

    {/* Staff Profile */}
    <button className="staff-profile">

      <div className="avatar">
        S
      </div>

      <div className="staff-inftn">
        <strong>Staff</strong>
        <small>Position</small>
      </div>

    </button>


    {/* Staff Dropdown */}
    <div className="staff-dropdown">

      <button
        type="button"
        onClick={() => navigate("/staff/profile")}
      >
        👤 My Profile
      </button>

      <button
        type="button"
        onClick={() => navigate("/staff/view")}
      >
        👥 Complete profile
      </button>

    </div>

  </div>


  {/* Logout */}
  <button
    type="button"
    className="logout"
    title="logout"
    onClick={() => navigate("/login")}
  >
    ↪
  </button>

</div>
</header>
      {/* ================= MAIN CONTENT ================= */}
      <main className="main-content">

        <section className="about-us">

          {/* Left Side */}
          <div className="about-text">

            <span className="about-tag">
              ABOUT AKSHARAM TRUST
            </span>

            <h1>
              Empowering Communities,
              <br />
              <span>Building a Better Future</span>
            </h1>

            <p>
              Aksharam Trust is committed to creating opportunities
              and supporting the educational and social development
              of communities.
            </p>

            <p>
              Through educational programs, community initiatives,
              student support and various social activities, Aksharam
              Trust works towards creating a better and more empowered
              society.
            </p>

            <div className="about-buttons">

              <button className="read-more">
                READ MORE
              </button>

              <button className="contact-us">
                CONTACT US
              </button>

            </div>

          </div>


          {/* Right Side Logo */}
          <div className="about-logo">

            <div className="logo-circle">
              <img
                src={logo}
                alt="Aksharam Trust Logo"
              />
            </div>

          </div>

        </section>


        {/* About Cards */}
        <section className="about-cards">

          <div className="about-card">
            <div className="about-card-icon blue-icon">
              🎓
            </div>

            <div>
              <h3>Education</h3>
              <p>
                Supporting students and creating better
                educational opportunities.
              </p>
            </div>
          </div>


          <div className="about-card">
            <div className="about-card-icon orange-icon">
              🤝
            </div>

            <div>
              <h3>Community</h3>
              <p>
                Working together to create meaningful
                social impact.
              </p>
            </div>
          </div>


          <div className="about-card">
            <div className="about-card-icon sky-icon">
              🌱
            </div>

            <div>
              <h3>Development</h3>
              <p>
                Encouraging growth, opportunity and
                sustainable development.
              </p>
            </div>
          </div>

        </section>

      </main>
           

      {/* ================= PROFILE POPUP ================= */}

      {showProfilePopup && (
        <div className="profile-popup-overlay">

          <div className="profile-popup">

            <div className="profile-popup-icon">
              👤
            </div>

            <h2>Complete Your Staff Profile</h2>

            <p>
              Please complete your staff profile before
              continuing with your staff activities.
            </p>

            <button
              className="complete-profile-btn"
                onClick={() => navigate("/staff/profile-edit/${staffId}")}
            >
              Complete Profile
            </button>

            <button
              className="later-btn"
              onClick={() => setShowProfilePopup(false)}
            >
              Complete Later
            </button>

          </div>

        </div>
      )}

    </div>

  );
};

export default StaffDashboard;