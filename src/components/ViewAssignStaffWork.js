import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./ViewAssignStaffWork.css";
import logo from "../assets/aksharam-logo.jpeg";

const ViewAssignStaffWork = ({ role }) => {
  const navigate = useNavigate();

  // ========================================
  // ROLE
  // ========================================

  const isAdmin = role === "admin";

  // ========================================
  // LOAD STAFF WORK
  // ========================================

 const [staffWork, setStaffWork] = useState(() => {
  try {
    const savedWork = localStorage.getItem("staffWork");

    if (!savedWork) {
      return [];
    }

    const parsedWork = JSON.parse(savedWork);

    return Array.isArray(parsedWork) ? parsedWork : [];
  } catch (error) {
    console.error("Error loading staff work:", error);
    return [];
  }
});

  // ========================================
  // SEARCH AND FILTER STATES
  // ========================================

  const [search, setSearch] = useState("");
  const [selectedStaff, setSelectedStaff] = useState("All");
  const [selectedStatus, setSelectedStatus] = useState("All");

  // ========================================
  // VIEW DETAILS MODAL
  // ========================================

  const [selectedWork, setSelectedWork] = useState(null);

  // ========================================
  // SAVE STAFF WORK
  // ========================================

 useEffect(() => {
  try {
    localStorage.setItem(
      "staffWork",
      JSON.stringify(staffWork)
    );
  } catch (error) {
    console.error("Unable to save staff work:", error);
  }
}, [staffWork]);

  // ========================================
  // STAFF OPTIONS
  // ========================================

  const staffOptions = [
    "All",
    ...new Set(
      staffWork
        .map((work) => work.staffMember)
        .filter(Boolean)
    ),
  ];

  // ========================================
  // STATUS OPTIONS
  // ========================================

  const statusOptions = [
    "All",
    "Pending",
    "In Progress",
    "Completed",
    "Overdue",
  ];

// ========================================
// GET EFFECTIVE WORK STATUS
// ========================================

const getWorkStatus = (work) => {
  // Completed tasks should never be marked overdue.
  if (work.status === "Completed") {
    return "Completed";
  }

  // Check whether the due date has passed.
  if (work.dueDate) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const dueDate = new Date(`${work.dueDate}T00:00:00`);

    if (
      !Number.isNaN(dueDate.getTime()) &&
      dueDate < today
    ) {
      return "Overdue";
    }
  }

  // Return the current valid status.
  if (["Pending", "In Progress"].includes(work.status)) {
    return work.status;
  }

  return "Pending";
};

  // ========================================
  // FILTER STAFF WORK
  // ========================================

  const filteredWork = staffWork.filter((work) => {
    const searchText = search.toLowerCase().trim();

    const matchesSearch =
      (work.staffMember || "")
        .toLowerCase()
        .includes(searchText) ||
      (work.title || "")
        .toLowerCase()
        .includes(searchText) ||
      (work.description || "")
        .toLowerCase()
        .includes(searchText);

    const matchesStaff =
      selectedStaff === "All" ||
      work.staffMember === selectedStaff;

    const matchesStatus =
      selectedStatus === "All" ||
      getWorkStatus(work) === selectedStatus;

    return matchesSearch && matchesStaff && matchesStatus;
  });

  // ========================================
  // SUMMARY COUNTS
  // ========================================

  const totalWork = staffWork.length;

  const pendingWork = staffWork.filter(
    (work) => getWorkStatus(work) === "Pending"
  ).length;

  const inProgressWork = staffWork.filter(
    (work) => getWorkStatus(work) === "In Progress"
  ).length;

  const completedWork = staffWork.filter(
    (work) => getWorkStatus(work) === "Completed"
  ).length;


  // ========================================
  // NAVIGATION
  // ========================================

  const handleHome = () => {
    if (isAdmin) {
      navigate("/admin/dashboard");
    } else {
      navigate("/staff/dashboard");
    }
  };

  const handleStaff = () => {
  navigate(isAdmin ? "/admin/staff/manage" : "/staff/staff/manage");
  };


  // ========================================
  // ASSIGN NEW WORK
  // ========================================

  const handleAddWork = () => {
    if (!isAdmin) return;

    navigate("/staff-assignwork/add");
  };

  // ========================================
  // EDIT WORK
  // ========================================

 const handleEdit = (work) => {
  if (!isAdmin) return;

  navigate(`/staff-assignwork/edit/${work.id}`, {
    state: { work : work },
  });
  };

  // ========================================
  // DELETE WORK
  // ========================================

  const handleDelete = (id) => {
    if (!isAdmin) return;

    const confirmDelete = window.confirm(
      "Are you sure you want to delete this work assignment?"
    );

    if (!confirmDelete) return;

    setStaffWork((previousWork) =>
      previousWork.filter((work) => work.id !== id)
    );

    if (selectedWork?.id === id) {
      setSelectedWork(null);
    }
  };

  // ========================================
  // RESET FILTERS
  // ========================================

  const handleReset = () => {
    setSearch("");
    setSelectedStaff("All");
    setSelectedStatus("All");
  };

  // ========================================
  // FORMAT DATE
  // ========================================

const formatDate = (date) => {
  if (!date) return "—";

  const datePart = String(date).slice(0, 10);
  const parsedDate = new Date(`${datePart}T00:00:00`);

  if (Number.isNaN(parsedDate.getTime())) {
    return date;
  }

  return parsedDate.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

  // ========================================
  // RENDER PAGE
  // ========================================

  return (
    <div className="dashboard">

      {/* ================= NAVBAR ================= */}

<header className="top-navbar">
  <div className="navbar-brand">
    <img src={logo} alt="Aksharam Trust" />
  </div>

  <nav className="navbar-menu">
    {/* HOME */}
    <button
      type="button"
      className="nav-home"
       onClick={handleHome}
    >
      🏠 Home
    </button>

    {/* STAFF */}
    <button
      type="button"
      className="nav-module"
      onClick={handleStaff}
    >
      👥 Staff
    </button>

    {/* STAFF WORK */}
    <button
      type="button"
      className="nav-module  active"
      onClick={() => navigate("/staff-assignwork/manage")}
    >
      📋 Assign Work
    </button>

    {/* STAFF ATTENDANCE */}
    <button
      type="button"
      className="nav-module"
      onClick={() => navigate("/staff-attendance/manage")}
    >
      🕒 Attendance
    </button>

    {/* STAFF DIARY */}
    <button
      type="button"
      className="nav-module"
      onClick={() => navigate("/staff-diary/manage")}
    >
      📔 To-Do
    </button>
  </nav>
</header>   

      {/* ================= PAGE CONTENT ================= */}

      <main className="view-work-page">

        {/* ================= PAGE HEADER ================= */}

        <section className="work-page-header">

          <div>
            <h1>💼 Staff Work Management</h1>

            <p>
              {isAdmin
                ? "Assign, monitor, and manage staff work assignments."
                : "View assigned work and track task deadlines."}
            </p>
          </div>

          {/* ADMIN ONLY */}

          {isAdmin && (
            <button
              type="button"
              className="add-work-btn"
              onClick={handleAddWork}
            >
              ✚ Assign Work
            </button>
          )}

        </section>

        {/* ================= SUMMARY CARDS ================= */}

        <section className="work-summary-cards">

          <div className="work-summary-card">
            <div className="work-summary-icon">📋</div>

            <div>
              <span>Total Assignments</span>
              <strong>{totalWork}</strong>
            </div>
          </div>

          <div className="work-summary-card">
            <div className="work-summary-icon pending-icon">⏳</div>

            <div>
              <span>Pending</span>
              <strong>{pendingWork}</strong>
            </div>
          </div>

          <div className="work-summary-card">
            <div className="work-summary-icon progress-icon">🔄</div>

            <div>
              <span>In Progress</span>
              <strong>{inProgressWork}</strong>
            </div>
          </div>

          <div className="work-summary-card">
            <div className="work-summary-icon completed-icon">✅</div>

            <div>
              <span>Completed</span>
              <strong>{completedWork}</strong>
            </div>
          </div>

        </section>

        {/* ================= FILTER SECTION ================= */}

        <section className="work-filter-section">

          {/* SEARCH */}

          <div className="work-search-box">
            <span>🔍</span>

            <input
              type="text"
              placeholder="Search by staff name, title or description..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {/* STAFF FILTER */}

          <select
            className="work-filter-select"
            value={selectedStaff}
            onChange={(e) => setSelectedStaff(e.target.value)}
            aria-label="Filter by staff member"
          >
            {staffOptions.map((staff) => (
              <option key={staff} value={staff}>
                {staff === "All" ? "All Staff Members" : staff}
              </option>
            ))}
          </select>

          {/* STATUS FILTER */}

          <select
            className="work-filter-select"
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            aria-label="Filter by work status"
          >
            {statusOptions.map((status) => (
              <option key={status} value={status}>
                {status === "All" ? "All Statuses" : status}
              </option>
            ))}
          </select>

          {/* RESET */}

          {(search ||
            selectedStaff !== "All" ||
            selectedStatus !== "All") && (
            <button
              type="button"
              className="reset-work-filter"
              onClick={handleReset}
            >
              ↻ Reset
            </button>
          )}

        </section>

        {/* ================= TABLE ================= */}

        <section className="work-table-container">

          <div className="work-table-heading">
            <div>
              <h2>Assigned Work List</h2>

              <span>
                Showing {filteredWork.length} of {staffWork.length} assignments
              </span>
            </div>
          </div>

          <div className="work-table-responsive">

            <table className="assigned-work-table">

              <thead>
                <tr>
                  <th>#</th>
                  <th>Staff Member</th>
                  <th>Work Title</th>
                  <th>Assigned Date</th>
                  <th>Due Date</th>
                  <th>Status</th>
                  <th>Description</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>

                {filteredWork.length > 0 ? (

                  filteredWork.map((work, index) => {
                    const status = getWorkStatus(work);

                    return (
                      <tr key={work.id}>

                        <td>{index + 1}</td>

                        <td>
                          <div className="work-staff-cell">
                            <div className="work-staff-avatar">
                              {(work.staffMember || "S")
                                .charAt(0)
                                .toUpperCase()}
                            </div>

                            <strong>{work.staffMember || "—"}</strong>
                          </div>
                        </td>

                        <td>
                          <strong className="work-title">
                            {work.title || "Untitled Work"}
                          </strong>
                        </td>

                        <td>
                          {work.assignedDate
                            ? formatDate(work.assignedDate.slice(0, 10))
                            : "—"}
                        </td>

                        <td>
                          <span
                            className={`work-due-date ${
                              status === "Overdue" ? "due-overdue" : ""
                            }`}
                          >
                            {formatDate(work.dueDate)}
                          </span>
                        </td>

                        <td>
                          <span
                            className={`work-status-badge ${status
                              .toLowerCase()
                              .replace(/\s+/g, "-")}`}
                          >
                            {status}
                          </span>
                        </td>

                        <td>
                          <div className="work-description-cell">
                            {work.description || "—"}
                          </div>
                        </td>

                        <td>
                          <div className="work-action-buttons">

                            <button
                              type="button"
                              className="work-view-btn"
                              title="View Work Details"
                              onClick={() => setSelectedWork(work)}
                            >
                              👁
                            </button>

                            {isAdmin && (
                              <>
                                <button
                                  type="button"
                                  className="work-edit-btn"
                                  title="Edit Work"
                                  onClick={() => handleEdit(work)}
                                >
                                  ✎
                                </button>

                                <button
                                  type="button"
                                  className="work-delete-btn"
                                  title="Delete Work"
                                  onClick={() => handleDelete(work.id)}
                                >
                                  🗑
                                </button>
                              </>
                            )}

                          </div>
                        </td>

                      </tr>
                    );
                  })

                ) : (

                  <tr>
                    <td colSpan="8" className="no-work-found">
                      <div>
                        <span>💼</span>
                        <h3>No Work Assignments Found</h3>
                        <p>
                          No assignments match your current search or filters.
                        </p>
                      </div>
                    </td>
                  </tr>

                )}

              </tbody>

            </table>

          </div>

        </section>

      </main>

      {/* ================= VIEW DETAILS MODAL ================= */}

      {selectedWork && (
        <div
          className="work-modal-overlay"
          onClick={() => setSelectedWork(null)}
        >
          <div
            className="work-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="work-modal-title"
            onClick={(e) => e.stopPropagation()}
          >

            <div className="work-modal-header">
              <div>
                <span className="work-modal-eyebrow">STAFF WORK DETAILS</span>
                <h2 id="work-modal-title">
                  {selectedWork.title || "Untitled Work"}
                </h2>
              </div>

              <button
                type="button"
                className="work-modal-close"
                onClick={() => setSelectedWork(null)}
                aria-label="Close work details"
              >
                ×
              </button>
            </div>

            <div className="work-modal-body">

              <div className="work-detail-item">
                <span>Staff Member</span>
                <strong>{selectedWork.staffMember || "—"}</strong>
              </div>

              <div className="work-detail-item">
                <span>Assigned Date</span>
                <strong>
                  {selectedWork.assignedDate
                    ? formatDate(selectedWork.assignedDate.slice(0, 10))
                    : "—"}
                </strong>
              </div>

              <div className="work-detail-item">
                <span>Due Date</span>
                <strong>{formatDate(selectedWork.dueDate)}</strong>
              </div>

              <div className="work-detail-item">
                <span>Status</span>
                <strong>{getWorkStatus(selectedWork)}</strong>
              </div>

              <div className="work-detail-description">
                <span>Description</span>
                <p>{selectedWork.description || "No description provided."}</p>
              </div>

            </div>

            <div className="work-modal-footer">
              <button
                type="button"
                onClick={() => setSelectedWork(null)}
              >
                Close
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};

export default ViewAssignStaffWork;