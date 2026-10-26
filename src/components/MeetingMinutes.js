import React, { useRef, useState } from "react";
import { useNavigate ,  useLocation, useParams} from "react-router-dom";
import { jsPDF } from "jspdf";
import "./MeetingMinutes.css";

const MeetingMinutes = () => {
const navigate = useNavigate();
const location = useLocation();
const { id } = useParams();

const editingMeeting = location.state?.meeting;

const isEditMode = Boolean(id);

  const STORAGE_KEY = "aksharam_meeting_minutes";

  const fileToBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = () => resolve(reader.result);
      reader.onerror = () => reject(new Error("Unable to read image."));

      reader.readAsDataURL(file);
  });


  const initialFormData = {
    date: "",
    time: "",
    meetingTitle: "",
    facilitator: "",
    participants: "",
    discussionPoints: "",
    decisionsMade: "",
    nextStep: "",
    status: "",
    remarks: "",
  };

const [formData, setFormData] = useState(() => ({
  ...initialFormData,
  ...(editingMeeting || {}),
}));

  const [meetingImage, setMeetingImage] = useState([]);
  const [imagePreview, setImagePreview] = useState([]);
  const [generatedReport, setGeneratedReport] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const fileInputRef = useRef(null);

  // Handle text inputs
 const handleChange = (event) => {
  const { name, value } = event.target;

  setFormData((previousData) => ({
    ...previousData,
    [name]: value,
  }));
};

  // Handle multiple meeting photo uploads
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files || []);

    if (files.length === 0) return;

    const validTypes = ["image/jpeg", "image/png"];
    const validFiles = [];

    for (const file of files) {
      if (!validTypes.includes(file.type)) {
        setMessage("Please upload only JPG or PNG images.");
        continue;
      }

      if (file.size > 5 * 1024 * 1024) {
        setMessage(`${file.name} exceeds the 5 MB limit.`);
        continue;
      }

      validFiles.push(file);
    }

    if (validFiles.length > 0) {
      setMeetingImage((previous) => [...previous, ...validFiles]);

      const newPreviews = validFiles.map((file) =>
        URL.createObjectURL(file)
      );

      setImagePreview((previous) => [...previous, ...newPreviews]);

      setGeneratedReport("");
      setMessage("");
    }

    // Allow selecting the same photo again if needed
    e.target.value = "";
  };


  // Remove a selected meeting photo
  const removeImage = (index) => {
    setImagePreview((previous) => {
      const previewToRemove = previous[index];

      if (previewToRemove) {
        URL.revokeObjectURL(previewToRemove);
      }

      return previous.filter((_, i) => i !== index);
    });

    setMeetingImage((previous) =>
      previous.filter((_, i) => i !== index)
    );

    setGeneratedReport("");
  };


  // Validate required fields
  const validateForm = () => {
    const requiredFields = [
      ["date", "Date"],
      ["time", "Time"],
      ["meetingTitle", "Meeting Title"],
      ["facilitator", "Meeting Facilitator"],
      ["participants", "Participants"],
      ["discussionPoints", "Key Discussion Points"],
      ["decisionsMade", "Decisions Made"],
      ["nextStep", "Next Step"],
      ["status", "Status"],
    ];

    for (const [field, label] of requiredFields) {
      if (!formData[field].trim()) {
        setMessage(`Please enter ${label}.`);
        return false;
      }
    }

    return true;
  };

  // Generate a structured meeting report
  // This is a client-side report generator.
  // Connect an AI API to generate genuinely AI-written summaries.
  const handleGenerateReport = async () => {
    if (!validateForm()) return;

    setLoading(true);
    setMessage("");
    setGeneratedReport("");

    try {
      // Replace this client-side generation with your AI backend
      // when you have connected an AI service.

      const participants = formData.participants
        .split(",")
        .map((name) => name.trim())
        .filter(Boolean);

      const report = `
MEETING MINUTES REPORT
AKSHARAM TRUST
Education • Care • Compassion

1. MEETING DETAILS

Meeting Title: ${formData.meetingTitle}
Date: ${formData.date}
Time: ${formData.time}
Meeting Facilitator: ${formData.facilitator}

2. PARTICIPANTS

${participants.map((name, index) => `${index + 1}. ${name}`).join("\n")}

3. KEY DISCUSSION POINTS

${formData.discussionPoints}

4. DECISIONS MADE

${formData.decisionsMade}

5. NEXT STEPS AND ACTION ITEMS

${formData.nextStep}

6. MEETING STATUS

${formData.status}

7. REMARKS

${formData.remarks.trim() || "No additional remarks provided."}

--------------------------------------------------

Prepared for Aksharam Trust.
      `.trim();

      setGeneratedReport(report);
      setMessage("Meeting report generated successfully.");
    } catch (error) {
      console.error("Report generation error:", error);
      setMessage("Unable to generate the report. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Download generated report as PDF
  const handleDownloadPDF = () => {
  if (!generatedReport) {
    setMessage("Please generate the meeting report before downloading.");
    return;
  }

  try {
    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    });

    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const margin = 18;
    const contentWidth = pageWidth - margin * 2;
    const lineHeight = 5;

    let y = 20;

    // Header
    pdf.setFillColor(7, 91, 152);
    pdf.rect(0, 0, pageWidth, 37, "F");

    pdf.setTextColor(255, 255, 255);
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(19);

    pdf.text("MEETING MINUTES", pageWidth / 2, 16, {
      align: "center",
    });

    pdf.setFontSize(10);
    pdf.setFont("helvetica", "normal");

    pdf.text("AKSHARAM TRUST", pageWidth / 2, 24, {
      align: "center",
    });

    pdf.setFontSize(8);

    pdf.text(
      "Education | Care | Compassion",
      pageWidth / 2,
      30,
      { align: "center" }
    );

    y = 47;

    const lines = generatedReport.split("\n");

    lines.forEach((line) => {
      const text = line.trimEnd();

      if (!text.trim()) {
        y += 3;
        return;
      }

      const isHeading =
        /^\d+\.\s/.test(text) ||
        text === "MEETING MINUTES REPORT" ||
        text === "AKSHARAM TRUST";

      const wrappedLines = pdf.splitTextToSize(
        text,
        contentWidth
      );

      if (isHeading) {
        y += 2;
        pdf.setFont("helvetica", "bold");
        pdf.setFontSize(11);
        pdf.setTextColor(7, 91, 152);
      } else {
        pdf.setFont("helvetica", "normal");
        pdf.setFontSize(10);
        pdf.setTextColor(45, 60, 75);
      }

      wrappedLines.forEach((wrappedLine) => {
        if (y + lineHeight > pageHeight - 18) {
          pdf.addPage();
          y = 20;
        }

        pdf.text(wrappedLine, margin, y);
        y += lineHeight;
      });
    });

    // Footer and page numbers
    const pageCount = pdf.internal.getNumberOfPages();

    for (let page = 1; page <= pageCount; page++) {
      pdf.setPage(page);

      pdf.setDrawColor(190, 220, 245);

      pdf.line(
        margin,
        pageHeight - 12,
        pageWidth - margin,
        pageHeight - 12
      );

      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(8);
      pdf.setTextColor(100, 120, 140);

      pdf.text(
        "Aksharam Trust | Meeting Minutes",
        margin,
        pageHeight - 7
      );

      pdf.text(
        `Page ${page} of ${pageCount}`,
        pageWidth - margin,
        pageHeight - 7,
        { align: "right" }
      );
    }

    const safeTitle = formData.meetingTitle
      .replace(/[^a-z0-9]/gi, "_")
      .replace(/^_+|_+$/g, "");

    pdf.save(
      `Meeting_Minutes_${safeTitle || "Report"}.pdf`
    );

    setMessage("PDF downloaded successfully.");
  } catch (error) {
    console.error("PDF download error:", error);
    setMessage("Unable to download the PDF. Please try again.");
  }
  };


  const handleSaveReport = async () => {
  if (!generatedReport) {
    setMessage("Please generate the meeting report before saving.");
    return;
  }

  try {
    setLoading(true);
    setMessage("");

    // Convert uploaded photos into persistent data URLs.
    const savedImages = await Promise.all(
      meetingImage.map((file) => fileToBase64(file))
    );

    const existingReports = JSON.parse(
      localStorage.getItem(STORAGE_KEY) || "[]"
    );

    const newReport = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      ...formData,
      generatedReport,
      images: savedImages,
      savedAt: new Date().toISOString(),
    };

    const updatedReports = [
      newReport,
      ...existingReports,
    ];

    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(updatedReports)
    );

    // Navigate to the View Meeting Minutes page after saving.
    navigate("/staff/meetings/manage", {
      state: {
        savedReportId: newReport.id,
      },
    });
  } catch (error) {
    console.error("Save report error:", error);

    setMessage(
      "Unable to save the report. Please try again. Storage may be full."
    );
  } finally {
    setLoading(false);
  }
  };


  // Reset form
  const handleReset = () => {
    imagePreview.forEach((preview) => {
      URL.revokeObjectURL(preview);
    });

    setFormData(initialFormData);
    setMeetingImage([]);
    setImagePreview([]);
    setGeneratedReport("");
    setMessage("");

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="meeting-page">

     <div className="student-form">

      {/* Header */}
      <header className="meeting-header">
        <div className="meeting-header-icon">👥</div>

        <div className="meeting-header-text">
          <h1>Meeting Minutes</h1>
          <p>
            Document meeting details, discussions and action items
          </p>
        </div>

         <button
            type="button"
            className="close-btn"
            onClick={() => navigate("/staff/meetings/manage")}
          >
            ×
          </button>

      </header>

      {/* Main Layout */}
      <div className="meeting-layout">
        {/* LEFT: Meeting Form */}
        <section className="meeting-form-card">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleGenerateReport();
            }}
          >
            <div className="meeting-top-grid">
              {/* Meeting Image */}
              <div className="meeting-image-section">
                <label className="meeting-label">
                  <span className="meeting-label-icon">▧</span>
                  Meeting Image
                </label>

               <div
                  className="meeting-upload-box"
                  onClick={() => fileInputRef.current?.click()}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => {
                    e.preventDefault();

                    const files = Array.from(e.dataTransfer.files || []);

                    if (files.length > 0) {
                      const transfer = new DataTransfer();

                      files.forEach((file) => transfer.items.add(file));

                      if (fileInputRef.current) {
                        fileInputRef.current.files = transfer.files;
                        handleImageChange({
                          target: fileInputRef.current,
                        });
                      }
                    }
                  }}
                >
                  {imagePreview.length > 0 ? (
                    <div className="meeting-image-preview">
                      {imagePreview.map((preview, index) => (
                        <div
                          key={`${preview}-${index}`}
                          style={{
                            position: "relative",
                            display: "inline-block",
                            margin: "5px",
                          }}
                        >
                          <img
                            src={preview}
                            alt={`Meeting ${index + 1}`}
                            style={{
                              width: "100px",
                              height: "100px",
                              objectFit: "cover",
                              borderRadius: "6px",
                            }}
                          />

                          <button
                            type="button"
                            className="meeting-remove-image"
                            onClick={(e) => {
                              e.stopPropagation();
                              removeImage(index);
                            }}
                            aria-label={`Remove photo ${index + 1}`}
                          >
                            ×
                          </button>
                        </div>
                      ))}

                      <p>Click here to select more photos</p>
                    </div>
                  ) : (
                    <>
                      <div className="meeting-upload-icon">▧+</div>
                      <strong>Click to upload photos</strong>
                      <span>or drag and drop multiple photos</span>
                      <small>JPG, PNG — Maximum 5 MB per photo</small>
                    </>
                  )}

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/jpeg,image/png"
                    multiple
                    onChange={handleImageChange}
                    hidden
                  />
                </div>
              </div>

              {/* Basic Meeting Details */}
              <div className="meeting-basic-fields">
                <div className="meeting-field-row">
                  <div className="meeting-field">
                    <label className="meeting-label" htmlFor="date">
                      <span className="meeting-label-icon">▦</span>
                      Date <span className="required">*</span>
                    </label>

                    <input
                      id="date"
                      type="date"
                      name="date"
                      value={formData.date}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="meeting-field">
                    <label className="meeting-label" htmlFor="time">
                      <span className="meeting-label-icon">◷</span>
                      Time <span className="required">*</span>
                    </label>

                    <input
                      id="time"
                      type="time"
                      name="time"
                      value={formData.time}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className="meeting-field">
                  <label className="meeting-label" htmlFor="meetingTitle">
                    <span className="meeting-label-icon">▤</span>
                    Meeting Title <span className="required">*</span>
                  </label>

                  <input
                    id="meetingTitle"
                    type="text"
                    name="meetingTitle"
                    placeholder="Enter meeting title"
                    value={formData.meetingTitle}
                    onChange={handleChange}
                    maxLength={150}
                    required
                  />
                </div>

                <div className="meeting-field">
                  <label className="meeting-label" htmlFor="facilitator">
                    <span className="meeting-label-icon">♟</span>
                    Meeting Facilitator{" "}
                    <span className="required">*</span>
                  </label>

                  <input
                    id="facilitator"
                    type="text"
                    name="facilitator"
                    placeholder="Enter facilitator name"
                    value={formData.facilitator}
                    onChange={handleChange}
                    maxLength={100}
                    required
                  />
                </div>

                <div className="meeting-field">
                  <label className="meeting-label" htmlFor="participants">
                    <span className="meeting-label-icon">♟</span>
                    Participants <span className="required">*</span>
                  </label>

                  <input
                    id="participants"
                    type="text"
                    name="participants"
                    placeholder="Enter names separated by commas"
                    value={formData.participants}
                    onChange={handleChange}
                    maxLength={500}
                    required
                  />

                  <small className="meeting-hint">
                    Example: John Doe, Jane Smith, Robert Wilson
                  </small>
                </div>
              </div>
            </div>

            {/* Key Discussion Points */}
            <div className="meeting-section meeting-discussion-section">
              <label
                className="meeting-label"
                htmlFor="discussionPoints"
              >
                <span className="meeting-label-icon">☰</span>
                Key Discussion Points{" "}
                <span className="required">*</span>
              </label>

              <textarea
                id="discussionPoints"
                name="discussionPoints"
                placeholder="Enter key discussion points from the meeting..."
                value={formData.discussionPoints}
                onChange={handleChange}
                maxLength={1000}
                required
              />

              <div className="meeting-character-count">
                {formData.discussionPoints.length}/1000
              </div>
            </div>

            {/* Decisions and Next Steps */}
            <div className="meeting-two-column">
              <div className="meeting-section">
                <label className="meeting-label" htmlFor="decisionsMade">
                  <span className="meeting-label-icon">☑</span>
                  Decisions Made <span className="required">*</span>
                </label>

                <textarea
                  id="decisionsMade"
                  name="decisionsMade"
                  placeholder="Enter decisions made during the meeting..."
                  value={formData.decisionsMade}
                  onChange={handleChange}
                  maxLength={500}
                  required
                />

                <div className="meeting-character-count">
                  {formData.decisionsMade.length}/500
                </div>
              </div>

              <div className="meeting-section">
                <label className="meeting-label" htmlFor="nextStep">
                  <span className="meeting-label-icon">➜</span>
                  Next Step <span className="required">*</span>
                </label>

                <textarea
                  id="nextStep"
                  name="nextStep"
                  placeholder="Enter next steps and action items..."
                  value={formData.nextStep}
                  onChange={handleChange}
                  maxLength={500}
                  required
                />

                <div className="meeting-character-count">
                  {formData.nextStep.length}/500
                </div>
              </div>
            </div>

            {/* Status and Remarks */}
            <div className="meeting-two-column">
              <div className="meeting-section meeting-status-section">
                <label className="meeting-label" htmlFor="status">
                  <span className="meeting-label-icon">⚑</span>
                  Status <span className="required">*</span>
                </label>

                <select
                  id="status"
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select status</option>
                  <option value="Scheduled">Scheduled</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Completed">Completed</option>
                  <option value="Pending">Pending</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>

              <div className="meeting-section">
                <label className="meeting-label" htmlFor="remarks">
                  <span className="meeting-label-icon">▤</span>
                  Remarks
                </label>

                <textarea
                  id="remarks"
                  name="remarks"
                  placeholder="Enter any additional remarks..."
                  value={formData.remarks}
                  onChange={handleChange}
                  maxLength={500}
                />

                <div className="meeting-character-count">
                  {formData.remarks.length}/500
                </div>
              </div>
            </div>

            {/* Action Buttons */}
         <div className="meeting-actions">
              <button
                type="submit"
                className="meeting-btn meeting-btn-primary"
                disabled={loading}
              >
                ✨ {loading ? "Generating..." : "AI Generate Report"}
              </button>

              <button
                type="button"
                className="meeting-btn meeting-btn-outline"
                onClick={handleReset}
                disabled={loading}
              >
                ⟳ Reset
              </button>

              <button
                type="button"
                className="meeting-btn meeting-btn-download"
                onClick={handleDownloadPDF}
                disabled={!generatedReport || loading}
              >
                ⇩ Download Minutes
              </button>

              <button
                type="button"
                className="meeting-btn meeting-btn-primary"
                onClick={handleSaveReport}
                disabled={!generatedReport || loading}
              >
                {loading ? "Saving..." : "Save Report"}
              </button>
            </div>

            {message && (
              <div
                className={
                  message.includes("successfully")
                    ? "meeting-message meeting-message-success"
                    : "meeting-message meeting-message-error"
                }
                role="status"
              >
                {message}
              </div>
            )}
          </form>
        </section>

        {/* RIGHT: Generated Report Preview */}
        <aside className="meeting-report-card">
          <div className="meeting-report-header">
            <div>
              <span className="meeting-report-sparkle">✦</span>
              <h2>AI Generated Report</h2>
            </div>

            <span className="meeting-ai-badge">
              ✧ Powered by AI
            </span>
          </div>

          <div className="meeting-report-body">
            {generatedReport ? (
              <div className="meeting-report-paper">
                <div className="meeting-report-title">
                  <span className="meeting-report-document-icon">▤</span>
                  <h3>Meeting Minutes Report</h3>
                  <strong>Aksharam Trust</strong>
                  <small>Education • Care • Compassion</small>
                </div>

                <div className="meeting-report-content">
                  {generatedReport
                    .split("\n")
                    .filter((line) => line.trim() !== "")
                    .map((line, index) => {
                      const isHeading =
                        /^\d+\.\s/.test(line) ||
                        line === "MEETING MINUTES REPORT" ||
                        line === "AKSHARAM TRUST" ||
                        line.startsWith("Prepared for");

                      return (
                        <p
                          key={`${index}-${line}`}
                          className={
                            isHeading
                              ? "meeting-report-line meeting-report-heading"
                              : "meeting-report-line"
                          }
                        >
                          {line}
                        </p>
                      );
                    })}
                </div>

                <div className="meeting-report-footer">
                  <span>✦ Generated for Aksharam Trust</span>
                  <span>{new Date().toLocaleDateString()}</span>
                </div>
              </div>
            ) : (
              <div className="meeting-report-empty">
                <div className="meeting-empty-icon">✧</div>

                <h3>Your Meeting Report</h3>

                <p>
                  Complete the meeting form and click{" "}
                  <strong>AI Generate Report</strong> to create a
                  structured report preview here.
                </p>

                <ul>
                  <li>Meeting details and participants</li>
                  <li>Discussion points and decisions</li>
                  <li>Action items and next steps</li>
                  <li>Meeting status and remarks</li>
                </ul>
              </div>
            )}
          </div>
        </aside>
      </div>
      </div>
    </div>
  );
};

export default MeetingMinutes;