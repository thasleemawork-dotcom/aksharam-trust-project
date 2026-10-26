import React from "react";
import { useNavigate } from "react-router-dom";
import "./AdminDashboard.css";
import logo from "../assets/aksharam-logo.jpeg";

const AdminDashboard = () => {
  const navigate = useNavigate();

  // ================================
  // MAIN NAVIGATION ITEMS
  // ================================
  const menuItems = [
    {
      title: "Students",
      icon: "🎓",
      path: "/admin/students/manage",
    },
    {
      title: "Staff",
      icon: "👥",
      path: "/admin/staff/manage",
    },
    {
      title: "Events",
      icon: "📅",
      path: "/admin/events/manage",
    },
    {
      title: "Meetings",
      icon: "📝",
      path: "/admin/meetings/manage",
    },
    // {
    //   title: "Staff Work",
    //   icon: "💼",
    //   path: "/admin/staff-work/manage",
    // },
    {
      title: "Documents",
      icon: "📁",
      path: "/admin/documents/manage",
    },
    {
      title: "Accounts & Donations",
      icon: "💰",
      path: "/admin/donations/manage",
    },
    {
      title: "Reports",
      icon: "📊",
      path: "/admin/reports/manage",
    },
    {
      title: "Notifications",
      icon: "🔔",
      path: "/admin/notifications/manage",
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

      {/* =================================
          TOP NAVBAR
      ================================= */}
      <header className="top-navbar">

        {/* Logo */}
        <div className="navbar-brand">
          <img
            src={logo}
            alt="Aksharam Trust"
          />
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

        {/* =================================
            ADMIN PROFILE
        ================================= */}
        <div className="navbar-right">

          <div className="admin-management">

            <button className="admin-profile">

              <div className="avatar">
                A
              </div>

              <div className="admin-info">
                <strong>Admin</strong>
                <small>Administrator</small>
              </div>


            </button>

            {/* Admin Dropdown */}
            <div className="admin-dropdown">

              <button
                onClick={() => navigate("/admin/profile")}
              >
                👤 My Profile
              </button>

              <button
                onClick={() => navigate("/admin/add")}
              >
                <span
                  style={{
                    color: "#075b98",
                    fontWeight: "bold",
                  }}
                >
                  ＋
                </span>
                Add Admin
              </button>

              <button
                onClick={() => navigate("/admin/view")}
              >
                👥 View Admins
              </button>

              <button
                className="logout-option"
                onClick={() => navigate("/login")}
              >
                ↪️ Logout
              </button>

            </div>

          </div>

        </div>

      </header>

      {/* =================================
          MAIN CONTENT
      ================================= */}
      <main className="main-content">

        {/* ABOUT SECTION */}
        <section className="about-us">

          {/* Left */}
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
              Aksharam Trust is committed to creating
              opportunities and supporting the educational
              and social development of communities.
            </p>

            <p>
              Through educational programs, community
              initiatives, student support and various
              social activities, Aksharam Trust works
              towards creating a better and more
              empowered society.
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

          {/* Right Logo */}
          <div className="about-logo">

            <div className="logo-circle">

              <img
                src={logo}
                alt="Aksharam Trust Logo"
              />

            </div>

          </div>

        </section>

        {/* =================================
            ABOUT CARDS
        ================================= */}
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

    </div>
  );
};

export default AdminDashboard;

