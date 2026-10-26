import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./DonationForm.css";

const STORAGE_KEY = "aksharam_donations";

const DonationForm = ({ role = "staff" }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const isAdmin = role === "admin";

  // ========================================
  // LOGGED-IN STAFF DETAILS
  // ========================================

  const staff = location.state?.staff;

  const uploadedBy =
    staff?.name ||
    staff?.fullName ||
    sessionStorage.getItem("staffName") ||
    "";

  // ========================================
  // CURRENT DATE AND TIME
  // ========================================

  const getCurrentDate = () => {
    const now = new Date();

    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  };

  const getCurrentTime = () => {
    return new Date().toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  const [uploadingDate, setUploadingDate] = useState(getCurrentDate);
  const [uploadingTime, setUploadingTime] = useState(getCurrentTime);

  // ========================================
  // FORM DATA
  // ========================================

  const initialFormData = {
    donorName: "",
    donorType: "",
    projectCategory: "",
    amount: "",
    paymentMethod: "",
    ref: "",
    dateReceived: "",
    studentPurpose: "",
    status: "",
  };

  const [formData, setFormData] = useState(initialFormData);

  const [receiptImage, setReceiptImage] = useState(null);
  const [previewImage, setPreviewImage] = useState("");

  // ========================================
  // AUTOMATIC DATE AND TIME UPDATE
  // ========================================

  useEffect(() => {
    const updateDateTime = () => {
      setUploadingDate(getCurrentDate());
      setUploadingTime(getCurrentTime());
    };

    updateDateTime();

    const timer = setInterval(updateDateTime, 1000);

    return () => clearInterval(timer);
  }, []);

  // ========================================
  // HANDLE FORM INPUTS
  // ========================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((previousData) => ({
      ...previousData,
      [name]: value,
    }));
  };

  // ========================================
  // HANDLE RECEIPT UPLOAD
  // ========================================

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];

    if (!file) {
      return;
    }

    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "application/pdf",
    ];

    if (!allowedTypes.includes(file.type)) {
      alert("Please upload a JPG, JPEG, PNG, or PDF file.");
      e.target.value = "";
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert("File size must not exceed 5 MB.");
      e.target.value = "";
      return;
    }

    // Release the previous preview URL, if any.
    if (previewImage) {
      URL.revokeObjectURL(previewImage);
    }

    setReceiptImage(file);

    if (file.type.startsWith("image/")) {
      setPreviewImage(URL.createObjectURL(file));
    } else {
      setPreviewImage("");
    }
  };

  // ========================================
  // RESET FORM
  // ========================================

  const handleReset = () => {
    if (previewImage) {
      URL.revokeObjectURL(previewImage);
    }

    setFormData({ ...initialFormData });
    setReceiptImage(null);
    setPreviewImage("");
    setUploadingDate(getCurrentDate());
    setUploadingTime(getCurrentTime());

    const fileInput = document.getElementById("donation-receipt");

    if (fileInput) {
      fileInput.value = "";
    }
  };

  // ========================================
  // SAVE DONATION TO LOCAL STORAGE
  // ========================================

  const saveDonation = (receiptData) => {
    try {
      const storedData = localStorage.getItem(STORAGE_KEY);
      const existingDonations = storedData
        ? JSON.parse(storedData)
        : [];

      if (!Array.isArray(existingDonations)) {
        throw new Error("Donation storage must contain an array.");
      }

      const donationData = {
        ...formData,
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        uploadedBy,
        uploadingDate,
        uploadingTime,
        receiptData,
        receiptType: receiptImage?.type || "",
        receiptName: receiptImage?.name || "",
      };

      const updatedDonations = [
        ...existingDonations,
        donationData,
      ];

      // Save all donation records.
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(updatedDonations)
      );

      // Verify that the donation was saved.
      const savedDonations = JSON.parse(
        localStorage.getItem(STORAGE_KEY) || "[]"
      );

      const donationExists =
        Array.isArray(savedDonations) &&
        savedDonations.some(
          (donation) =>
            String(donation.id) === String(donationData.id)
        );

      if (!donationExists) {
        alert("Donation could not be saved. Please try again.");
        return;
      }

      // Notify ViewDonations about the update.
      window.dispatchEvent(new Event("donationsUpdated"));

      alert("Donation saved successfully!");

      // Navigate after saving.
      navigate(
        isAdmin
          ? "/admin/donations/manage"
          : "/staff/donations/manage"
      );

      } catch (error) {
            console.error("Error saving donation:", error);

            alert(
              "Unable to save the donation. Your browser storage may be full. Please try again with a smaller receipt."
            );
          }
        };

  // ========================================
  // SUBMIT DONATION FORM
  // ========================================

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!uploadedBy.trim()) {
      alert(
        "The logged-in user's name was not found. Please log in again before uploading a donation."
      );
      return;
    }

    if (!receiptImage) {
      alert("Please upload the donation receipt.");
      return;
    }

    // Convert the receipt to a data URL before saving.
    const reader = new FileReader();

    reader.onload = () => {
      if (typeof reader.result !== "string") {
        alert("Unable to read the receipt. Please try again.");
        return;
      }

      saveDonation(reader.result);
    };

    reader.onerror = () => {
      alert("Unable to read the receipt. Please select the file again.");
    };

    reader.readAsDataURL(receiptImage);
  };

  // ========================================
  // CLEAN UP RECEIPT PREVIEW
  // ========================================

  useEffect(() => {
    return () => {
      if (previewImage) {
        URL.revokeObjectURL(previewImage);
      }
    };
  }, [previewImage]);

  // ========================================
  // PAGE UI
  // ========================================

  return (
    <div className="donation-page">
      <form className="donation-card" onSubmit={handleSubmit}>
        {/* FORM HEADER */}

        <div className="donation-header">
          <div className="donation-header-icon">💙</div>

          <div>
            <h1>Donation Form</h1>
            <p>
              Record and manage donor contributions to support our mission.
            </p>
          </div>
        </div>

        {/* DONATION FIELDS */}

        <div className="donation-grid">
          <div className="donation-field">
            <label htmlFor="donorName">
              Donor Name <span>*</span>
            </label>

            <input
              id="donorName"
              type="text"
              name="donorName"
              placeholder="Enter donor name"
              value={formData.donorName}
              onChange={handleChange}
              required
            />
          </div>

          <div className="donation-field">
            <label htmlFor="donorType">
              Donor Type <span>*</span>
            </label>

            <select
              id="donorType"
              name="donorType"
              value={formData.donorType}
              onChange={handleChange}
              required
            >
              <option value="">Select donor type</option>
              <option value="Individual">Individual</option>
              <option value="Organization">Organization</option>
              <option value="Company">Company</option>
              <option value="Trust">Trust</option>
            </select>
          </div>

          <div className="donation-field">
            <label htmlFor="projectCategory">
              Project / Fund Category <span>*</span>
            </label>

            <select
              id="projectCategory"
              name="projectCategory"
              value={formData.projectCategory}
              onChange={handleChange}
              required
            >
              <option value="">Select project or fund category</option>
              <option value="Education">Education</option>
              <option value="Healthcare">Healthcare</option>
              <option value="Community Development">
                Community Development
              </option>
              <option value="General Fund">General Fund</option>
            </select>
          </div>

          <div className="donation-field">
            <label htmlFor="amount">
              Amount (₹) <span>*</span>
            </label>

            <input
              id="amount"
              type="number"
              name="amount"
              placeholder="Enter amount"
              min="0.01"
              step="0.01"
              value={formData.amount}
              onChange={handleChange}
              required
            />
          </div>

          <div className="donation-field">
            <label htmlFor="paymentMethod">
              Payment Method <span>*</span>
            </label>

            <select
              id="paymentMethod"
              name="paymentMethod"
              value={formData.paymentMethod}
              onChange={handleChange}
              required
            >
              <option value="">Select payment method</option>
              <option value="Cash">Cash</option>
              <option value="UPI">UPI</option>
              <option value="Bank Transfer">Bank Transfer</option>
              <option value="Cheque">Cheque</option>
              <option value="Online">Online Payment</option>
            </select>
          </div>

          <div className="donation-field">
            <label htmlFor="ref">
              Reference Number (REF) <span>*</span>
            </label>

            <input
              id="ref"
              type="text"
              name="ref"
              placeholder="Enter reference number"
              value={formData.ref}
              onChange={handleChange}
              required
            />
          </div>

          <div className="donation-field">
            <label htmlFor="dateReceived">
              Date Received <span>*</span>
            </label>

            <input
              id="dateReceived"
              type="date"
              name="dateReceived"
              value={formData.dateReceived}
              onChange={handleChange}
              required
            />
          </div>

          {/* RECEIPT UPLOAD */}

          <div className="donation-field receipt-upload-field">
            <label htmlFor="donation-receipt">
              Receipt Upload <span>*</span>
            </label>

            <label className="receipt-dropzone">
              <input
                id="donation-receipt"
                type="file"
                accept=".jpg,.jpeg,.png,.pdf"
                onChange={handleImageChange}
                required
              />

              <span className="upload-icon">☁️⬆</span>

              <strong>Click to upload or drag and drop</strong>

              <small>PDF, JPG, JPEG, PNG (Max size: 5 MB)</small>

              {receiptImage && (
                <span className="selected-file">
                  {receiptImage.name}
                </span>
              )}
            </label>
          </div>

          {/* RECEIPT PREVIEW */}

          <div className="receipt-preview">
            {previewImage ? (
              <img
                src={previewImage}
                alt="Donation receipt preview"
              />
            ) : receiptImage?.type === "application/pdf" ? (
              <p>PDF receipt selected: {receiptImage.name}</p>
            ) : (
              <>
                <span className="preview-icon">▧</span>
                <p>No receipt selected</p>
              </>
            )}
          </div>

          <div className="donation-field">
            <label htmlFor="studentPurpose">
              Student or Purpose <span>*</span>
            </label>

            <textarea
              id="studentPurpose"
              name="studentPurpose"
              placeholder="Enter student name or donation purpose"
              value={formData.studentPurpose}
              onChange={handleChange}
              rows="3"
              required
            />
          </div>

          <div className="donation-field">
            <label htmlFor="status">
              Status <span>*</span>
            </label>

            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleChange}
              required
            >
              <option value="">Select status</option>
              <option value="Received">Received</option>
              <option value="Pending">Pending</option>
              <option value="Verified">Verified</option>
            </select>
          </div>

          {/* UPLOADED BY */}

          <div className="donation-field">
            <label htmlFor="uploadedBy">
              Uploaded By <span>*</span>
            </label>

            <input
              id="uploadedBy"
              type="text"
              value={uploadedBy}
              placeholder="Logged-in staff member"
              readOnly
              required
            />

            <small>
              Automatically filled from your staff account
            </small>
          </div>

          {/* UPLOADING DATE */}

          <div className="donation-field">
            <label htmlFor="uploadingDate">
              Uploading Date <span>*</span>
            </label>

            <input
              id="uploadingDate"
              type="date"
              value={uploadingDate}
              readOnly
              required
            />

            <small>Automatically filled</small>
          </div>

          {/* UPLOADING TIME */}

          <div className="donation-field">
            <label htmlFor="uploadingTime">
              Uploading Time <span>*</span>
            </label>

            <input
              id="uploadingTime"
              type="text"
              value={uploadingTime}
              readOnly
              required
            />

            <small>Automatically filled</small>
          </div>
        </div>

        {/* FORM BUTTONS */}

        <div className="donation-actions">
          <button
            type="button"
            className="reset-button"
            onClick={handleReset}
          >
            ↻ Reset
          </button>

          <button
            type="submit"
            className="submit-button"
          >
            ☁ Upload Donation
          </button>
        </div>
      </form>
    </div>
  );
};

export default DonationForm;