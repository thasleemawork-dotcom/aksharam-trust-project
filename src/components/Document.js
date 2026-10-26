import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Document.css";

const Document = () => {

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    documentName: "",
    documentType: "",
    uploadedBy: "",
    uploadedDate: "",
    uploadedTime: "",
  });

  const [selectedFile, setSelectedFile] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Automatically fill the current date and time
  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date();

      const date = now.toISOString().split("T")[0];

      const time = now.toLocaleTimeString("en-IN", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      });

      // Get the logged-in user's name from localStorage
      const loggedInUser =
        localStorage.getItem("loggedInUser") ||
        localStorage.getItem("userName") ||
        "";

      setFormData((prev) => ({
        ...prev,
        uploadedBy: loggedInUser,
        uploadedDate: date,
        uploadedTime: time,
      }));
    };

    updateDateTime();
  }, []);

  // Handle text and select fields
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setError("");
    setSuccess("");
  };

  // Handle file selection
  const handleFileChange = (e) => {
    const file = e.target.files[0];

    setError("");
    setSuccess("");

    if (!file) return;

    const allowedTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "image/jpeg",
      "image/png",
    ];

    if (!allowedTypes.includes(file.type)) {
      setError("Please select a PDF, DOC, DOCX, JPG, or PNG file.");
      e.target.value = "";
      setSelectedFile(null);
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("File size must not exceed 5 MB.");
      e.target.value = "";
      setSelectedFile(null);
      return;
    }

    setSelectedFile(file);
  };

  // Reset form
  const handleReset = () => {
    setFormData({
      documentName: "",
      documentType: "",
      uploadedBy:
        localStorage.getItem("loggedInUser") ||
        localStorage.getItem("userName") ||
        "",
      uploadedDate: new Date().toISOString().split("T")[0],
      uploadedTime: new Date().toLocaleTimeString("en-IN", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      }),
    });

    setSelectedFile(null);
    setError("");
    setSuccess("");

    const fileInput = document.getElementById("documentFile");

    if (fileInput) {
      fileInput.value = "";
    }
  };

  // Submit form
// Submit and save document
const handleSubmit = async (e) => {
  e.preventDefault();

  setError("");
  setSuccess("");

  // Validate document name
  if (!formData.documentName.trim()) {
    setError("Please enter the document name.");
    return;
  }

  // Validate document type
  if (!formData.documentType) {
    setError("Please select a document type.");
    return;
  }

  // Validate file
  if (!selectedFile) {
    setError("Please choose a document to upload.");
    return;
  }

  try {
    // Convert the uploaded file into a data URL
    const fileData = await new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = () => resolve(reader.result);
      reader.onerror = () => reject(
        new Error("Unable to read the selected file.")
      );

      reader.readAsDataURL(selectedFile);
    });

    // Get the existing documents
    const savedDocuments = localStorage.getItem(
      "aksharam_documents"
    );

    let existingDocuments = [];

    if (savedDocuments) {
      try {
        const parsedDocuments = JSON.parse(savedDocuments);

        if (Array.isArray(parsedDocuments)) {
          existingDocuments = parsedDocuments;
        }
      } catch {
        existingDocuments = [];
      }
    }

    // Detect the actual file format
    const extension = selectedFile.name
      .split(".")
      .pop()
      .toUpperCase();

    let detectedType = extension;

    if (["JPG", "JPEG", "PNG"].includes(extension)) {
      detectedType = "IMAGE";
    }

    // Create a document object compatible with ViewDocument.js
    const documentData = {
      id: Date.now(),
      documentName: formData.documentName.trim(),
      documentType: detectedType,
      category: formData.documentType,
      fileName: selectedFile.name,
      fileSize:
        selectedFile.size >= 1024 * 1024
          ? `${(selectedFile.size / (1024 * 1024)).toFixed(2)} MB`
          : `${(selectedFile.size / 1024).toFixed(2)} KB`,
      uploadedBy: formData.uploadedBy || "Staff",
      uploadedAt: new Date().toISOString(),
      uploadedDate: formData.uploadedDate,
      uploadedTime: formData.uploadedTime,
      fileData: fileData,
    };

    // Save the updated document list
    const updatedDocuments = [
      documentData,
      ...existingDocuments,
    ];

    localStorage.setItem(
      "aksharam_documents",
      JSON.stringify(updatedDocuments)
    );

    setSuccess("Document uploaded successfully!");

    // Navigate to the correct view page
    navigate("/staff/documents/manage");
  } catch (error) {
    console.error("Error uploading document:", error);

    if (
      error.name === "QuotaExceededError" ||
      error.name === "NS_ERROR_DOM_QUOTA_REACHED"
    ) {
      setError(
        "Browser storage is full. The file may be too large to save. Please use a smaller file or connect a backend."
      );
    } else {
      setError(
        "Unable to save the document. Please try again."
      );
    }
  }
};
  return (
    <div className="document-page">
      <div className="document-container">

        {/* Header */}
        <div className="viewdocument-header">
          <div className="viewdocument-header-icon">📄</div>

          <div className="viewdocument-header-text">
            <h1>Upload Document</h1>
            <p>Add and manage important documents</p>
          </div>
        </div>

        {/* Form Card */}
        <form className="document-form" onSubmit={handleSubmit}>

          {/* Document Name */}
          <div className="document-field">
            <label htmlFor="documentName">
              <span className="field-icon">📑</span>
              Document Name <span className="required">*</span>
            </label>

            <input
              type="text"
              id="documentName"
              name="documentName"
              placeholder="Enter document name"
              value={formData.documentName}
              onChange={handleChange}
              required
            />
          </div>

          {/* Document Type */}
          <div className="document-field">
            <label htmlFor="documentType">
              <span className="field-icon">🏷️</span>
              Document Type <span className="required">*</span>
            </label>

            <select
              id="documentType"
              name="documentType"
              value={formData.documentType}
              onChange={handleChange}
              required
            >
              <option value="">Select document type</option>
              <option value="Official Document">
                Official Document
              </option>
              <option value="Student Record">
                Student Record
              </option>
              <option value="Staff Record">
                Staff Record
              </option>
              <option value="Financial Document">
                Financial Document
              </option>
              <option value="Meeting Minutes">
                Meeting Minutes
              </option>
              <option value="Event Document">
                Event Document
              </option>
              <option value="Report">Report</option>
              <option value="Other">Other</option>
            </select>
          </div>

          {/* File Upload */}
          <div className="document-field document-file-field">
            <label htmlFor="documentFile">
              <span className="field-icon">📤</span>
              Choose File <span className="required">*</span>
            </label>

            <div className="document-upload-box">
              <input
                type="file"
                id="documentFile"
                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                onChange={handleFileChange}
                required
              />

              <label
                htmlFor="documentFile"
                className="document-upload-label"
              >
                <span className="upload-icon">☁️</span>

                <span className="upload-main-text">
                  Click to choose a file or drag and drop
                </span>

                <span className="upload-sub-text">
                  Supported formats: PDF, DOC, DOCX, JPG, PNG
                  <br />
                  Maximum file size: 5 MB
                </span>

                {selectedFile && (
                  <span className="selected-file-name">
                    ✓ {selectedFile.name}
                  </span>
                )}
              </label>
            </div>
          </div>

          {/* Uploaded By */}
          <div className="document-field">
            <label htmlFor="uploadedBy">
              <span className="field-icon">👤</span>
              Uploaded By <span className="required">*</span>
            </label>

            <input
              type="text"
              id="uploadedBy"
              name="uploadedBy"
              placeholder="Logged-in user"
              value={formData.uploadedBy}
              readOnly
              required
            />
          </div>

          {/* Uploaded Date */}
          <div className="document-field">
            <label htmlFor="uploadedDate">
              <span className="field-icon">📅</span>
              Uploaded Date <span className="required">*</span>
            </label>

            <input
              type="date"
              id="uploadedDate"
              name="uploadedDate"
              value={formData.uploadedDate}
              readOnly
              required
            />
          </div>

          {/* Uploaded Time */}
          <div className="document-field">
            <label htmlFor="uploadedTime">
              <span className="field-icon">🕒</span>
              Uploaded Time <span className="required">*</span>
            </label>

            <input
              type="text"
              id="uploadedTime"
              name="uploadedTime"
              value={formData.uploadedTime}
              readOnly
              required
            />
          </div>

          {/* Error Message */}
          {error && (
            <div className="document-message document-error">
              ⚠️ {error}
            </div>
          )}

          {/* Success Message */}
          {success && (
            <div className="document-message document-success">
              ✓ {success}
            </div>
          )}

          {/* Buttons */}
          <div className="document-form-actions">
            <button
              type="button"
              className="document-reset-btn"
              onClick={handleReset}
            >
              Reset
            </button>

            <button
              type="submit"
              className="document-submit-btn"
            >
              ☁️ Upload Document
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default Document;