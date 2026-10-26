import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./ViewDocument.css";
import logo from "../assets/aksharam-logo.jpeg";

const ViewDocument = ({ role = "staff" }) => {
  const navigate = useNavigate();

  /* ================= ROLE ================= */

  const isAdmin = role === "admin";
  const isStaff = role === "staff";

  /* ================= SEARCH AND FILTER ================= */

  const [search, setSearch] = useState("");
  const [fileType, setFileType] = useState("All");
  const [selectedMonth, setSelectedMonth] = useState("All");
  const [selectedYear, setSelectedYear] = useState("All");

  /* ================= MONTH OPTIONS ================= */

  const monthOptions = [
    { value: "01", label: "January" },
    { value: "02", label: "February" },
    { value: "03", label: "March" },
    { value: "04", label: "April" },
    { value: "05", label: "May" },
    { value: "06", label: "June" },
    { value: "07", label: "July" },
    { value: "08", label: "August" },
    { value: "09", label: "September" },
    { value: "10", label: "October" },
    { value: "11", label: "November" },
    { value: "12", label: "December" },
  ];

  /* ================= DEFAULT DOCUMENTS ================= */

  const defaultDocuments = [
    {
      id: 1,
      documentName: "Annual Report 2026",
      documentType: "PDF",
      fileName: "annual-report-2026.pdf",
      fileSize: "2.4 MB",
      uploadedBy: "Admin",
      uploadedAt: "2026-10-08T10:30",
      fileData: "",
    },
    {
      id: 2,
      documentName: "Student Registration Guidelines",
      documentType: "DOCX",
      fileName: "student-registration.docx",
      fileSize: "850 KB",
      uploadedBy: "Staff",
      uploadedAt: "2026-10-07T14:15",
      fileData: "",
    },
    {
      id: 3,
      documentName: "Meeting Minutes",
      documentType: "PDF",
      fileName: "meeting-minutes.pdf",
      fileSize: "1.2 MB",
      uploadedBy: "Admin",
      uploadedAt: "2026-10-06T11:45",
      fileData: "",
    },
    {
      id: 4,
      documentName: "Student Details",
      documentType: "XLSX",
      fileName: "student-details.xlsx",
      fileSize: "620 KB",
      uploadedBy: "Staff",
      uploadedAt: "2026-10-05T09:20",
      fileData: "",
    },
  ];

  /* ================= LOAD DOCUMENTS ================= */

const [documents, setDocuments] = useState(() => {
  const savedDocuments = localStorage.getItem(
    "aksharam_documents"
  );

  if (savedDocuments) {
    try {
      return JSON.parse(savedDocuments);
    } catch (error) {
      console.error("Error loading documents:", error);
    }
  }

  return defaultDocuments;
});

  /* ================= SAVE DOCUMENTS ================= */

  useEffect(() => {
    try {
      localStorage.setItem(
        "aksharam_documents",
        JSON.stringify(documents)
      );
    } catch (error) {
      console.error("Error saving documents:", error);

      alert(
        "Unable to save documents. The browser storage may be full."
      );
    }
  }, [documents]);

  /* ================= DOCUMENT TYPE OPTIONS ================= */

  const documentTypes = [
    "All",
    "PDF",
    "DOC",
    "DOCX",
    "XLS",
    "XLSX",
    "PPT",
    "PPTX",
    "TXT",
    "IMAGE",
    "OTHER",
  ];

  /* ================= SEARCH, MONTH, YEAR AND TYPE FILTERS ================= */

  const filteredDocuments = documents.filter((documentItem) => {
    const searchText = search.toLowerCase();

    const documentName = (
      documentItem.documentName || ""
    ).toLowerCase();

    const fileName = (
      documentItem.fileName || ""
    ).toLowerCase();

    const uploadedBy = (
      documentItem.uploadedBy || ""
    ).toLowerCase();

    const matchesSearch =
      documentName.includes(searchText) ||
      fileName.includes(searchText) ||
      uploadedBy.includes(searchText);

    const matchesType =
      fileType === "All" ||
      documentItem.documentType === fileType;

    // Support both uploadedAt and older date fields
    const dateValue =
      documentItem.uploadedAt ||
      documentItem.uploadedDate ||
      "";

    const date = dateValue ? new Date(dateValue) : null;

    const validDate =
      date && !Number.isNaN(date.getTime());

    const month = validDate
      ? String(date.getMonth() + 1).padStart(2, "0")
      : "";

    const year = validDate
      ? String(date.getFullYear())
      : "";

    const matchesMonth =
      selectedMonth === "All" ||
      month === selectedMonth;

    const matchesYear =
      selectedYear === "All" ||
      year === String(selectedYear);

    return (
      matchesSearch &&
      matchesType &&
      matchesMonth &&
      matchesYear
    );
  }); 

  /* ================= SUMMARY COUNTS ================= */

  const totalDocuments = documents.length;

  const pdfDocuments = documents.filter(
    (document) => document.documentType === "PDF"
  ).length;

  const wordDocuments = documents.filter(
    (document) =>
      document.documentType === "DOC" ||
      document.documentType === "DOCX"
  ).length;

  const otherDocuments = documents.filter(
    (document) =>
      !["PDF", "DOC", "DOCX"].includes(
        document.documentType
      )
  ).length;

  /* ================= FORMAT DATE AND TIME ================= */

  const formatDateTime = (dateTime) => {
    if (!dateTime) return "—";

    const date = new Date(dateTime);

    if (Number.isNaN(date.getTime())) {
      return dateTime;
    }

    return date.toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  /* ================= FILE ICON ================= */

  const getFileIcon = (type) => {
    switch (type) {
      case "PDF":
        return "📕";

      case "DOC":
      case "DOCX":
        return "📘";

      case "XLS":
      case "XLSX":
        return "📗";

      case "PPT":
      case "PPTX":
        return "📙";

      case "IMAGE":
        return "🖼️";

      case "TXT":
        return "📄";

      default:
        return "📁";
    }
  };

  /* ================= HOME ================= */

  const handleHome = () => {
    if (isAdmin) {
      navigate("/admin/dashboard");
    } else {
      navigate("/staff/dashboard");
    }
  };

  /* ================= UPLOAD DOCUMENT ================= */

  const handleUploadDocument = () => {
    if (!isStaff) return;

    navigate("/documents/upload");
  };

  /* ================= VIEW DOCUMENT ================= */

  const handleViewDocument = (document) => {
    if (!document.fileData) {
      alert(
        "The file content is not available. Please upload the actual document."
      );
      return;
    }

    const newWindow = window.open(
      document.fileData,
      "_blank",
      "noopener,noreferrer"
    );

    if (!newWindow) {
      alert(
        "The browser blocked the document window. Please allow pop-ups and try again."
      );
    }
  };

  /* ================= DOWNLOAD DOCUMENT ================= */

  const handleDownloadDocument = (documentItem) => {
    if (!documentItem.fileData) {
      alert(
        "The actual file is not available for download. Please upload the document again."
      );
      return;
    }

    try {
      // Create a download link using the browser's document object
      const link = window.document.createElement("a");

      link.href = documentItem.fileData;

      link.download =
        documentItem.fileName ||
        documentItem.documentName ||
        "document";

      // Add the link to the page
      window.document.body.appendChild(link);

      // Trigger the download
      link.click();

      // Remove the temporary link
      window.document.body.removeChild(link);
    } catch (error) {
      console.error("Document download failed:", error);

      alert("Unable to download the document. Please try again.");
    }
  };

  /* ================= DELETE DOCUMENT ================= */

  const handleDeleteDocument = (id) => {
    if (!isStaff) return;

    const confirmDelete = window.confirm(
      "Are you sure you want to delete this document?"
    );

    if (!confirmDelete) return;

    setDocuments((previousDocuments) =>
      previousDocuments.filter(
        (document) => document.id !== id
      )
    );
  };

/* ================= RESET FILTERS ================= */

  const handleResetFilters = () => {
    setSearch("");
    setFileType("All");
    setSelectedMonth("All");
    setSelectedYear("All");
  }; 


  return (
    <div className="document-dashboard">

      {/* ================= NAVBAR ================= */}

      <header className="document-navbar">

        <div className="document-navbar-brand">
          <img
            src={logo}
            alt="Aksharam Trust"
          />
        </div>

        <nav className="document-navbar-menu">

          <button
            className="document-nav-home "
            onClick={handleHome}
          >
            <span>🏠</span>
            <span>Home</span>
          </button>

          <button
            className="document-nav-module active"
            onClick={() => navigate("/staff/documents/manage")}
          >
            <span>📁</span>
            <span>Documents</span>
          </button>

        </nav>

      </header>

      {/* ================= MAIN PAGE ================= */}

      <main className="document-page">

        {/* ================= PAGE HEADER ================= */}

        <section className="document-header">

          <div className="document-header-content">

            <div className="document-header-icon">
              📂
            </div>

            <div>
              <h2>Document Management</h2>

              <p>
                {isAdmin
                  ? "View and monitor all documents uploaded to Aksharam Trust."
                  : "Upload, view and manage important organizational documents."}
              </p>
            </div>

          </div>

          {isStaff && (
            <button
              className="document-upload-btn"
              onClick={handleUploadDocument}
            >
              <span>＋</span>
              Upload Document
            </button>
          )}

        </section>

        {/* ================= SUMMARY CARDS ================= */}

        <section className="document-summary-cards">

          <div className="document-summary-card">

            <div className="document-summary-icon total-icon">
              📁
            </div>

            <div>
              <span>Total Documents</span>
              <strong>{totalDocuments}</strong>
              <small>All uploaded files</small>
            </div>

          </div>

          <div className="document-summary-card">

            <div className="document-summary-icon pdf-icon">
              📕
            </div>

            <div>
              <span>PDF Documents</span>
              <strong>{pdfDocuments}</strong>
              <small>PDF files</small>
            </div>

          </div>

          <div className="document-summary-card">

            <div className="document-summary-icon word-icon">
              📘
            </div>

            <div>
              <span>Word Documents</span>
              <strong>{wordDocuments}</strong>
              <small>DOC and DOCX files</small>
            </div>

          </div>

          <div className="document-summary-card">

            <div className="document-summary-icon other-icon">
              📄
            </div>

            <div>
              <span>Other Documents</span>
              <strong>{otherDocuments}</strong>
              <small>Excel, images and others</small>
            </div>

          </div>

        </section>

        {/* ================= SEARCH AND FILTER ================= */}

        <section className="document-filter-section">

          <div className="document-search-box">

            <span>⌕</span>

            <input
              type="text"
              placeholder="Search by document name, file name or uploader..."
              value={search}
              onChange={(event) =>
                setSearch(event.target.value)
              }
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
            <option value="All">All Months</option>

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
            value={selectedYear === "All" ? "" : selectedYear}
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

          <select
            className="document-type-filter"
            value={fileType}
            onChange={(event) =>
              setFileType(event.target.value)
            }
          >

            {documentTypes.map((type) => (
              <option
                key={type}
                value={type}
              >
                {type === "All"
                  ? "All Document Types"
                  : type}
              </option>
            ))}

          </select>

          {(
              search ||
              fileType !== "All" ||
              selectedMonth !== "All" ||
              selectedYear !== "All"
            ) && (
            <button
              className="document-reset-btn"
              onClick={handleResetFilters}
            >
              ↻ Reset
            </button>
          )}

        </section>

        {/* ================= DOCUMENT TABLE ================= */}

        <section className="document-table-container">

          <div className="document-table-heading">

            <div>
              <h3>Uploaded Documents</h3>

              <p>
                Showing {filteredDocuments.length} of{" "}
                {totalDocuments} documents
              </p>
            </div>

            <div className="document-table-heading-label">
              <span className="document-status-dot"></span>
              Document Library
            </div>

          </div>

          <div className="document-table-responsive">

            <table className="document-table">

              <thead>
                <tr>
                  <th>#</th>
                  <th>Document Name</th>
                  <th>Document Type</th>
                  <th>File Details</th>
                  <th>Uploaded By</th>
                  <th>Uploaded Date &amp; Time</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>

                {filteredDocuments.length > 0 ? (

                  filteredDocuments.map(
                    (document, index) => (

                      <tr key={document.id}>

                        <td>{index + 1}</td>

                        {/* DOCUMENT NAME */}

                        <td>

                          <div className="document-name-cell">

                            <div className="document-file-icon">
                              {getFileIcon(
                                document.documentType
                              )}
                            </div>

                            <div className="document-name-info">

                              <strong>
                                {document.documentName}
                              </strong>

                              <small>
                                {document.fileName}
                              </small>

                            </div>

                          </div>

                        </td>

                        {/* DOCUMENT TYPE */}

                        <td>

                          <span
                            className={`document-type-badge ${(
                              document.documentType || "other"
                            ).toLowerCase()}`}
                          >
                            {document.documentType}
                          </span>

                        </td>

                        {/* FILE DETAILS */}

                        <td>

                          <div className="document-file-details">

                            <strong>
                              {document.fileSize || "—"}
                            </strong>

                            <small>
                              {document.fileData
                                ? "File available"
                                : "Metadata only"}
                            </small>

                          </div>

                        </td>

                        {/* UPLOADED BY */}

                        <td>

                          <div className="document-uploader">

                            <div className="document-uploader-avatar">
                              {(document.uploadedBy || "U")
                                .charAt(0)
                                .toUpperCase()}
                            </div>

                            <span>
                              {document.uploadedBy || "Unknown"}
                            </span>

                          </div>

                        </td>

                        {/* DATE AND TIME */}

                        <td>

                          <div className="document-date-cell">

                            <strong>
                              {document.uploadedAt
                                ? new Date(
                                    document.uploadedAt
                                  ).toLocaleDateString(
                                    "en-IN",
                                    {
                                      day: "2-digit",
                                      month: "short",
                                      year: "numeric",
                                    }
                                  )
                                : "—"}
                            </strong>

                            <small>
                              {document.uploadedAt
                                ? new Date(
                                    document.uploadedAt
                                  ).toLocaleTimeString(
                                    "en-IN",
                                    {
                                      hour: "2-digit",
                                      minute: "2-digit",
                                      hour12: true,
                                    }
                                  )
                                : ""}
                            </small>

                          </div>

                        </td>

                        {/* ACTIONS */}

                        <td>

                          <div className="document-action-buttons">

                            <button
                              className="document-view-btn"
                              title="View Document"
                              aria-label="View document"
                              onClick={() =>
                                handleViewDocument(document)
                              }
                            >
                              👁
                            </button>

                            <button
                              className="document-download-btn"
                              title="Download Document"
                              aria-label="Download document"
                              onClick={() =>
                                handleDownloadDocument(
                                  document
                                )
                              }
                            >
                              ↓
                            </button>

                            {isStaff && (
                              <button
                                className="document-delete-btn"
                                title="Delete Document"
                                aria-label="Delete document"
                                onClick={() =>
                                  handleDeleteDocument(
                                    document.id
                                  )
                                }
                              >
                                🗑
                              </button>
                            )}

                          </div>

                        </td>

                      </tr>

                    )
                  )

                ) : (

                  <tr>
                    <td
                      colSpan="7"
                      className="document-empty-cell"
                    >

                      <div className="document-empty-state">

                        <span>📂</span>

                        <h3>No Documents Found</h3>

                        <p>
                          Try changing your search or
                          document type filter.
                        </p>

                        {isStaff && (
                          <button
                            className="document-empty-upload-btn"
                            onClick={handleUploadDocument}
                          >
                            ＋ Upload Document
                          </button>
                        )}

                      </div>

                    </td>
                  </tr>

                )}

              </tbody>

            </table>

          </div>

          {/* ================= TABLE FOOTER ================= */}

          <div className="document-table-footer">

            <span>
              Showing {filteredDocuments.length} document(s)
            </span>

            <span>
              Aksharam Trust · Document Library
            </span>

          </div>

        </section>

      </main>

    </div>
  );
};

export default ViewDocument;