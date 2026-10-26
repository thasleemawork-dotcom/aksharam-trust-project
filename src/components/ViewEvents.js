import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./ViewEvents.css";
import logo from "../assets/aksharam-logo.jpeg";

const ViewEvents = ({ role = "staff" }) => {
  const navigate = useNavigate();

  // ========================================
  // ROLE
  // ========================================

  const isAdmin = role === "admin";
  const isStaff = role === "staff";

  // ========================================
  // FILTER STATES
  // ========================================

  const [search, setSearch] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("All");
  const [selectedYear, setSelectedYear] = useState("All");
  const [selectedReport, setSelectedReport] = useState(null);

  // ========================================
  // LOAD EVENTS FROM LOCAL STORAGE
  // ========================================

  const [events, setEvents] = useState(() => {
    try {
      const savedEvents = localStorage.getItem("events");

      if (savedEvents) {
        const parsedEvents = JSON.parse(savedEvents);

        if (Array.isArray(parsedEvents)) {
          return parsedEvents;
        }
      }

      // Support older single-event storage.
      const singleEvent = localStorage.getItem("eventReport");

      if (singleEvent) {
        const parsedEvent = JSON.parse(singleEvent);

        return [
          {
            id: parsedEvent.id || Date.now(),
            eventData: parsedEvent.eventData || parsedEvent,
            report: parsedEvent.report || "",
            savedAt: parsedEvent.savedAt || "",
          },
        ];
      }

      return [];
    } catch (error) {
      console.error("Error loading events:", error);
      return [];
    }
  });

  // ========================================
  // SAVE EVENTS
  // ========================================

  useEffect(() => {
    try {
      localStorage.setItem("events", JSON.stringify(events));
    } catch (error) {
      console.error("Unable to save events:", error);

      if (error.name === "QuotaExceededError") {
        alert(
          "Browser storage is full. Please use smaller images or store images on a server."
        );
      }
    }
  }, [events]);

  // ========================================
  // GET EVENT DATA
  // Supports both event.eventData and direct
  // event properties.
  // ========================================

  const getEventData = (event) => {
    return event?.eventData || event || {};
  };

  // ========================================
  // GET UPLOADED PHOTOS
  // Supports common photo property names.
  // ========================================

  const getEventPhotos = (event) => {
    const data = getEventData(event);

    const possiblePhotoArrays = [
      data.photos,
      data.eventPhotos,
      data.images,
      event?.photos,
      event?.eventPhotos,
      event?.images,
    ];

    const photoArray = possiblePhotoArrays.find((item) =>
      Array.isArray(item)
    );

    if (photoArray) {
      return photoArray
        .map((photo, index) => {
          // Support a photo stored as a string.
          if (typeof photo === "string") {
            return {
              id: index,
              src: photo,
              description: "",
              name: `Event photo ${index + 1}`,
            };
          }

          if (!photo || typeof photo !== "object") {
            return null;
          }

          const src =
            photo.src ||
            photo.preview ||
            photo.previewUrl ||
            photo.dataUrl ||
            photo.imageUrl ||
            photo.url ||
            photo.image ||
            photo.base64 ||
            photo.fileData ||
            "";

          return {
            ...photo,
            id: photo.id || index,
            src,
            description:
              photo.description ||
              photo.subDescription ||
              photo.caption ||
              photo.photoDescription ||
              "",
            name:
              photo.name ||
              photo.fileName ||
              photo.filename ||
              `Event photo ${index + 1}`,
          };
        })
        .filter((photo) => photo && photo.src);
    }

    // Support an event containing one image rather than an array.
    const singleImage =
      data.photo ||
      data.eventImage ||
      data.imageUrl ||
      data.image ||
      event?.photo ||
      event?.eventImage;

    if (typeof singleImage === "string" && singleImage) {
      return [
        {
          id: "single-photo",
          src: singleImage,
          name: "Event photo",
          description: data.photoDescription || "",
        },
      ];
    }

    if (
      singleImage &&
      typeof singleImage === "object"
    ) {
      const src =
        singleImage.src ||
        singleImage.preview ||
        singleImage.dataUrl ||
        singleImage.url ||
        singleImage.image ||
        singleImage.base64 ||
        "";

      if (src) {
        return [
          {
            ...singleImage,
            id: singleImage.id || "single-photo",
            src,
            name: singleImage.name || "Event photo",
            description:
              singleImage.description ||
              singleImage.subDescription ||
              "",
          },
        ];
      }
    }

    return [];
  };

  // ========================================
  // FORMAT DATE
  // ========================================

  const parseEventDate = (date) => {
    if (!date) return null;

    // HTML date inputs normally return YYYY-MM-DD.
    const dateObject = /^\d{4}-\d{2}-\d{2}$/.test(date)
      ? new Date(`${date}T00:00:00`)
      : new Date(date);

    if (Number.isNaN(dateObject.getTime())) {
      return null;
    }

    return dateObject;
  };

  const formatDate = (date) => {
    const dateObject = parseEventDate(date);

    if (!dateObject) return "-";

    return dateObject.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  // ========================================
  // CURRENT DATE
  // ========================================

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // ========================================
  // MONTH OPTIONS
  // ========================================

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

  // ========================================
  // YEAR OPTIONS
  // Include years found in saved events.
  // ========================================

  const yearOptions = [
    ...new Set([
      String(new Date().getFullYear()),
      ...events
        .map((event) => {
          const data = getEventData(event);
          const dateObject = parseEventDate(data.date);

          return dateObject
            ? String(dateObject.getFullYear())
            : null;
        })
        .filter(Boolean),
    ]),
  ].sort((a, b) => Number(b) - Number(a));

  // ========================================
  // SEARCH AND MONTH/YEAR FILTER
  // ========================================

  const filteredEvents = events.filter((event) => {
    const data = getEventData(event);

    const searchText = search.toLowerCase().trim();

    const searchableText = [
      data.eventName,
      data.description,
      data.location,
      data.targetAudience,
      data.coordinator,
      data.date,
      data.time,
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();

    const matchesSearch = searchableText.includes(searchText);

    const dateObject = parseEventDate(data.date);

    const matchesMonth =
      selectedMonth === "All" ||
      (dateObject &&
        String(dateObject.getMonth() + 1) === selectedMonth);

    const matchesYear =
      selectedYear === "All" ||
      (dateObject &&
        String(dateObject.getFullYear()) === selectedYear);

    return matchesSearch && matchesMonth && matchesYear;
  });

  // ========================================
  // SUMMARY COUNTS
  // ========================================

const totalEvents = events.length;

const filteredEventCount = filteredEvents.length;

const upcomingEvents = filteredEvents.filter((event) => {
  const data = getEventData(event);
  const dateObject = parseEventDate(data.date);

  return dateObject && dateObject >= today;
}).length;

const pastEvents = filteredEvents.filter((event) => {
  const data = getEventData(event);
  const dateObject = parseEventDate(data.date);

  return dateObject && dateObject < today;
}).length;
  // ========================================
  // HOME NAVIGATION
  // ========================================

  const handleHome = () => {
    if (isAdmin) {
      navigate("/admin/dashboard");
    } else {
      navigate("/staff/dashboard");
    }
  };

  // ========================================
  // ADD EVENT
  // ========================================

  const handleAddEvent = () => {
    if (!isStaff) return;

    navigate("/events/add");
  };

  // ========================================
  // EDIT EVENT
  // ========================================

  const handleEdit = (event) => {
    navigate(`/events/edit/${event.id}`, {
      state: { event },
    });
  };

  // ========================================
  // DELETE EVENT
  // ========================================

  const handleDelete = (id) => {
    if (!window.confirm("Are you sure you want to delete this event?")) {
      return;
    }

    const updatedEvents = events.filter(
      (event) => String(event.id) !== String(id)
    );

    setEvents(updatedEvents);

    if (
      selectedReport &&
      String(selectedReport.id) === String(id)
    ) {
      setSelectedReport(null);
    }
  };

  // ========================================
  // VIEW REPORT
  // ========================================

  const handleViewReport = (event) => {
    setSelectedReport(event);
  };

  // ========================================
  // CLOSE REPORT
  // ========================================

  const closeReport = () => {
    setSelectedReport(null);
  };

  // ========================================
  // RESET FILTERS
  // ========================================

  const handleResetFilters = () => {
    setSearch("");
    setSelectedMonth("All");
    setSelectedYear("All");
  };

  // ========================================
  // REPORT CONTENT
  // ========================================

  const renderReport = (report) => {
    if (!report) {
      return (
        <p className="no-report-text">
          No AI-generated report is available for this event.
        </p>
      );
    }

    const reportTitles = [
      "Executive Summary",
      "Event Overview",
      "Target Audience",
      "Assigned Coordinator",
      "Key Highlights",
      "Expected Impact",
      "Recommendations",
    ];

    return report.split("\n").map((line, index) => {
      const cleanLine = line.trim();

      if (!cleanLine) {
        return <div className="report-space" key={index} />;
      }

      if (reportTitles.includes(cleanLine)) {
        return (
          <h4 className="report-section-title" key={index}>
            {cleanLine}
          </h4>
        );
      }

      return (
        <p className="report-line" key={index}>
          {cleanLine}
        </p>
      );
    });
  };

  // ========================================
  // SELECTED FILTER LABEL
  // ========================================

  const selectedMonthLabel =
    selectedMonth === "All"
      ? "All Months"
      : monthOptions.find(
          (month) => month.value === selectedMonth
        )?.label;

  const selectedYearLabel =
    selectedYear === "All" ? "All Years" : selectedYear;

  // ========================================
  // UI
  // ========================================

  return (
    <div className="dashboard">
      {/* ====================================
          TOP NAVBAR
      ==================================== */}

      <header className="top-navbar">
        <div className="navbar-brand">
          <img src={logo} alt="Aksharam Trust" />
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
          >
            <span>📅</span>
            <span>Events</span>
          </button>
        </nav>
      </header>

      {/* ====================================
          PAGE CONTENT
      ==================================== */}

      <main className="view-events-page">
        {/* PAGE HEADER */}

        <div className="events-page-header">
          <div>
            <h2>📅 View Events</h2>

            <p>
              {isAdmin
                ? "View registered events, uploaded photos and reports."
                : "Manage and review Aksharam Trust events."}
            </p>
          </div>

          {isStaff && (
            <button
              type="button"
              className="add-event-btn"
              onClick={handleAddEvent}
            >
              ✚ Add Event
            </button>
          )}
        </div>

        {/* ====================================
            SUMMARY CARDS
        ==================================== */}

        <div className="event-summary-cards">
          <div className="event-summary-card">
            <div className="event-summary-icon">📅</div>

            <div>
              <span>Total Events</span>
              <strong>{totalEvents}</strong>
            </div>
          </div>

          <div className="event-summary-card">
            <div className="event-summary-icon">🔎</div>

            <div>
              <span>Filtered Events</span>
              <strong>{filteredEventCount}</strong>
            </div>
          </div>

          <div className="event-summary-card">
            <div className="event-summary-icon">🗓️</div>

            <div>
              <span>Upcoming Events</span>
              <strong>{upcomingEvents}</strong>
            </div>
          </div>

          <div className="event-summary-card">
            <div className="event-summary-icon">✅</div>

            <div>
              <span>Past Events</span>
              <strong>{pastEvents}</strong>
            </div>
          </div>
        </div>

        {/* ====================================
            SEARCH AND FILTERS
        ==================================== */}

        <div className="event-filter-section">
          <div className="event-search-box">
            <span>🔍</span>

            <input
              type="text"
              placeholder="Search event, location or coordinator..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              aria-label="Search events"
            />
          </div>

          {/* MONTH FILTER */}

          <select
            className="event-location-filter"
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            aria-label="Filter by month"
          >
            <option value="All">📅 All Months</option>

            {monthOptions.map((month) => (
              <option key={month.value} value={month.value}>
                {month.label}
              </option>
            ))}
          </select>

          {/* YEAR FILTER */}
          <input
            type="number"
            className="event-year-filter"
            value={selectedYear === "All" ? "" : selectedYear}
            onChange={(e) => {
              const value = e.target.value;

              setSelectedYear(value === "" ? "All" : value);
            }}
            placeholder="Enter year"
            min="1900"
            max="2100"
            aria-label="Filter by year"
          />

          {(search ||
            selectedMonth !== "All" ||
            selectedYear !== "All") && (
            <button
              type="button"
              className="reset-event-filter-btn"
              onClick={handleResetFilters}
            >
              ↻ Reset
            </button>
          )}
        </div>

        {/* ====================================
            SELECTED FILTER INFORMATION
        ==================================== */}

        {(selectedMonth !== "All" || selectedYear !== "All") && (
          <div className="selected-event-location">
            <div className="selected-event-location-icon">📅</div>

            <div>
              <strong>
                {selectedMonthLabel} {selectedYearLabel}
              </strong>

              <span>
                {filteredEventCount}{" "}
                {filteredEventCount === 1 ? "event" : "events"} found
                for the selected period
              </span>
            </div>
          </div>
        )}

        {/* ====================================
            EVENT TABLE
        ==================================== */}

        <div className="events-table-container">
          <div className="events-table-heading">
            <div>
              <h3>Event List</h3>

              <span>
                Showing {filteredEvents.length} of {events.length} events
              </span>
            </div>
          </div>

          {filteredEvents.length === 0 ? (
            <div className="empty-events">
              <span>📅</span>

              <h3>No Events Found</h3>

              <p>
                {search ||
                selectedMonth !== "All" ||
                selectedYear !== "All"
                  ? "No events match your search or selected month and year."
                  : "No events have been saved yet."}
              </p>

              {isStaff &&
                !search &&
                selectedMonth === "All" &&
                selectedYear === "All" && (
                  <button
                    type="button"
                    className="empty-add-event-btn"
                    onClick={handleAddEvent}
                  >
                    ✚ Add Your First Event
                  </button>
                )}
            </div>
          ) : (
            <div className="events-table-responsive">
              <table className="events-table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Event Name</th>
                    <th>Date</th>
                    <th>Time</th>
                    <th>Location</th>
                    <th>Target Audience</th>
                    <th>Coordinator</th>
                    <th>Photos</th>
                    <th>Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredEvents.map((event, index) => {
                    const data = getEventData(event);
                    const photos = getEventPhotos(event);

                    return (
                      <tr key={event.id || index}>
                        <td>{index + 1}</td>

                        {/* EVENT NAME */}

                        <td>
                          <div className="event-name-cell">
                            <div className="event-avatar">📅</div>

                            <div>
                              <strong>
                                {data.eventName || "Untitled Event"}
                              </strong>

                              <small>
                                {data.description
                                  ? data.description.length > 45
                                    ? `${data.description.substring(
                                        0,
                                        45
                                      )}...`
                                    : data.description
                                  : "No description"}
                              </small>
                            </div>
                          </div>
                        </td>

                        {/* DATE */}

                        <td>{formatDate(data.date)}</td>

                        {/* TIME */}

                        <td>{data.time || "-"}</td>

                        {/* LOCATION */}

                        <td>
                          <span className="event-location-badge">
                            📍 {data.location || "Not specified"}
                          </span>
                        </td>

                        {/* TARGET AUDIENCE */}

                        <td>
                          <span className="event-audience-badge">
                            {data.targetAudience || "-"}
                          </span>
                        </td>

                        {/* COORDINATOR */}

                        <td>{data.coordinator || "-"}</td>

                        {/* PHOTO THUMBNAILS */}

                        <td>
                          {photos.length > 0 ? (
                            <div className="event-table-photos">
                              {photos.slice(0, 3).map((photo, photoIndex) => (
                                <img
                                  key={photo.id ?? photoIndex}
                                  src={photo.src}
                                  alt={photo.description || photo.name}
                                  title={photo.description || photo.name}
                                  className="event-table-photo"
                                  onError={(e) => {
                                    e.currentTarget.style.display = "none";
                                  }}
                                />
                              ))}

                              {photos.length > 3 && (
                                <span className="event-extra-photos">
                                  +{photos.length - 3}
                                </span>
                              )}
                            </div>
                          ) : (
                            <span className="no-event-photos">No photos</span>
                          )}
                        </td>

                        {/* ACTIONS */}

                        <td>
                          <div className="event-action-buttons">
                            <button
                              type="button"
                              className="view-btn"
                              title="View Event Report and Photos"
                              aria-label="View event report and photos"
                              onClick={() => handleViewReport(event)}
                            >
                              👁
                            </button>

                            <button
                              type="button"
                              className="edit-btn"
                              title="Edit Event"
                              aria-label="Edit event"
                              onClick={() => handleEdit(event)}
                            >
                              ✎
                            </button>

                            <button
                              type="button"
                              className="delete-btn"
                              title="Delete Event"
                              aria-label="Delete event"
                              onClick={() => handleDelete(event.id)}
                            >
                              🗑
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>

      {/* ====================================
          REPORT AND PHOTO MODAL
      ==================================== */}

      {selectedReport && (
        <div
          className="event-report-overlay"
          onClick={closeReport}
        >
          <div
            className="event-report-modal"
            onClick={(e) => e.stopPropagation()}
          >
            {/* MODAL HEADER */}

            <div className="event-report-modal-header">
              <div>
                <h2>✨ Event Details & Report</h2>

                <p>
                  {getEventData(selectedReport).eventName ||
                    "Event Report"}
                </p>
              </div>

              <button
                type="button"
                className="event-report-close"
                onClick={closeReport}
                aria-label="Close report"
              >
                ×
              </button>
            </div>

            {/* EVENT SUMMARY */}

            <div className="event-report-summary">
              <div>
                <span>Event Date</span>

                <strong>
                  {formatDate(getEventData(selectedReport).date)}
                </strong>
              </div>

              <div>
                <span>Time</span>

                <strong>
                  {getEventData(selectedReport).time || "-"}
                </strong>
              </div>

              <div>
                <span>Location</span>

                <strong>
                  {getEventData(selectedReport).location || "-"}
                </strong>
              </div>

              <div>
                <span>Coordinator</span>

                <strong>
                  {getEventData(selectedReport).coordinator || "-"}
                </strong>
              </div>
            </div>

            {/* EVENT DESCRIPTION */}

            {getEventData(selectedReport).description && (
              <div className="event-report-content">
                <h3 className="event-report-label">
                  Event Description
                </h3>

                <p className="report-line">
                  {getEventData(selectedReport).description}
                </p>
              </div>
            )}

            {/* UPLOADED EVENT PHOTOS */}

            <div className="event-report-photos-section">
              <h3>📸 Uploaded Event Photos</h3>

              {getEventPhotos(selectedReport).length > 0 ? (
                <div className="event-report-photos-grid">
                  {getEventPhotos(selectedReport).map(
                    (photo, index) => (
                      <figure
                        className="event-report-photo-card"
                        key={photo.id ?? index}
                      >
                        <img
                          src={photo.src}
                          alt={
                            photo.description ||
                            photo.name ||
                            `Event photo ${index + 1}`
                          }
                          onError={(e) => {
                            e.currentTarget.alt =
                              "Unable to load this image";
                          }}
                        />

                        <figcaption>
                          <strong>
                            {photo.name || `Event Photo ${index + 1}`}
                          </strong>

                          <p>
                            {photo.description ||
                              "No description provided."}
                          </p>
                        </figcaption>
                      </figure>
                    )
                  )}
                </div>
              ) : (
                <div className="event-report-no-photos">
                  <span>🖼️</span>

                  <p>No uploaded photos are available for this event.</p>

                  <small>
                    Check that EventDetails.js saves the photos with
                    the event data.
                  </small>
                </div>
              )}
            </div>

            {/* AI REPORT */}

            <div className="event-report-content">
              <div className="event-report-label">
                ✨ Event Report
              </div>

              {renderReport(selectedReport.report)}
            </div>

            {/* MODAL FOOTER */}

            <div className="event-report-footer">
              <button
                type="button"
                className="event-report-edit-btn"
                onClick={() => {
                  const event = selectedReport;

                  closeReport();
                  handleEdit(event);
                }}
              >
                ✎ Edit Event
              </button>

              <button
                type="button"
                className="event-report-close-btn"
                onClick={closeReport}
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

export default ViewEvents;