import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./ViewStudents.css";
import "./ViewReport.css";
import logo from "../assets/aksharam-logo.jpeg";

const ViewReport = ({ role = "staff" }) => {
  const navigate = useNavigate();

  const isAdmin = role === "admin";

  // Search and filter states
  const [search, setSearch] = useState("");
  const [selectedDate, setSelectedDate] = useState("");

  // Selected report for viewing
  const [selectedReport, setSelectedReport] = useState(null);

  // Load reports from localStorage
  const [reports, setReports] = useState(() => {
    try {
      const savedReports = localStorage.getItem("aksharam_reports");
      return savedReports ? JSON.parse(savedReports) : [];
    } catch (error) {
      console.error("Error loading reports:", error);
      return [];
    }
  });

  // Save reports whenever the list changes
  useEffect(() => {
    localStorage.setItem("aksharam_reports", JSON.stringify(reports));
  }, [reports]);

  // Today's date
  const today = new Date().toISOString().split("T")[0];

  // Helper to support common field names
  const getReportDate = (report) =>
    report.uploadedDate ||
    report.uploadingDate ||
    report.date ||
    "";

  const getReportTime = (report) =>
    report.uploadedTime ||
    report.uploadingTime ||
    report.time ||
    "";

  // Search and filter reports
  const filteredReports = reports.filter((report) => {
    const searchText = search.toLowerCase();

    const matchesSearch = [
      report.projectName,
      report.uploadedBy,
      report.staffName,
      report.studentName,
      report.studentId,
    ].some((value) =>
      String(value || "").toLowerCase().includes(searchText)
    );

    const matchesDate =
      selectedDate === "" || getReportDate(report) === selectedDate;

    return matchesSearch && matchesDate;
  });

  // Summary values
  const totalReports = reports.length;

  const totalProjects = new Set(
    reports
      .map((report) => report.projectName)
      .filter(Boolean)
      .map((name) => name.toLowerCase())
  ).size;

  const totalStudents = new Set(
    reports
      .map((report) => report.studentId || report.studentName)
      .filter(Boolean)
  ).size;

  const todayReports = reports.filter(
    (report) => getReportDate(report) === today
  ).length;

  // Navigate to add report form
  const handleAddReport = () => {
    navigate("/reports/student-project");
  };

  // Edit report
  const handleEdit = (report) => {
    navigate("/reports/student-project", {
      state: { report },
    });
  };

  // Delete report
  const handleDelete = (report) => {
    const confirmDelete = window.confirm(
      `Are you sure you want to delete the report for "${report.projectName || "this project"}"?`
    );

    if (!confirmDelete) return;

    setReports((previousReports) =>
      previousReports.filter((item) => item.id !== report.id)
    );
  };

  // Home navigation
  const handleHome = () => {
    navigate(isAdmin ? "/admin/dashboard" : "/staff/dashboard");
  };

  // Format date for display
  const formatDate = (date) => {
    if (!date) return "—";

    const parsedDate = new Date(`${date}T00:00:00`);

    if (Number.isNaN(parsedDate.getTime())) return date;

    return parsedDate.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="dashboard">
      {/* TOP NAVBAR */}
      <header className="top-navbar">
        <div className="navbar-brand">
          <img src={logo} alt="Aksharam Trust" />
        </div>

        <nav className="navbar-menu">
          <button className="nav-home" onClick={handleHome}>
            <span>🏠</span>
            <span>Home</span>
          </button>

          <button
            className="nav-module active"
            onClick={() => navigate("/reports/student-project")}
          >
            <span>📊</span>
            <span>Reports</span>
          </button>
        </nav>
      </header>

      {/* MAIN PAGE */}
      <main className="view-students-page view-report-page">
        {/* PAGE HEADER */}
        <section className="students-header">
          <div>
            <h2>📊 View Reports</h2>
            <p>
              View, search, and manage student project reports
              submitted to Aksharam Trust.
            </p>
          </div>

          <button className="add-student-btn" onClick={handleAddReport}>
            ✚ Add Report
          </button>
        </section>

        {/* SUMMARY CARDS */}
        <section className="student-summary-cards report-summary-cards">
          <div className="student-summary-card">
            <div className="summary-card-icon">📁</div>
            <div>
              <span>Total Reports</span>
              <strong>{totalReports}</strong>
            </div>
          </div>

          <div className="student-summary-card">
            <div className="summary-card-icon">📚</div>
            <div>
              <span>Total Projects</span>
              <strong>{totalProjects}</strong>
            </div>
          </div>

          <div className="student-summary-card">
            <div className="summary-card-icon">🎓</div>
            <div>
              <span>Students Covered</span>
              <strong>{totalStudents}</strong>
            </div>
          </div>

          <div className="student-summary-card">
            <div className="summary-card-icon">📅</div>
            <div>
              <span>Uploaded Today</span>
              <strong>{todayReports}</strong>
            </div>
          </div>
        </section>

        {/* SEARCH AND FILTER */}
        <section className="student-filter-section report-filter-section">
          <div className="search-box">
            <span>🔍</span>
            <input
              type="text"
              placeholder="Search by project, student, ID or staff..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </div>

          <input
            className="report-date-filter"
            type="date"
            aria-label="Filter reports by upload date"
            value={selectedDate}
            onChange={(event) => setSelectedDate(event.target.value)}
          />

          {(search || selectedDate) && (
            <button
              className="reset-filter-btn"
              onClick={() => {
                setSearch("");
                setSelectedDate("");
              }}
            >
              ↻ Reset
            </button>
          )}
        </section>

        {/* REPORT TABLE */}
        <section className="students-table-container">
          <div className="table-heading">
            <div>
              <h3>Student Project Reports</h3>
              <span>
                Showing {filteredReports.length} of {totalReports} reports
              </span>
            </div>
          </div>

          <div className="table-responsive">
            <table className="students-table report-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Project Name</th>
                  <th>Uploaded By</th>
                  <th>Uploaded Date</th>
                  <th>Uploaded Time</th>
                  <th>Student Name</th>
                  <th>Student ID</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {filteredReports.length > 0 ? (
                  filteredReports.map((report, index) => (
                    <tr key={report.id ?? `${report.studentId}-${index}`}>
                      <td>{index + 1}</td>

                      <td>
                        <div className="report-project-cell">
                          <div className="report-project-icon">📄</div>
                          <strong>{report.projectName || "Untitled Project"}</strong>
                        </div>
                      </td>

                      <td>
                        {report.uploadedBy ||
                          report.staffName ||
                          "—"}
                      </td>

                      <td>{formatDate(getReportDate(report))}</td>

                      <td>{getReportTime(report) || "—"}</td>

                      <td>{report.studentName || "—"}</td>

                      <td>
                        <span className="report-student-id">
                          {report.studentId || "—"}
                        </span>
                      </td>

                      <td>
                        <div className="action-buttons">
                          <button
                            className="view-btn"
                            title="View Report"
                            onClick={() => setSelectedReport(report)}
                          >
                            👁
                          </button>

                          <button
                            className="edit-btn"
                            title="Edit Report"
                            onClick={() => handleEdit(report)}
                          >
                            ✎
                          </button>

                          <button
                            className="delete-btn"
                            title="Delete Report"
                            onClick={() => handleDelete(report)}
                          >
                            🗑
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="8" className="no-students">
                      <div>
                        <span>📊</span>
                        <h3>No Reports Found</h3>
                        <p>
                          {reports.length === 0
                            ? "No reports have been added yet. Click Add Report to create one."
                            : "No reports match your search or selected date."}
                        </p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>

        {/* VIEW REPORT MODAL */}
        {selectedReport && (
          <div
            className="report-modal-overlay"
            onClick={() => setSelectedReport(null)}
          >
            <section
              className="report-modal"
              role="dialog"
              aria-modal="true"
              aria-labelledby="report-modal-title"
              onClick={(event) => event.stopPropagation()}
            >
              <div className="report-modal-header">
                <div>
                  <h3 id="report-modal-title">Report Details</h3>
                  <p>Student project report information</p>
                </div>

                <button
                  className="report-modal-close"
                  onClick={() => setSelectedReport(null)}
                  aria-label="Close report details"
                >
                  ×
                </button>
              </div>

              <div className="report-details-grid">
                <div>
                  <span>Project Name</span>
                  <strong>{selectedReport.projectName || "—"}</strong>
                </div>

                <div>
                  <span>Uploaded By</span>
                  <strong>
                    {selectedReport.uploadedBy ||
                      selectedReport.staffName ||
                      "—"}
                  </strong>
                </div>

                <div>
                  <span>Uploaded Date</span>
                  <strong>
                    {formatDate(getReportDate(selectedReport))}
                  </strong>
                </div>

                <div>
                  <span>Uploaded Time</span>
                  <strong>{getReportTime(selectedReport) || "—"}</strong>
                </div>

                <div>
                  <span>Student Name</span>
                  <strong>{selectedReport.studentName || "—"}</strong>
                </div>

                <div>
                  <span>Student ID</span>
                  <strong>{selectedReport.studentId || "—"}</strong>
                </div>
              </div>

              <div className="report-modal-footer">
                <button
                  className="report-close-btn"
                  onClick={() => setSelectedReport(null)}
                >
                  Close
                </button>

                <button
                  className="report-edit-btn"
                  onClick={() => handleEdit(selectedReport)}
                >
                  ✎ Edit Report
                </button>
              </div>
            </section>
          </div>
        )}
      </main>
    </div>
  );
};

export default ViewReport;