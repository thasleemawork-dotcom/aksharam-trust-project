import React, { useEffect, useMemo, useState } from "react";
import { useNavigate,useLocation } from "react-router-dom";
import "./ViewDonations.css";
import logo from "../assets/aksharam-logo.jpeg";

const STORAGE_KEY = "aksharam_donations";

const ViewDonations = ({ role = "staff" }) => {
const navigate = useNavigate();
const location = useLocation();

const isAdmin = role === "admin";
const isStaff = role === "staff";

const handleHome = () => {
  navigate(isAdmin ? "/admin/dashboard" : "/staff/dashboard");
};

const handleAccounts = () => {
  navigate("/accounts");
};

const handleDonations = () => {
  navigate(isAdmin ? "/admin/donations/manage": "/staff/donations/manage");
};

const handleAddDonation = () => {
     if (!isStaff) return;

    navigate("/donations/add");
};

const [donations, setDonations] = useState(() => {
  try {
    const storedData = localStorage.getItem(STORAGE_KEY);

    if (!storedData) {
      return [];
    }

    const parsedData = JSON.parse(storedData);

    return Array.isArray(parsedData) ? parsedData : [];
  } catch (error) {
    console.error("Error loading donations:", error);
    return [];
  }
});

// Listen for changes made in another browser tab.
// ========================================
// LOAD AND REFRESH DONATIONS
// ========================================

useEffect(() => {
  const loadDonations = () => {
    try {
      const storedData = localStorage.getItem(STORAGE_KEY);
      const parsedData = storedData ? JSON.parse(storedData) : [];

      if (Array.isArray(parsedData)) {
        setDonations(parsedData);
      } else {
        console.error("Saved donation data is not an array.");
      }
    } catch (error) {
      console.error("Error loading donations:", error);
    }
  };

  // Load donations when this page opens or its route changes.
  loadDonations();

  // Listen for changes from other browser tabs.
  window.addEventListener("storage", loadDonations);

  // Listen for donation updates made within this application.
  window.addEventListener("donationsUpdated", loadDonations);

  // Refresh when the browser window becomes active.
  window.addEventListener("focus", loadDonations);

  return () => {
    window.removeEventListener("storage", loadDonations);
    window.removeEventListener("donationsUpdated", loadDonations);
    window.removeEventListener("focus", loadDonations);
  };
}, [location.pathname]);

// ========================================
// FILTER STATES
// ========================================

const today = new Date();

const currentMonth = String(today.getMonth() + 1).padStart(2, "0");
const currentYear = String(today.getFullYear());

const [search, setSearch] = useState("");
const [statusFilter, setStatusFilter] = useState("All");
const [categoryFilter, setCategoryFilter] = useState("All");
const [monthFilter, setMonthFilter] = useState(currentMonth);
const [yearFilter, setYearFilter] = useState(currentYear);
const [selectedDonation, setSelectedDonation] = useState(null);


    // Filter donations by search, status, and category.
// ========================================
// FILTER DONATIONS
// ========================================

      const filteredDonations = useMemo(() => {
        const searchText = search.trim().toLowerCase();

        return donations.filter((donation) => {
          // Search filter
          const matchesSearch = [
            donation.donorName,
            donation.donorType,
            donation.projectCategory,
            donation.paymentMethod,
            donation.ref,
            donation.studentPurpose,
            donation.uploadedBy,
          ].some((value) =>
            String(value || "").toLowerCase().includes(searchText)
          );

          // Status filter
          const matchesStatus =
            statusFilter === "All" ||
            donation.status === statusFilter;

          // Category filter
          const matchesCategory =
            categoryFilter === "All" ||
            donation.projectCategory === categoryFilter;

          // Extract month and year from Date Received
          const dateReceived = String(donation.dateReceived || "");
          const donationYear = dateReceived.slice(0, 4);
          const donationMonth = dateReceived.slice(5, 7);

          // Month filter
          const matchesMonth =
            monthFilter === "All" ||
            donationMonth === monthFilter;

          // Year filter
         const matchesYear =
            yearFilter === "All" ||
            donationYear === String(yearFilter);

          return (
            matchesSearch &&
            matchesStatus &&
            matchesCategory &&
            matchesMonth &&
            matchesYear
          );
        });
      }, [
        donations,
        search,
        statusFilter,
        categoryFilter,
        monthFilter,
        yearFilter,
      ]);


const totalAmount = filteredDonations.reduce(
  (total, donation) => total + (Number(donation.amount) || 0),
  0
);

const receivedCount = filteredDonations.filter(
  (donation) => donation.status === "Received"
).length;

const pendingCount = filteredDonations.filter(
  (donation) => donation.status === "Pending"
).length;

const verifiedCount = filteredDonations.filter(
  (donation) => donation.status === "Verified"
).length;

// Navigation.


// ========================================
// RESET FILTERS
// ========================================

const handleReset = () => {
  setSearch("");
  setStatusFilter("All");
  setCategoryFilter("All");
  setMonthFilter(currentMonth);
  setYearFilter(currentYear);
};


  // View donation details.
  const handleView = (donation) => {
    setSelectedDonation(donation);
  };

  // Delete donation.
  const handleDelete = (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this donation?"
    );

    if (!confirmed) {
      return;
    }

    try {
      const updatedDonations = donations.filter(
        (donation) => String(donation.id) !== String(id)
      );

      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(updatedDonations)
      );

      setDonations(updatedDonations);

      if (
        selectedDonation &&
        String(selectedDonation.id) === String(id)
      ) {
        setSelectedDonation(null);
      }

      alert("Donation deleted successfully!");
    } catch (error) {
      console.error("Error deleting donation:", error);
      alert("Unable to delete the donation. Please try again.");
    }
  };


  // Edit donation.
  const handleEdit = (donation) => {
    navigate(`/donations/edit/${donation.id}`, {
      state: { donation },
    });
  };

  // Format amounts.
  const formatAmount = (amount) =>
    Number(amount || 0).toLocaleString("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 2,
    });

  // Format date.
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
    <div className="donations-dashboard">
{/* ================= NAVBAR ================= */}

<header className="donations-navbar">

  {/* Logo */}

  <div className="donations-brand">
    <img src={logo} alt="Aksharam Trust" />
  </div>

  {/* Navigation Menu */}

  <nav className="donations-nav-menu">

    {/* Home */}

    <button
      type="button"
      className="nav-home"
      onClick={handleHome}
    >
      <span>🏠</span>
      <span>Home</span>
    </button>

    {/* Accounts */}

    <button
      type="button"
      className={`nav-module ${
        location.pathname === "/accounts" ? "active" : ""
      }`}
      onClick={handleAccounts}
    >
      <span>📊</span>
      <span>Accounts</span>
    </button>

    {/* Donations */}

    <button
      type="button"
      className={`nav-module ${
        location.pathname.startsWith("/staff/donations/manage")
          ? "active"
          : ""
      }`}
      onClick={handleDonations}
    >
      <span>💙</span>
      <span>Donations</span>
    </button>

  </nav>

</header>

     {/* ================= MAIN PAGE ================= */}

      <main className="view-donations-page">
        {/* Page heading */}

        <section className="donations-page-header">
          <div className="donations-heading-icon">♥</div>

          <div className="donations-heading-text">
            <h1>View Donations</h1>
            <p>
              View, search, and manage donor contributions to Aksharam Trust.
            </p>
          </div>

          <button
            type="button"
            className="donations-add-btn"
            onClick={handleAddDonation}
          >
            + Add Donation
          </button>
        </section>

        {/* ================= SUMMARY CARDS ================= */}

        <section className="donations-summary">
          <div className="donations-summary-card">
            <div className="donations-summary-icon">♥</div>
            <div>
              <span>Total Donations</span>
             <strong>{filteredDonations.length}</strong>
            </div>
          </div>

          <div className="donations-summary-card">
            <div className="donations-summary-icon">₹</div>
            <div>
              <span>Total Amount</span>
              <strong>{formatAmount(totalAmount)}</strong>
            </div>
          </div>

          <div className="donations-summary-card">
            <div className="donations-summary-icon">✓</div>
            <div>
              <span>Received</span>
              <strong>{receivedCount}</strong>
            </div>
          </div>

          <div className="donations-summary-card">
            <div className="donations-summary-icon">◷</div>
            <div>
              <span>Pending</span>
              <strong>{pendingCount}</strong>
            </div>
          </div>

          <div className="donations-summary-card">
            <div className="donations-summary-icon">✔</div>
            <div>
              <span>Verified</span>
              <strong>{verifiedCount}</strong>
            </div>
          </div>
        </section>

        {/* ================= FILTERS ================= */}

        <section className="donations-filter-section">
          <div className="donations-search-box">
            <span>⌕</span>

            <input
              type="text"
              placeholder="Search donor, reference, purpose or staff..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {/* MONTH FILTER */}

          <select
            value={monthFilter}
            onChange={(e) => setMonthFilter(e.target.value)}
            aria-label="Filter by month"
          >
            <option value="All">All Months</option>
            <option value="01">January</option>
            <option value="02">February</option>
            <option value="03">March</option>
            <option value="04">April</option>
            <option value="05">May</option>
            <option value="06">June</option>
            <option value="07">July</option>
            <option value="08">August</option>
            <option value="09">September</option>
            <option value="10">October</option>
            <option value="11">November</option>
            <option value="12">December</option>
          </select>


          {/* YEAR FILTER */}
          <div className="donations-year-box">
            <input
              type="number"
              value={yearFilter === "All" ? "" : yearFilter}
              onChange={(e) => {
                const value = e.target.value;

                setYearFilter(value === "" ? "All" : value);
              }}
              placeholder="Enter year"
              min="1900"
              max="2100"
              aria-label="Filter donations by year"
            />
          </div>


          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            aria-label="Filter by project category"
          >
            <option value="All">All Categories</option>
            <option value="Education">Education</option>
            <option value="Healthcare">Healthcare</option>
            <option value="Community Development">
              Community Development
            </option>
            <option value="General Fund">General Fund</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            aria-label="Filter by donation status"
          >
            <option value="All">All Statuses</option>
            <option value="Received">Received</option>
            <option value="Pending">Pending</option>
            <option value="Verified">Verified</option>
          </select>

          {(
            search ||
            categoryFilter !== "All" ||
            statusFilter !== "All" ||
            monthFilter !== currentMonth ||
            yearFilter !== currentYear
          ) && (
            <button
              type="button"
              className="donations-reset-btn"
              onClick={handleReset}
            >
              ↻ Reset
            </button>
          )}
        </section>

        {/* ================= DONATION TABLE ================= */}

        <section className="donations-table-container">
          <div className="donations-table-heading">
            <div>
              <h2>Donation Records</h2>
              <span>
                Showing {filteredDonations.length} of {donations.length} donations
              </span>
            </div>
          </div>

          <div className="donations-table-responsive">
            <table className="donations-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Donor Details</th>
                  <th>Project / Fund <br/> category</th>
                  <th>Amount</th>
                  <th>Payment Method</th>
                  <th>Reference No.</th>
                  <th>Date Received</th>
                  <th>Purpose</th>
                  <th>Status</th>
                  {/* <th>Uploaded By</th>
                  <th>Uploading Date</th>
                  <th>Uploading Time</th> */}
                  {/* <th>Receipt</th> */}
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {filteredDonations.length > 0 ? (
                  filteredDonations.map((donation, index) => (
                    <tr key={donation.id}>
                      <td>{index + 1}</td>

                      <td>
                        <div className="donor-name-cell">
                          <div className="donor-avatar">
                            {(donation.donorName || "D")
                              .charAt(0)
                              .toUpperCase()}
                          </div>

                          <div>
                            <strong>
                              {donation.donorName || "—"}
                            </strong>
                            <small>
                              {donation.donorType || "—"}
                            </small>
                          </div>
                        </div>
                      </td>

                      <td>{donation.projectCategory || "—"}</td>

                      <td className="donation-amount">
                        {formatAmount(donation.amount)}
                      </td>

                      <td>{donation.paymentMethod || "—"}</td>

                      <td>{donation.ref || "—"}</td>

                      <td>{formatDate(donation.dateReceived)}</td>

                      <td className="donation-purpose">
                        {donation.studentPurpose || "—"}
                      </td>

                      <td>
                        <span
                          className={`donation-status ${
                            (donation.status || "Pending").toLowerCase()
                          }`}
                        >
                          {donation.status || "Pending"}
                        </span>
                      </td>

                      {/* <td>{donation.uploadedBy || "—"}</td>

                      <td>{formatDate(donation.uploadingDate)}</td>

                      <td>{donation.uploadingTime || "—"}</td>

                      <td>
                        {donation.receiptData ? (
                          <button
                            type="button"
                            className="receipt-view-btn"
                            onClick={() =>
                              window.open(
                                donation.receiptData,
                                "_blank",
                                "noopener,noreferrer"
                              )
                            }
                          >
                            View Receipt
                          </button>
                        ) : (
                          <span className="no-receipt">No receipt</span>
                        )}
                      </td> */}

                      <td>
                        <div className="donations-action-buttons">
                          <button
                            type="button"
                            className="donation-view-btn"
                            title="View Donation"
                            onClick={() => handleView(donation)}
                          >
                            👁
                          </button>

                          <button
                            type="button"
                            className="donation-edit-btn"
                            title="Edit Donation"
                            onClick={() => handleEdit(donation)}
                          >
                            ✎
                          </button>

                          <button
                            type="button"
                            className="donation-delete-btn"
                            title="Delete Donation"
                            onClick={() => handleDelete(donation.id)}
                          >
                            🗑
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="14" className="donations-empty">
                      <div className="donations-empty-icon">♥</div>
                      <h3>No Donations Found</h3>
                      <p>
                        No donation records match your search or filters.
                        Add a donation to see it here.
                      </p>

                      <button
                        type="button"
                        className="donations-add-btn"
                        onClick={handleAddDonation}
                      >
                        + Add Donation
                      </button>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>

        {/* ================= VIEW DETAILS MODAL ================= */}

        {selectedDonation && (
          <div
            className="donation-modal-overlay"
            onClick={() => setSelectedDonation(null)}
          >
            <section
              className="donation-details-modal"
              role="dialog"
              aria-modal="true"
              aria-labelledby="donation-modal-title"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="donation-modal-header">
                <div>
                  <h2 id="donation-modal-title">Donation Details</h2>
                  <p>Complete donation record</p>
                </div>

                <button
                  type="button"
                  className="donation-modal-close"
                  onClick={() => setSelectedDonation(null)}
                  aria-label="Close details"
                >
                  ×
                </button>
              </div>

              <div className="donation-details-grid">
                <div>
                  <span>Donor Name</span>
                  <strong>{selectedDonation.donorName || "—"}</strong>
                </div>

                <div>
                  <span>Donor Type</span>
                  <strong>{selectedDonation.donorType || "—"}</strong>
                </div>

                <div>
                  <span>Project / Fund</span>
                  <strong>{selectedDonation.projectCategory || "—"}</strong>
                </div>

                <div>
                  <span>Amount</span>
                  <strong>
                    {formatAmount(selectedDonation.amount)}
                  </strong>
                </div>

                <div>
                  <span>Payment Method</span>
                  <strong>{selectedDonation.paymentMethod || "—"}</strong>
                </div>

                <div>
                  <span>Reference Number</span>
                  <strong>{selectedDonation.ref || "—"}</strong>
                </div>

                <div>
                  <span>Date Received</span>
                  <strong>
                    {formatDate(selectedDonation.dateReceived)}
                  </strong>
                </div>

                <div>
                  <span>Status</span>
                  <strong>{selectedDonation.status || "—"}</strong>
                </div>

                <div>
                  <span>Student / Purpose</span>
                  <strong>
                    {selectedDonation.studentPurpose || "—"}
                  </strong>
                </div>

                <div>
                  <span>Uploaded By</span>
                  <strong>{selectedDonation.uploadedBy || "—"}</strong>
                </div>

                <div>
                  <span>Uploading Date</span>
                  <strong>
                    {formatDate(selectedDonation.uploadingDate)}
                  </strong>
                </div>

                <div>
                  <span>Uploading Time</span>
                  <strong>{selectedDonation.uploadingTime || "—"}</strong>
                </div>
              </div>

              {selectedDonation.receiptData && (
                <div className="donation-modal-receipt">
                  <span>Receipt</span>

                  {selectedDonation.receiptType?.startsWith("image/") ? (
                    <img
                      src={selectedDonation.receiptData}
                      alt="Donation receipt"
                    />
                  ) : (
                    <a
                      href={selectedDonation.receiptData}
                      target="_blank"
                      rel="noreferrer"
                    >
                      Open uploaded receipt
                    </a>
                  )}
                </div>
              )}

              <div className="donation-modal-actions">
                <button
                  type="button"
                  className="donation-modal-edit"
                  onClick={() => handleEdit(selectedDonation)}
                >
                  ✎ Edit Donation
                </button>

                <button
                  type="button"
                  className="donation-modal-done"
                  onClick={() => setSelectedDonation(null)}
                >
                  Close
                </button>
              </div>
            </section>
          </div>
        )}
      </main>
    </div>
  );
};

export default ViewDonations;