import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./ReportForm.css";
import logo from "../assets/aksharam-logo.jpeg";

const ReportForm = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Get the logged-in staff member.
  const staff = location.state?.staff;

  const uploadedBy =
    staff?.name ||
    sessionStorage.getItem("staffName") ||
    "Staff Member";

  // Get the current date and time.
  const now = new Date();

  const formatDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  };

  const formatTime = (date) =>
    date.toLocaleTimeString("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });

  const [formData, setFormData] = useState({
    projectName: "",
    uploadedBy,
    uploadedDate: formatDate(now),
    uploadedTime: formatTime(now),
    studentName: "",
    studentId: "",
  });

  const [generatedReport, setGeneratedReport] = useState(null);

  // Handle input changes.
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  // Generate and save the report.
  const handleSubmit = (e) => {
    e.preventDefault();

    const report = {
      ...formData,
      id: Date.now(),
    };

    try {
      const existingReports = JSON.parse(
        localStorage.getItem("aksharam_reports") || "[]"
      );

      existingReports.push(report);

      localStorage.setItem(
        "aksharam_reports",
        JSON.stringify(existingReports)
      );

      setGeneratedReport(report);

      alert("Report generated successfully!");
    } catch (error) {
      alert("Unable to save the report. Please try again.");
    }
  };

  // Reset the form while retaining staff details.
  const handleReset = () => {
    const currentTime = new Date();

    setFormData({
      projectName: "",
      uploadedBy,
      uploadedDate: formatDate(currentTime),
      uploadedTime: formatTime(currentTime),
      studentName: "",
      studentId: "",
    });

    setGeneratedReport(null);
  };

  return (
    <div className="report-page">

      {/* Navbar */}

      <header className="report-navbar">
        <div className="report-brand">
          <img src={logo} alt="Aksharam Trust Logo" />

          <div>
            <h2>Aksharam Trust</h2>
            <p>Education • Care • Compassion</p>
          </div>
        </div>

        <div className="report-user">
          <div className="report-avatar">
            {uploadedBy.charAt(0).toUpperCase()}
          </div>

          <div>
            <strong>{uploadedBy}</strong>
            <span>Staff Member</span>
          </div>
        </div>
      </header>

      {/* Main Form */}

      <main className="report-container">

        {/* Form Heading */}

        <div className="report-header">
          <div className="report-header-icon">📋</div>

          <div>
            <h1>Project Report Form</h1>
            <p>
              Record project information and associate it with a student.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit}>

          {/* Project Information */}

          <section className="report-section">

            <div className="report-section-title">
              <span>01</span>
              Project Information
            </div>

            <div className="report-grid">

              <div className="report-field">
                <label htmlFor="projectName">
                  Project Name <span>*</span>
                </label>

                <input
                  type="text"
                  id="projectName"
                  name="projectName"
                  placeholder="Enter project name"
                  value={formData.projectName}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="report-field">
                <label htmlFor="uploadedBy">
                  Uploaded By
                </label>

                <input
                  type="text"
                  id="uploadedBy"
                  name="uploadedBy"
                  value={formData.uploadedBy}
                  readOnly
                />

                <small>Automatically filled from your account.</small>
              </div>

              <div className="report-field">
                <label htmlFor="uploadedDate">
                  Uploaded Date
                </label>

                <input
                  type="date"
                  id="uploadedDate"
                  name="uploadedDate"
                  value={formData.uploadedDate}
                  readOnly
                />
              </div>

              <div className="report-field">
                <label htmlFor="uploadedTime">
                  Uploaded Time
                </label>

                <input
                  type="time"
                  id="uploadedTime"
                  name="uploadedTime"
                  value={formData.uploadedTime}
                  readOnly
                />
              </div>

            </div>
          </section>

          {/* Student Information */}

          <section className="report-section">

            <div className="report-section-title">
              <span>02</span>
              Student Information
            </div>

            <div className="report-grid">

              <div className="report-field">
                <label htmlFor="studentName">
                  Student Name <span>*</span>
                </label>

                <input
                  type="text"
                  id="studentName"
                  name="studentName"
                  placeholder="Enter student name"
                  value={formData.studentName}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="report-field">
                <label htmlFor="studentId">
                  Student ID <span>*</span>
                </label>

                <input
                  type="text"
                  id="studentId"
                  name="studentId"
                  placeholder="Enter student ID"
                  value={formData.studentId}
                  onChange={handleChange}
                  required
                />
              </div>

            </div>
          </section>

          {/* Action Buttons */}

          <div className="report-actions">

            <button
              type="button"
              className="report-reset-btn"
              onClick={handleReset}
            >
              ↻ Reset
            </button>

            <button
              type="submit"
              className="report-submit-btn"
            >
              📄 Generate Report
            </button>

          </div>
        </form>

        {/* Generated Report Preview */}

        {generatedReport && (
          <section className="generated-report">

            <div className="generated-report-heading">
              <h2>Report Generated Successfully</h2>
              <p>Review your report information below.</p>
            </div>

            <div className="generated-report-details">

              <p>
                <strong>Project Name:</strong>{" "}
                {generatedReport.projectName}
              </p>

              <p>
                <strong>Uploaded By:</strong>{" "}
                {generatedReport.uploadedBy}
              </p>

              <p>
                <strong>Uploaded Date:</strong>{" "}
                {generatedReport.uploadedDate}
              </p>

              <p>
                <strong>Uploaded Time:</strong>{" "}
                {generatedReport.uploadedTime}
              </p>

              <p>
                <strong>Student Name:</strong>{" "}
                {generatedReport.studentName}
              </p>

              <p>
                <strong>Student ID:</strong>{" "}
                {generatedReport.studentId}
              </p>

            </div>

            <button
              type="button"
              className="report-print-btn"
              onClick={() => window.print()}
            >
              🖨 Print Report
            </button>

          </section>
        )}

      </main>
    </div>
  );
};

export default ReportForm;