import React, { useEffect, useState } from "react";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import "./EventDetails.css";

const STORAGE_KEY = "events";
const REPORT_STORAGE_KEY = "eventReports";
const MAX_PHOTOS = 10;
const MAX_PHOTO_SIZE = 2 * 1024 * 1024;

const initialEventData = {
  eventName: "",
  date: "",
  time: "",
  location: "",
  targetAudience: "",
  coordinator: "",
  description: "",
};

const EventDetails = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();

  const isEditMode = Boolean(id);

  const [eventData, setEventData] = useState({ ...initialEventData });
  const [photos, setPhotos] = useState([]);
  const [report, setReport] = useState("");
  const [showReport, setShowReport] = useState(false);
  const [isLoading, setIsLoading] = useState(isEditMode);
  const [saveMessage, setSaveMessage] = useState("");

  const getSavedEvents = () => {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
      return Array.isArray(saved) ? saved : [];
    } catch (error) {
      console.error("Unable to read events:", error);
      return [];
    }
  };

  // Load event details when editing an existing event.
  useEffect(() => {
    if (!isEditMode) {
      setEventData({ ...initialEventData });
      setPhotos([]);
      setReport("");
      setShowReport(false);
      setIsLoading(false);
      return;
    }

    let selectedEvent = location.state?.event || null;

    if (!selectedEvent || String(selectedEvent.id) !== String(id)) {
      selectedEvent = getSavedEvents().find(
        (event) => String(event.id) === String(id)
      );
    }

    if (!selectedEvent) {
      setIsLoading(false);
      setSaveMessage("Event not found. Please return to the events list.");
      return;
    }

    const data = selectedEvent.eventData || selectedEvent;

    setEventData({
      eventName: data.eventName || "",
      date: data.date || "",
      time: data.time || "",
      location: data.location || "",
      targetAudience: data.targetAudience || "",
      coordinator: data.coordinator || "",
      description: data.description || "",
    });

    setPhotos(Array.isArray(selectedEvent.photos) ? selectedEvent.photos : []);
    setReport(selectedEvent.report || "");
    setShowReport(Boolean(selectedEvent.report));
    setSaveMessage("");
    setIsLoading(false);
  }, [id, isEditMode, location.state]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setEventData((previous) => ({
      ...previous,
      [name]: value,
    }));

    setSaveMessage("");
  };

  // Validate the required event details.
  const validateForm = () => {
    const requiredFields = [
      "eventName",
      "date",
      "time",
      "location",
      "targetAudience",
      "coordinator",
      "description",
    ];

    const hasEmptyField = requiredFields.some(
      (field) => !String(eventData[field] || "").trim()
    );

    if (hasEmptyField) {
      alert("Please fill in all required event details.");
      return false;
    }

    return true;
  };

  // Upload multiple event photos.
  const handlePhotoSelection = (e) => {
    const selectedFiles = Array.from(e.target.files || []);

    if (selectedFiles.length === 0) return;

    const availableSlots = MAX_PHOTOS - photos.length;

    if (availableSlots <= 0) {
      alert(`You can upload a maximum of ${MAX_PHOTOS} photos.`);
      e.target.value = "";
      return;
    }

    if (selectedFiles.length > availableSlots) {
      alert(`You can upload only ${availableSlots} more photo(s).`);
    }

    selectedFiles.slice(0, availableSlots).forEach((file) => {
      if (!file.type.startsWith("image/")) {
        alert(`${file.name} is not an image file.`);
        return;
      }

      if (file.size > MAX_PHOTO_SIZE) {
        alert(`${file.name} is larger than 2 MB. Please select a smaller image.`);
        return;
      }

      const reader = new FileReader();

      reader.onload = () => {
        setPhotos((previous) => {
          if (previous.length >= MAX_PHOTOS) return previous;

          return [
            ...previous,
            {
              id: `${Date.now()}-${Math.random()
                .toString(36)
                .slice(2, 9)}`,
              // name: file.name,
              image: reader.result,
              description: "",
            },
          ];
        });
      };

      reader.onerror = () => {
        alert(`Unable to read ${file.name}. Please try again.`);
      };

      reader.readAsDataURL(file);
    });

    // Allows selecting the same file again after removing it.
    e.target.value = "";
  };

  // Update the description of an individual photo.
  const handlePhotoDescriptionChange = (photoId, value) => {
    setPhotos((previous) =>
      previous.map((photo) =>
        photo.id === photoId
          ? { ...photo, description: value }
          : photo
      )
    );
  };

  // Remove a selected photo.
  const handleRemovePhoto = (photoId) => {
    setPhotos((previous) =>
      previous.filter((photo) => photo.id !== photoId)
    );
  };

  // Generate the event report.
  const generateReport = () => {
    if (!validateForm()) return;

    const formattedDate = new Date(
      `${eventData.date}T00:00:00`
    ).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });

    const [hours, minutes] = eventData.time.split(":");

    const formattedTime = new Date(
      2000,
      0,
      1,
      Number(hours),
      Number(minutes)
    ).toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });

    const photoDescriptions =
      photos.length > 0
        ? photos
            .map(
              (photo, index) =>
                `${index + 1}. ${photo.name}\nDescription: ${
                  photo.description || "No description provided."
                }`
            )
            .join("\n\n")
        : "No event photos uploaded.";

    const generatedReport = `
EVENT REPORT
AKSHARAM TRUST
========================================

1. EXECUTIVE SUMMARY

The event "${eventData.eventName}" is scheduled for ${formattedDate} at ${formattedTime}.
The event will take place at ${eventData.location} under the coordination of ${eventData.coordinator}.

2. EVENT OVERVIEW

Event Name: ${eventData.eventName}

Description:
${eventData.description}

Date: ${formattedDate}
Time: ${formattedTime}
Location: ${eventData.location}

3. TARGET AUDIENCE

${eventData.targetAudience}

4. EVENT COORDINATION

Assigned Coordinator: ${eventData.coordinator}

The coordinator will oversee event preparation and coordinate with the relevant team members.

5. EVENT PHOTO DETAILS

Total Photos: ${photos.length}

${photoDescriptions}

6. EXPECTED IMPACT

The event aims to benefit ${eventData.targetAudience} and support Aksharam Trust's initiatives in education, community support, and social development.

7. RECOMMENDATIONS

• Complete all arrangements before the event.
• Inform participants about the event schedule.
• Coordinate with staff members and volunteers.
• Maintain attendance and event records.
• Collect feedback and document event outcomes.

========================================
Report prepared for Aksharam Trust
========================================
    `.trim();

    setReport(generatedReport);
    setShowReport(true);
    setSaveMessage("");

    setTimeout(() => {
      document
        .getElementById("generated-event-report")
        ?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 100);
  };

  // Save a new event or update an existing event.
  const handleSaveEvent = (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      const savedEvents = getSavedEvents();
      let updatedEvents;

      if (isEditMode) {
        const existingEvent = savedEvents.find(
          (event) => String(event.id) === String(id)
        );

        if (!existingEvent) {
          setSaveMessage("Event not found. Please return to the events list.");
          return;
        }

        updatedEvents = savedEvents.map((event) =>
          String(event.id) === String(id)
            ? {
                ...event,
                ...eventData,
                id: event.id,
                eventData: { ...eventData },
                photos: [...photos],
                report: report || event.report || "",
                updatedAt: new Date().toISOString(),
              }
            : event
        );
      } else {
        const newEvent = {
          id: Date.now(),
          ...eventData,
          eventData: { ...eventData },
          photos: [...photos],
          report,
          createdAt: new Date().toISOString(),
        };

        updatedEvents = [...savedEvents, newEvent];
      }

      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedEvents));

      alert(
        isEditMode
          ? "Event updated successfully!"
          : "Event added successfully!"
      );

      navigate("/staff/events/manage");
    } catch (error) {
      console.error("Error saving event:", error);

      setSaveMessage(
        "Unable to save the event. Please use smaller photos or remove some photos and try again."
      );
    }
  };

  // Save the generated report to both storage locations.
  const saveReport = () => {
    if (!report) {
      alert("Please generate the report before saving.");
      return;
    }

    if (!validateForm()) return;

    try {
      const savedEvents = getSavedEvents();
      let eventId;
      let updatedEvents;

      if (isEditMode) {
        const existingEvent = savedEvents.find(
          (event) => String(event.id) === String(id)
        );

        if (!existingEvent) {
          alert("Event not found. Please return to the events list.");
          return;
        }

        eventId = existingEvent.id;

        updatedEvents = savedEvents.map((event) =>
          String(event.id) === String(id)
            ? {
                ...event,
                ...eventData,
                id: event.id,
                eventData: { ...eventData },
                photos: [...photos],
                report,
                updatedAt: new Date().toISOString(),
              }
            : event
        );
      } else {
        const matchingEvent = savedEvents.find((event) => {
          const data = event.eventData || event;

          return (
            data.eventName === eventData.eventName &&
            data.date === eventData.date
          );
        });

        if (matchingEvent) {
          eventId = matchingEvent.id;

          updatedEvents = savedEvents.map((event) =>
            String(event.id) === String(eventId)
              ? {
                  ...event,
                  ...eventData,
                  id: event.id,
                  eventData: { ...eventData },
                  photos: [...photos],
                  report,
                  updatedAt: new Date().toISOString(),
                }
              : event
          );
        } else {
          eventId = Date.now();

          updatedEvents = [
            ...savedEvents,
            {
              id: eventId,
              ...eventData,
              eventData: { ...eventData },
              photos: [...photos],
              report,
              createdAt: new Date().toISOString(),
            },
          ];
        }
      }

      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedEvents));

      let savedReports = [];

      try {
        const parsed = JSON.parse(
          localStorage.getItem(REPORT_STORAGE_KEY) || "[]"
        );

        if (Array.isArray(parsed)) savedReports = parsed;
      } catch (error) {
        console.error("Unable to read existing reports:", error);
      }

      const existingIndex = savedReports.findIndex(
        (item) => String(item.eventId) === String(eventId)
      );

      const reportRecord = {
        id:
          existingIndex >= 0
            ? savedReports[existingIndex].id
            : Date.now(),
        eventId,
        eventData: { ...eventData },
        photos: [...photos],
        report,
        savedAt: new Date().toISOString(),
      };

      if (existingIndex >= 0) {
        savedReports[existingIndex] = reportRecord;
      } else {
        savedReports.push(reportRecord);
      }

      localStorage.setItem(
        REPORT_STORAGE_KEY,
        JSON.stringify(savedReports)
      );

      alert("Event report saved successfully!");
      navigate("/staff/events/manage");
    } catch (error) {
      console.error("Error saving report:", error);

      alert(
        "Unable to save the report. Please try using smaller photos."
      );
    }
  };

  // Download the generated report as a text file.
  const downloadReport = () => {
    if (!report) {
      alert("Please generate the report before downloading.");
      return;
    }

    const blob = new Blob([report], {
      type: "text/plain;charset=utf-8",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    const safeFileName = eventData.eventName
      .trim()
      .replace(/[^a-z0-9]/gi, "_");

    link.href = url;
    link.download = `${safeFileName || "Event"}_Report.txt`;

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setTimeout(() => URL.revokeObjectURL(url), 100);
  };

  // Clear all form values.
  const handleClear = () => {
    if (!window.confirm("Are you sure you want to clear the form?")) {
      return;
    }

    setEventData({ ...initialEventData });
    setPhotos([]);
    setReport("");
    setShowReport(false);
    setSaveMessage("");
  };

  const handleCancel = () => {
    navigate(-1);
  };

  // Format the report for on-screen display.
  const renderReport = () => {
    const headings = [
      "EVENT REPORT",
      "AKSHARAM TRUST",
      "1. EXECUTIVE SUMMARY",
      "2. EVENT OVERVIEW",
      "3. TARGET AUDIENCE",
      "4. EVENT COORDINATION",
      "5. EVENT PHOTO DETAILS",
      "6. EXPECTED IMPACT",
      "7. RECOMMENDATIONS",
    ];

    return report.split("\n").map((line, index) => {
      const trimmedLine = line.trim();

      if (!trimmedLine) {
        return <div key={index} className="report-space" />;
      }

      if (headings.includes(trimmedLine)) {
        return (
          <h3 key={index} className="report-title">
            {trimmedLine}
          </h3>
        );
      }

      if (trimmedLine.startsWith("•")) {
        return (
          <p key={index} className="report-bullet">
            {trimmedLine}
          </p>
        );
      }

      if (trimmedLine.startsWith("===")) {
        return <hr key={index} className="report-divider" />;
      }

      return (
        <p key={index} className="report-line">
          {line}
        </p>
      );
    });
  };

  if (isLoading) {
    return (
      <div className="event-page">
        <div className="event-card">
          <div className="section-heading">
            <span className="section-icon">📅</span>
            <div className="section-heading-text">
              <h2>Loading Event</h2>
              <p>Please wait while the event details load.</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (isEditMode && saveMessage.startsWith("Event not found")) {
    return (
      <div className="event-page">
        <div className="event-card">
          <div className="section-heading">
            <span className="section-icon">⚠️</span>
            <div className="section-heading-text">
              <h2>Event Not Found</h2>
              <p>{saveMessage}</p>
            </div>
          </div>

          <div className="event-actions">
            <button
              type="button"
              className="clear-btn"
              onClick={() => navigate("/staff/events/manage")}
            >
              Back to Events
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="event-page">
      <div className="event-card">
        <div className="section-heading">
          <span className="section-icon">📅</span>

          <div className="section-heading-text">
            <h2>
              {isEditMode
                ? "Edit Event Information"
                : "Add Event Information"}
            </h2>

            <p>
              {isEditMode
                ? "Update the existing event information"
                : "Enter the details of the new event"}
            </p>
          </div>

          <button
            type="button"
            className="assign-work-close-btn"
            onClick={handleCancel}
            aria-label="Close event form"
            title="Close"
          >
            &times;
          </button>
        </div>

        <form className="event-form" onSubmit={handleSaveEvent}>
          <div className="form-group">
            <label htmlFor="eventName">
              Event Name / Title <span>*</span>
            </label>

            <input
              id="eventName"
              type="text"
              name="eventName"
              value={eventData.eventName}
              onChange={handleChange}
              placeholder="Enter event name or title"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="date">
              Date <span>*</span>
            </label>

            <input
              id="date"
              type="date"
              name="date"
              value={eventData.date}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="time">
              Time <span>*</span>
            </label>

            <input
              id="time"
              type="time"
              name="time"
              value={eventData.time}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="location">
              Location <span>*</span>
            </label>

            <input
              id="location"
              type="text"
              name="location"
              value={eventData.location}
              onChange={handleChange}
              placeholder="Enter event location"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="targetAudience">
              Target Audience <span>*</span>
            </label>

            <input
              id="targetAudience"
              type="text"
              name="targetAudience"
              value={eventData.targetAudience}
              onChange={handleChange}
              placeholder="e.g. Students, Parents, Staff"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="coordinator">
              Assigned Coordinator <span>*</span>
            </label>

            <input
              id="coordinator"
              type="text"
              name="coordinator"
              value={eventData.coordinator}
              onChange={handleChange}
              placeholder="Enter coordinator name"
              required
            />
          </div>

          <div className="form-group full-width">
            <label htmlFor="description">
              Event Description <span>*</span>
            </label>

            <textarea
              id="description"
              name="description"
              value={eventData.description}
              onChange={handleChange}
              placeholder="Enter the event description and objectives"
              rows="5"
              required
            />
          </div>

          {/* EVENT PHOTOS SECTION */}
          <section className="event-photos-section full-width">
            <div className="event-photos-heading">
              <div>
                <h3>Event Photos</h3>
                <p>
                  Upload event photos and write a separate description for
                  each photo.
                </p>
              </div>

              <span className="photo-count">
                {photos.length}/{MAX_PHOTOS} Photos
              </span>
            </div>

            <label className="photo-upload-box" htmlFor="eventPhotos">
              <input
                id="eventPhotos"
                type="file"
                accept="image/*"
                multiple
                onChange={handlePhotoSelection}
                disabled={photos.length >= MAX_PHOTOS}
              />

              <span className="photo-upload-icon">＋</span>
              <span className="photo-upload-title">
                Choose Event Photos
              </span>
              <span className="photo-upload-hint">
                JPG, PNG or other image formats · Maximum 2 MB per photo
              </span>
            </label>

            {photos.length > 0 && (
              <div className="event-photos-grid">
                {photos.map((photo, index) => (
                  <article
                    className="event-photo-card"
                    key={photo.id || `${photo.name}-${index}`}
                  >
                    <div className="event-photo-preview">
                      <img
                        src={photo.image}
                        alt={photo.description || `Event photo ${index + 1}`}
                      />

                      <span className="event-photo-number">
                        Photo {index + 1}
                      </span>
                    </div>

                    <div className="event-photo-fields">
                      {/* <p className="event-photo-filename">
                        {photo.name || `Event photo ${index + 1}`}
                      </p> */}

                      <label htmlFor={`photo-description-${photo.id}`}>
                        Description of this photo
                      </label>

                      <textarea
                        id={`photo-description-${photo.id}`}
                        value={photo.description || ""}
                        onChange={(e) =>
                          handlePhotoDescriptionChange(
                            photo.id,
                            e.target.value
                          )
                        }
                        placeholder="Describe what is happening in this photo..."
                        rows="3"
                        maxLength={500}
                      />

                      <div className="event-photo-card-footer">
                        <small>
                          {(photo.description || "").length}/500 characters
                        </small>

                        <button
                          type="button"
                          className="remove-photo-btn"
                          onClick={() => handleRemovePhoto(photo.id)}
                        >
                          Remove Photo
                        </button>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </section>

          <div className="event-actions full-width">
            <button
              type="button"
              className="clear-btn"
              onClick={handleClear}
            >
              Clear
            </button>

            <button
              type="button"
              className="clear-btn"
              onClick={handleCancel}
            >
              Cancel
            </button>

            <button type="submit" className="generate-btn">
              {isEditMode ? "Update Event" : "Save Event"}
            </button>

            <button
              type="button"
              className="generate-btn"
              onClick={generateReport}
            >
              ✨ Generate Report
            </button>
          </div>
        </form>

        {saveMessage && (
          <p className="report-save-message error">{saveMessage}</p>
        )}
      </div>

      {/* GENERATED EVENT REPORT */}
      {showReport && (
        <div className="report-card" id="generated-event-report">
          <div className="report-header">
            <div className="report-heading-text">
              <h2>Event Report</h2>
              <p>Generated event summary for Aksharam Trust</p>
            </div>

            <span className="ai-badge">Report Generated</span>
          </div>

          <div className="report-content">{renderReport()}</div>

          {photos.length > 0 && (
            <div className="report-photo-summary">
              <h3>Event Photos ({photos.length})</h3>

              <div className="report-photo-grid">
                {photos.map((photo, index) => (
                  <figure key={photo.id || index}>
                    <img
                      src={photo.image}
                      alt={
                        photo.description || `Event photo ${index + 1}`
                      }
                    />

                    <figcaption>
                      <strong>Photo {index + 1}</strong>
                      <br />
                      {photo.description ||
                        "No photo description provided."}
                    </figcaption>
                  </figure>
                ))}
              </div>
            </div>
          )}

          <div className="report-actions">
            <button
              type="button"
              className="save-report-btn"
              onClick={saveReport}
            >
              💾 Save Report
            </button>

            <button
              type="button"
              className="generate-btn"
              onClick={downloadReport}
            >
              ⬇ Download Report
            </button>
          </div>

          <div className="report-footer">
            ✓ Report generated successfully
          </div>
        </div>
      )}
    </div>
  );
};

export default EventDetails;