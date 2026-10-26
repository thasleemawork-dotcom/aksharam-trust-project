import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./ViewMeetingMinutes.css";
import logo from "../assets/aksharam-logo.jpeg";

const STORAGE_KEY = "aksharam_meeting_minutes";

const ViewMeetingMinutes = ({ role = "staff" }) => {
  const navigate = useNavigate();

  const isStaff = role === "staff";
  const isAdmin = role === "admin";

  /* =========================================
     STATES
  ========================================= */

  const [meetings, setMeetings] = useState(() => {
    try {
      const savedMeetings = localStorage.getItem(STORAGE_KEY);

      return savedMeetings ? JSON.parse(savedMeetings) : [];
    } catch (error) {
      console.error("Error loading meeting minutes:", error);
      return [];
    }
  });

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [selectedMonth, setSelectedMonth] = useState("All");
  const [selectedYear, setSelectedYear] = useState("All");
  const [selectedMeeting, setSelectedMeeting] = useState(null);

  /* =========================================
     MONTH OPTIONS
  ========================================= */

  const monthOptions = [
    { value: "1", label: "January" },
    { value: "2", label: "February" },
    { value: "3", label: "March" },
    { value: "4", label: "April" },
    { value: "5", label: "May" },
    { value: "6", label: "June" },
    { value: "7", label: "July" },
    { value: "8", label: "August" },
    { value: "9", label: "September" },
    { value: "10", label: "October" },
    { value: "11", label: "November" },
    { value: "12", label: "December" },
  ];

  
   // ===================
  const loadMeetings = () => {
  try {
    const savedMeetings = localStorage.getItem(STORAGE_KEY);

    if (!savedMeetings) {
      return [];
    }

    const parsedMeetings = JSON.parse(savedMeetings);

    return Array.isArray(parsedMeetings)
      ? parsedMeetings
      : [];
  } catch (error) {
    console.error("Error loading meeting minutes:", error);
    return [];
  }
};

  /* =========================================
     SAVE MEETINGS
  ========================================= */

  useEffect(() => {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(meetings)
      );
    } catch (error) {
      console.error("Error saving meeting minutes:", error);
      alert(
        "Unable to save meeting records. Storage may be full."
      );
    }
  }, [meetings]);


// ===============

  useEffect(() => {
  const refreshMeetings = () => {
    setMeetings(loadMeetings());
  };

  // Refresh when the browser tab becomes active.
  window.addEventListener("focus", refreshMeetings);

  return () => {
    window.removeEventListener("focus", refreshMeetings);
  };
}, []);

  /* =========================================
     HELPER FUNCTIONS
  ========================================= */

  const getParticipants = (participants) => {
    if (Array.isArray(participants)) {
      return participants.join(", ");
    }

    return participants || "";
  };

  const getMeetingId = (meeting) => {
    return meeting.id;
  };

  const getDecision = (meeting) => {
    return (
      meeting.decisionMade ||
      meeting.decisionsMade ||
      "-"
    );
  };

  /* =========================================
   GET MEETING IMAGES
========================================= */

const getMeetingImages = (meeting) => {
  if (!meeting) return [];

  // Support different image property names.
  const imageData =
    meeting.images ||
    meeting.meetingImage ||
    meeting.image ||
    meeting.photo;

  if (!imageData) return [];

  // Multiple images stored as an array.
  if (Array.isArray(imageData)) {
    return imageData.filter(Boolean);
  }

  // Single image stored as a string.
  if (typeof imageData === "string") {
    return [imageData];
  }

  // Image object containing a URL or Base64 data.
  if (typeof imageData === "object") {
    const imageUrl =
      imageData.preview ||
      imageData.data ||
      imageData.url;

    return imageUrl ? [imageUrl] : [];
  }

  return [];
};

  const formatDate = (date) => {
    if (!date) return "-";

    // Handle YYYY-MM-DD without timezone conversion.
    const dateString = String(date);
    const parts = dateString.split("-");

    if (
      parts.length === 3 &&
      parts[0].length === 4
    ) {
      return `${parts[2]}-${parts[1]}-${parts[0]}`;
    }

    return dateString;
  };

  const parseMeetingDate = (date) => {
    if (!date) return null;

    // Parse YYYY-MM-DD in local time.
    const dateString = String(date).trim();
    const parts = dateString.split("-");

    if (
      parts.length === 3 &&
      parts[0].length === 4
    ) {
      const year = Number(parts[0]);
      const month = Number(parts[1]);
      const day = Number(parts[2]);

      const parsedDate = new Date(year, month - 1, day);

      // Reject invalid calendar dates.
      if (
        parsedDate.getFullYear() !== year ||
        parsedDate.getMonth() !== month - 1 ||
        parsedDate.getDate() !== day
      ) {
        return null;
      }

      return parsedDate;
    }

    // Fallback for other date formats.
    const parsedDate = new Date(dateString);

    return Number.isNaN(parsedDate.getTime())
      ? null
      : parsedDate;
  };

  const formatTime = (time) => {
    if (!time) return "-";

    const timeString = String(time);

    // Support HH:mm or HH:mm:ss.
    const match = timeString.match(
      /^(\d{1,2}):(\d{2})(?::\d{2})?$/
    );

    if (!match) return timeString;

    const hours = Number(match[1]);
    const minutes = Number(match[2]);

    if (
      hours < 0 ||
      hours > 23 ||
      minutes < 0 ||
      minutes > 59
    ) {
      return timeString;
    }

    const date = new Date();
    date.setHours(hours, minutes, 0, 0);

    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const normalizeStatus = (status) => {
    return String(status || "")
      .trim()
      .toLowerCase();
  };

  const getMeetingStatus = (meeting) => {
    return meeting.status || "Not Set";
  };

  /* =========================================
     STATUS COUNTS
  ========================================= */

  const completedCount = meetings.filter((meeting) =>
    normalizeStatus(meeting.status).includes("completed")
  ).length;

  const pendingCount = meetings.filter((meeting) =>
    normalizeStatus(meeting.status).includes("pending")
  ).length;

  const inProgressCount = meetings.filter((meeting) => {
    const status = normalizeStatus(meeting.status);

    return (
      status.includes("progress") ||
      status === "ongoing"
    );
  }).length;

  /* =========================================
     SEARCH AND FILTER
  ========================================= */

  const filteredMeetings = meetings.filter((meeting) => {
    const search = searchTerm.trim().toLowerCase();

    const participants = getParticipants(
      meeting.participants
    ).toLowerCase();

    const meetingTitle = String(
      meeting.meetingTitle || ""
    ).toLowerCase();

    const facilitator = String(
      meeting.facilitator || ""
    ).toLowerCase();

    const meetingDate = String(
      meeting.date || ""
    ).toLowerCase();

    const formattedDate = formatDate(
      meeting.date
    ).toLowerCase();

    const status = normalizeStatus(meeting.status);

    /* SEARCH FILTER */

    const matchesSearch =
      meetingTitle.includes(search) ||
      facilitator.includes(search) ||
      participants.includes(search) ||
      meetingDate.includes(search) ||
      formattedDate.includes(search) ||
      status.includes(search);

    /* STATUS FILTER */

    const matchesStatus =
      selectedStatus === "All" ||
      status === normalizeStatus(selectedStatus);

    /* MONTH AND YEAR FILTER */

    const parsedDate = parseMeetingDate(meeting.date);

    const matchesMonth =
      selectedMonth === "All" ||
      (
        parsedDate &&
        parsedDate.getMonth() + 1 ===
          Number(selectedMonth)
      );

    const matchesYear =
      selectedYear === "All" ||
      (
        parsedDate &&
        parsedDate.getFullYear() ===
          Number(selectedYear)
      );

    return (
      matchesSearch &&
      matchesStatus &&
      matchesMonth &&
      matchesYear
    );
  });

  /* =========================================
     NAVIGATION
  ========================================= */

  const handleHome = () => {
    if (isAdmin) {
      navigate("/admin/dashboard");
    } else {
      navigate("/staff/dashboard");
    }
  };

  const handleStudents = () => {
    if (isAdmin) {
      navigate("/admin/students/manage");
    } else {
      navigate("/staff/students/manage");
    }
  };

  const handleAddMeeting = () => {
    if (!isStaff) return;

    navigate("/meetings/add");
  };

  /* =========================================
     VIEW MEETING
  ========================================= */

  const handleView = (meeting) => {
    setSelectedMeeting(meeting);
  };

  /* =========================================
     EDIT MEETING
  ========================================= */

  const handleEdit = (meeting) => {
    if (!isStaff) return;

    navigate(`/meetings/edit/${getMeetingId(meeting)}`, {
      state: {
        meeting,
      },
    });
  };

  /* =========================================
     DELETE MEETING
  ========================================= */

  const handleDelete = (meeting) => {
    if (!isStaff) return;

    const meetingId = getMeetingId(meeting);

    const confirmDelete = window.confirm(
      "Are you sure you want to delete this meeting minutes record?"
    );

    if (!confirmDelete) return;

    setMeetings((previousMeetings) =>
      previousMeetings.filter(
        (item) => getMeetingId(item) !== meetingId
      )
    );

    if (
      selectedMeeting &&
      getMeetingId(selectedMeeting) === meetingId
    ) {
      setSelectedMeeting(null);
    }

    alert("Meeting minutes deleted successfully!");
  };

  /* =========================================
     RESET FILTERS
  ========================================= */

  const handleResetFilters = () => {
    setSearchTerm("");
    setSelectedStatus("All");
    setSelectedMonth("All");
    setSelectedYear("All");
  };

  const hasActiveFilters =
    searchTerm.trim() !== "" ||
    selectedStatus !== "All" ||
    selectedMonth !== "All" ||
    selectedYear !== "All";

  /* =========================================
     REPORT CONTENT
  ========================================= */

  const reportText = (report, key, fallback) => {
    if (!report) return fallback;

    if (typeof report === "string") {
      return report;
    }

    return report[key] || fallback;
  };

  /* =========================================
     RENDER
  ========================================= */

  return (
    <div className="dashboard">

      {/* =====================================
          TOP NAVBAR
      ===================================== */}

      <header className="top-navbar">

        <div className="navbar-brand">
          <img
            src={logo}
            alt="Aksharam Trust"
          />
        </div>

        <nav className="navbar-menu">

          <button
            type="button"
            className="nav-home"
            onClick={handleHome}
          >
            <span>🏠</span>
            <span>Home</span>
          </button>

          <button
            type="button"
            className="nav-module active"
            onClick={() => {
              if (isAdmin) {
                navigate("/admin/meetings/manage");
              } else {
                navigate("/staff/meetings/manage");
              }
            }}
          >
            <span>📋</span>
            <span>Meeting Minutes</span>
          </button>

        </nav>

      </header>

      {/* =====================================
          MAIN PAGE
      ===================================== */}

      <main className="view-meetings-page">

        {/* PAGE HEADER */}

        <section className="meetings-header">

          <div>
            <h2>📋 View Meeting Minutes</h2>

            <p>
              View, search and manage recorded meeting minutes.
            </p>
          </div>

          {isStaff && (
            <button
              type="button"
              className="add-meeting-btn"
              onClick={handleAddMeeting}
            >
              ✚ Add Meeting Minutes
            </button>
          )}

        </section>

        {/* =====================================
            SUMMARY CARDS
        ===================================== */}

        <section className="meeting-summary-cards">

          <div className="meeting-summary-card">
            <div className="meeting-summary-icon">
              📋
            </div>

            <div>
              <span>Total Meetings</span>
              <strong>{meetings.length}</strong>
            </div>
          </div>

          <div className="meeting-summary-card">
            <div className="meeting-summary-icon completed-icon">
              ✓
            </div>

            <div>
              <span>Completed</span>
              <strong>{completedCount}</strong>
            </div>
          </div>

          <div className="meeting-summary-card">
            <div className="meeting-summary-icon pending-icon">
              ⏳
            </div>

            <div>
              <span>Pending</span>
              <strong>{pendingCount}</strong>
            </div>
          </div>

          <div className="meeting-summary-card">
            <div className="meeting-summary-icon progress-icon">
              🔄
            </div>

            <div>
              <span>In Progress</span>
              <strong>{inProgressCount}</strong>
            </div>
          </div>

        </section>

        {/* =====================================
            FILTER SECTION
        ===================================== */}

        <section className="meeting-filter-section">

          {/* SEARCH */}

          <div className="meeting-search-box">
            <span>🔍</span>

            <input
              type="text"
              placeholder="Search title, facilitator, participants or date..."
              value={searchTerm}
              onChange={(event) =>
                setSearchTerm(event.target.value)
              }
              aria-label="Search meeting minutes"
            />
          </div>

          {/* MONTH FILTER */}

          <select
            className="event-location-filter"
            value={selectedMonth}
            onChange={(event) =>
              setSelectedMonth(event.target.value)
            }
            aria-label="Filter by month"
          >
            <option value="All">📅 All Months</option>

            {monthOptions.map((month) => (
              <option
                key={month.value}
                value={month.value}
              >
                {month.label}
              </option>
            ))}
          </select>

          {/* YEAR FILTER */}

          <input
            type="number"
            className="event-year-filter"
            value={
              selectedYear === "All"
                ? ""
                : selectedYear
            }
            onChange={(event) => {
              const value = event.target.value;

              setSelectedYear(
                value === "" ? "All" : value
              );
            }}
            placeholder="Enter year"
            min="1900"
            max="2100"
            aria-label="Filter by year"
          />

          {/* STATUS FILTER */}

          <select
            className="meeting-status-filter"
            value={selectedStatus}
            onChange={(event) =>
              setSelectedStatus(event.target.value)
            }
            aria-label="Filter meetings by status"
          >
            <option value="All">All Statuses</option>
            <option value="Pending">Pending</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
            <option value="Ongoing">Ongoing</option>
          </select>

          {/* RESET */}

          {hasActiveFilters && (
            <button
              type="button"
              className="meeting-reset-btn"
              onClick={handleResetFilters}
            >
              ↻ Reset
            </button>
          )}

        </section>

        {/* =====================================
            TABLE CONTAINER
        ===================================== */}

        <section className="meetings-table-container">

          <div className="meetings-table-heading">

            <div>
              <h3>Meeting Minutes List</h3>

              <span>
                Showing {filteredMeetings.length} of{" "}
                {meetings.length} meetings
              </span>
            </div>

          </div>

          <div className="meetings-table-responsive">

            <table className="meetings-table">

              <thead>
                <tr>
                  <th>#</th>
                  <th>Meeting Title</th>
                  <th>Date</th>
                  <th>Time</th>
                  <th>Facilitator</th>
                  <th>Status</th>
                  <th>Participants</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>

                {filteredMeetings.length > 0 ? (

                  filteredMeetings.map((meeting, index) => {

                    const participants = getParticipants(
                      meeting.participants
                    );

                    const participantNames = participants
                      .split(",")
                      .map((name) => name.trim())
                      .filter(Boolean);

                    const statusClass = normalizeStatus(
                      meeting.status
                    ).replace(/\s+/g, "-");

                    return (
                      <tr
                        key={
                          getMeetingId(meeting) ??
                          `${meeting.meetingTitle}-${meeting.date}-${index}`
                        }
                      >

                        <td>{index + 1}</td>

                        {/* MEETING TITLE */}

                        <td>
                          <div className="meeting-title-cell">

                            {getMeetingImages(meeting).length > 0 ? (
                              <img
                                className="meeting-thumbnail"
                                src={getMeetingImages(meeting)[0]}
                                alt="Meeting attachment"
                                onError={(event) => {
                                  event.currentTarget.style.display = "none";
                                }}
                              />
                            ) : (
                              <div className="meeting-avatar">
                                📋
                              </div>
                            )}

                            <div>
                              <strong>
                                {meeting.meetingTitle ||
                                  "Untitled Meeting"}
                              </strong>

                              <small>
                                Meeting Minutes
                              </small>
                            </div>

                          </div>
                        </td>

                        {/* DATE */}

                        <td>
                          {formatDate(meeting.date)}
                        </td>

                        {/* TIME */}

                        <td>
                          {formatTime(meeting.time)}
                        </td>

                        {/* FACILITATOR */}

                        <td>
                          {meeting.facilitator || "-"}
                        </td>

                        {/* STATUS */}

                        <td>
                          <span
                            className={`meeting-status-badge ${statusClass}`}
                          >
                            {getMeetingStatus(meeting)}
                          </span>
                        </td>

                        {/* PARTICIPANTS */}

                        <td>
                          <div className="meeting-participants-cell">

                            {participantNames.length > 0
                              ? participantNames
                                  .slice(0, 2)
                                  .join(", ")
                              : "-"}

                            {participantNames.length > 2 && (
                              <span className="more-participants">
                                {" "}
                                +{participantNames.length - 2}
                              </span>
                            )}

                          </div>
                        </td>

                        {/* ACTIONS */}

                        <td>
                          <div className="meeting-action-buttons">

                            <button
                              type="button"
                              className="meeting-view-btn"
                              title="View Meeting Details"
                              aria-label="View meeting details"
                              onClick={() => handleView(meeting)}
                            >
                              👁
                            </button>

                            {isStaff && (
                              <>
                                <button
                                  type="button"
                                  className="meeting-edit-btn"
                                  title="Edit Meeting"
                                  aria-label="Edit meeting"
                                  onClick={() => handleEdit(meeting)}
                                >
                                  ✏️
                                </button>

                                <button
                                  type="button"
                                  className="meeting-delete-btn"
                                  title="Delete Meeting"
                                  aria-label="Delete meeting"
                                  onClick={() => handleDelete(meeting)}
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
                    <td
                      colSpan="8"
                      className="meeting-no-results"
                    >

                      <div>
                        <span>📋</span>

                        <h3>No Meeting Minutes Found</h3>

                        <p>
                          {hasActiveFilters
                            ? "No meetings match your search or selected filters."
                            : "No meeting minutes have been added yet."}
                        </p>

                        {!hasActiveFilters && isStaff && (
                          <button
                            type="button"
                            className="empty-add-meeting-btn"
                            onClick={handleAddMeeting}
                          >
                            ✚ Add Meeting Minutes
                          </button>
                        )}
                      </div>

                    </td>
                  </tr>

                )}

              </tbody>

            </table>

          </div>

        </section>

      </main>

      {/* =====================================
          VIEW MEETING DETAILS MODAL
      ===================================== */}

      {selectedMeeting && (

        <div
          className="meeting-modal-overlay"
          onClick={() => setSelectedMeeting(null)}
        >

          <div
            className="meeting-modal"
            onClick={(event) => event.stopPropagation()}
          >

            {/* MODAL HEADER */}

            <div className="meeting-modal-header">

              <div>
                <h2>Meeting Details</h2>

                <p>
                  {selectedMeeting.meetingTitle ||
                    "Meeting Minutes"}
                </p>
              </div>

              <button
                type="button"
                className="meeting-modal-close"
                onClick={() => setSelectedMeeting(null)}
                aria-label="Close meeting details"
              >
                ×
              </button>

            </div>

            {/* MODAL BODY */}

            <div className="meeting-modal-content">

             {getMeetingImages(selectedMeeting).length > 0 && (
                <div className="meeting-modal-image">
                  {getMeetingImages(selectedMeeting).map(
                    (image, index) => (
                      <img
                        key={index}
                        src={image}
                        alt={`Meeting attachment ${index + 1}`}
                        onError={(event) => {
                          event.currentTarget.style.display = "none";
                        }}
                      />
                    )
                  )}
                </div>
              )}

              <div className="meeting-detail-grid">

                <div className="meeting-detail-item">
                  <label>Meeting Title</label>
                  <p>
                    {selectedMeeting.meetingTitle || "-"}
                  </p>
                </div>

                <div className="meeting-detail-item">
                  <label>Date</label>
                  <p>
                    {formatDate(selectedMeeting.date)}
                  </p>
                </div>

                <div className="meeting-detail-item">
                  <label>Time</label>
                  <p>
                    {formatTime(selectedMeeting.time)}
                  </p>
                </div>

                <div className="meeting-detail-item">
                  <label>Meeting Facilitator</label>
                  <p>
                    {selectedMeeting.facilitator || "-"}
                  </p>
                </div>

                <div className="meeting-detail-item full-detail">
                  <label>Participants</label>
                  <p>
                    {getParticipants(
                      selectedMeeting.participants
                    ) || "-"}
                  </p>
                </div>

                <div className="meeting-detail-item full-detail">
                  <label>Key Discussion Points</label>
                  <p>
                    {selectedMeeting.discussionPoints || "-"}
                  </p>
                </div>

                <div className="meeting-detail-item">
                  <label>Decisions Made</label>
                  <p>{getDecision(selectedMeeting)}</p>
                </div>

                <div className="meeting-detail-item">
                  <label>Next Step</label>
                  <p>
                    {selectedMeeting.nextStep || "-"}
                  </p>
                </div>

                <div className="meeting-detail-item">
                  <label>Status</label>
                  <p>
                    <span className="meeting-modal-status">
                      {getMeetingStatus(selectedMeeting)}
                    </span>
                  </p>
                </div>

                <div className="meeting-detail-item full-detail">
                  <label>Remarks</label>
                  <p>
                    {selectedMeeting.remarks || "No remarks"}
                  </p>
                </div>

              </div>

              {/* GENERATED REPORT */}

              {selectedMeeting.report && (

                <div className="meeting-modal-report">

                  <h3>✨ Generated Meeting Report</h3>

                  {typeof selectedMeeting.report === "string" ? (

                    <div className="meeting-report-text">
                      {selectedMeeting.report}
                    </div>

                  ) : (

                    <div className="meeting-report-content">

                      <div>
                        <strong>Executive Summary</strong>
                        <p>
                          {reportText(
                            selectedMeeting.report,
                            "executiveSummary",
                            "No executive summary available."
                          )}
                        </p>
                      </div>

                      <div>
                        <strong>Discussion Points</strong>
                        <p>
                          {reportText(
                            selectedMeeting.report,
                            "discussionPoints",
                            selectedMeeting.discussionPoints || "-"
                          )}
                        </p>
                      </div>

                      <div>
                        <strong>Decisions Made</strong>
                        <p>
                          {reportText(
                            selectedMeeting.report,
                            "decisionsMade",
                            getDecision(selectedMeeting)
                          )}
                        </p>
                      </div>

                      <div>
                        <strong>Next Steps</strong>
                        <p>
                          {reportText(
                            selectedMeeting.report,
                            "nextStep",
                            selectedMeeting.nextStep || "-"
                          )}
                        </p>
                      </div>

                    </div>

                  )}

                </div>

              )}

            </div>

            {/* MODAL FOOTER */}

            <div className="meeting-modal-footer">

              {isStaff && (
                <button
                  type="button"
                  className="meeting-modal-edit-btn"
                  onClick={() => handleEdit(selectedMeeting)}
                >
                  ✏️ Edit Meeting
                </button>
              )}

              <button
                type="button"
                className="meeting-modal-close-btn"
                onClick={() => setSelectedMeeting(null)}
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

export default ViewMeetingMinutes;