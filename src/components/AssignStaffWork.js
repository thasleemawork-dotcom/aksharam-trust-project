import React, { useEffect, useMemo, useState } from "react";
import { useNavigate ,useLocation,useParams} from "react-router-dom";
import "./AssignStaffWork.css";

const STAFF_STORAGE_KEY = "aksharam_staff";
const WORK_STORAGE_KEY = "staffWork";

// Get the currently logged-in user.
const getLoggedInUser = () => {
  const possibleKeys = [
    "loggedInUser",
    "currentUser",
    "loggedInStaff",
    "user",
  ];

  for (const key of possibleKeys) {
    try {
      const storedValue = localStorage.getItem(key);

      if (!storedValue) continue;

      const user = JSON.parse(storedValue);

      if (
        user &&
        typeof user === "object" &&
        (user.name ||
          user.fullName ||
          user.username ||
          user.email)
      ) {
        return user;
      }
    } catch (error) {
      console.error(
        `Unable to read user details from "${key}":`,
        error
      );
    }
  }

  return null;
};

// Get the logged-in user's name.
const getUserName = (user) => {
  if (!user) return "";

  return (
    user.name ||
    user.fullName ||
    user.username ||
    user.email ||
    ""
  );
};

// Get the current date and time.
const getCurrentDateTime = () => {
  return new Date().toLocaleString();
};

// Get today's date in YYYY-MM-DD format.
const getLocalDate = () => {
  const date = new Date();

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

// Read staff records safely from localStorage.
const readStaffRecords = () => {
  try {
    const records = JSON.parse(
      localStorage.getItem(STAFF_STORAGE_KEY) || "[]"
    );

    return Array.isArray(records) ? records : [];
  } catch (error) {
    console.error("Unable to load staff records:", error);
    return [];
  }
};

const AssignStaffWork = () => {
  
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();

  const editingWork = location.state?.work || null;
  const isEditMode = Boolean(id || editingWork);

  // Form data.
  const [formData, setFormData] = useState({
    locality: "",
    staffMember: "",
    title: "",
    dueDate: "",
    description: "",
  });

  // Load saved staff records.
  const [staffRecords, setStaffRecords] = useState(
    readStaffRecords
  );

  // Get the logged-in user's name.
  const [assignedBy] = useState(() =>
    getUserName(getLoggedInUser())
  );

  // Automatically display the current date and time.
  const [assignedDateTime, setAssignedDateTime] = useState(
    getCurrentDateTime
  );

  // Refresh the displayed date and time every 30 seconds.
  useEffect(() => {
    const timer = window.setInterval(() => {
      setAssignedDateTime(getCurrentDateTime());
    }, 30000);

    return () => window.clearInterval(timer);
  }, []);

  // Refresh staff records when the page becomes active.
  useEffect(() => {
    const refreshStaff = () => {
      setStaffRecords(readStaffRecords());
    };

    window.addEventListener("focus", refreshStaff);
    window.addEventListener("storage", refreshStaff);

    return () => {
      window.removeEventListener("focus", refreshStaff);
      window.removeEventListener("storage", refreshStaff);
    };
  }, []);

  // Get unique localities from staff records.
  const localities = useMemo(() => {
    return [
      ...new Set(
        staffRecords
          .map((staff) =>
            String(staff.locality || staff.city || "").trim()
          )
          .filter(Boolean)
      ),
    ].sort((a, b) => a.localeCompare(b));
  }, [staffRecords]);

  // Filter staff based on the selected locality.
  const filteredStaff = useMemo(() => {
    if (!formData.locality) {
      return [];
    }

    return staffRecords.filter((staff) => {
      const staffLocality = String(
        staff.locality || staff.city || ""
      ).trim();

      const isSameLocality =
        staffLocality.toLowerCase() ===
        formData.locality.toLowerCase();

      // Exclude staff explicitly marked as inactive.
      const isActive =
        !staff.status ||
        String(staff.status).toLowerCase() === "active";

      return isSameLocality && isActive;
    });
  }, [staffRecords, formData.locality]);

  // Handle ordinary input changes.
  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previousData) => ({
      ...previousData,
      [name]: value,
    }));
  };

  // Clear the selected staff member when locality changes.
  const handleLocalityChange = (event) => {
    const selectedLocality = event.target.value;

    setFormData((previousData) => ({
      ...previousData,
      locality: selectedLocality,
      staffMember: "",
    }));
  };

  // Reset the form.
  const handleReset = () => {
    setFormData({
      locality: "",
      staffMember: "",
      title: "",
      dueDate: "",
      description: "",
    });
  };

  // Submit and save the staff work assignment.
  const handleSubmit = (event) => {
    event.preventDefault();

    // Validate the logged-in user.
    if (!assignedBy) {
      window.alert(
        "Logged-in user details could not be found. " +
          "Please check how your login page stores the current user's details."
      );

      return;
    }

    // Validate locality.
    if (!formData.locality) {
      window.alert("Please select a locality.");
      return;
    }

    // Validate staff member.
    if (!formData.staffMember) {
      window.alert("Please select a staff member.");
      return;
    }

    // Validate required work details.
    if (
      !formData.title.trim() ||
      !formData.dueDate ||
      !formData.description.trim()
    ) {
      window.alert("Please fill in all required fields.");
      return;
    }

    // Find the selected staff record.
    const selectedStaff = filteredStaff.find(
      (staff) =>
        String(staff.id ?? "") === formData.staffMember ||
        String(staff.employeeId ?? "") ===
          formData.staffMember
    );

    if (!selectedStaff) {
      window.alert(
        "The selected staff member is not available " +
          "in the chosen locality. Please select again."
      );

      return;
    }

    // Ensure the due date is today or a future date.
    if (formData.dueDate < getLocalDate()) {
      window.alert(
        "Please select today or a future date as the due date."
      );

      return;
    }

    const assignmentTime = new Date();

    const staffName =
      selectedStaff.name ||
      selectedStaff.fullName ||
      selectedStaff.username ||
      selectedStaff.employeeId;

    if (!staffName) {
      window.alert(
        "The selected staff record has no name. " +
          "Please update the staff profile first."
      );

      return;
    }

    // Create the new work record.
    const newWork = {
      id: `WORK-${Date.now()}`,

      locality: formData.locality,

      staffMember: staffName,

      staffId:
        selectedStaff.id ||
        selectedStaff.employeeId ||
        "",

      title: formData.title.trim(),

      dueDate: formData.dueDate,

      description: formData.description.trim(),

      assignedBy: assignedBy,

      assignedDate: assignmentTime.toISOString(),

      status: "Pending",
    };

    try {
      const storedWork = localStorage.getItem(
        WORK_STORAGE_KEY
      );

      const existingWork = storedWork
        ? JSON.parse(storedWork)
        : [];

      if (!Array.isArray(existingWork)) {
        window.alert(
          "Existing staff work data is not in the expected format. " +
            "No changes were saved."
        );

        return;
      }

      // Save the new work without removing existing records.
      localStorage.setItem(
        WORK_STORAGE_KEY,
        JSON.stringify([...existingWork, newWork])
      );

      window.alert("Staff work assigned successfully!");

      handleReset();

      setAssignedDateTime(getCurrentDateTime());
    } catch (error) {
      console.error("Error saving staff work:", error);

      window.alert(
        "Unable to save staff work. Please try again."
      );
    }
  };

  return (
    <main className="assign-work-page">
      <div className="assign-work-container">

        {/* Header */}
        <header className="assign-work-header">
          <div className="assign-work-title">
            <span
              className="assign-work-header-icon"
              aria-hidden="true"
            >
              💼
            </span>

            <div>
            <h2>{isEditMode ? "Edit Staff Work" : "Assign Staff Work"}</h2>
              <p>
                {isEditMode
                  ? "Update the assigned task and responsibilities"
                  : "Allocate tasks and responsibilities to staff members"}
              </p>
            </div>
          </div>

          <button
            type="button"
            className="assign-work-close-btn"
            onClick={() => navigate(-1)}
            aria-label="Go back"
            title="Go back"
          >
            &times;
          </button>
        </header>

        <form onSubmit={handleSubmit}>

          {/* Main form content */}
          <div className="assign-work-content">

            {/* Staff Information */}
            <section className="assign-work-section">
              <div className="assign-work-section-title">
                <span aria-hidden="true">👥</span>
                <span>Staff Information</span>
              </div>

              <div className="assign-work-grid">

                {/* Locality */}
                <div className="assign-work-form-group">
                  <label htmlFor="locality">
                    Locality <b>*</b>
                  </label>

                  <select
                    id="locality"
                    name="locality"
                    value={formData.locality}
                    onChange={handleLocalityChange}
                    required
                  >
                    <option value="">
                      Select locality
                    </option>

                    {localities.map((locality) => (
                      <option
                        key={locality}
                        value={locality}
                      >
                        {locality}
                      </option>
                    ))}
                  </select>

                  {localities.length === 0 && (
                    <small className="assign-work-help-text">
                      No localities found. Add locality or city
                      information to your staff records first.
                    </small>
                  )}
                </div>

                {/* Staff Member */}
                <div className="assign-work-form-group">
                  <label htmlFor="staffMember">
                    Staff Member <b>*</b>
                  </label>

                  <select
                    id="staffMember"
                    name="staffMember"
                    value={formData.staffMember}
                    onChange={handleChange}
                    disabled={!formData.locality}
                    required
                  >
                    <option value="">
                      {!formData.locality
                        ? "Select locality first"
                        : filteredStaff.length === 0
                        ? "No active staff in this locality"
                        : "Select staff member"}
                    </option>

                    {filteredStaff.map((staff, index) => {
                      const staffId = String(
                        staff.id ||
                          staff.employeeId ||
                          ""
                      );

                      const staffName =
                        staff.name ||
                        staff.fullName ||
                        staff.username;

                      return (
                        <option
                          key={staffId || `staff-${index}`}
                          value={staffId}
                          disabled={!staffId || !staffName}
                        >
                          {staffName || "Unnamed staff"}

                          {staff.employeeId
                            ? ` (${staff.employeeId})`
                            : ""}
                        </option>
                      );
                    })}
                  </select>

                  {formData.locality &&
                    filteredStaff.length === 0 && (
                      <small className="assign-work-help-text">
                        No active staff records were found
                        for this locality.
                      </small>
                    )}
                </div>

                {/* Assigned By */}
                <div className="assign-work-form-group">
                  <label htmlFor="assignedBy">
                    Assigned By
                  </label>

                  <input
                    id="assignedBy"
                    type="text"
                    value={assignedBy || "User not found"}
                    readOnly
                    className="assign-work-readonly"
                  />
                </div>

                {/* Assigned Date and Time */}
                <div className="assign-work-form-group">
                  <label htmlFor="assignedDateTime">
                    Assigned Date &amp; Time
                  </label>

                  <input
                    id="assignedDateTime"
                    type="text"
                    value={assignedDateTime}
                    readOnly
                    className="assign-work-readonly"
                  />
                </div>

              </div>
            </section>

            {/* Work Details */}
            <section className="assign-work-section">
              <div className="assign-work-section-title">
                <span aria-hidden="true">📋</span>
                <span>Work Details</span>
              </div>

              <div className="assign-work-grid">

                {/* Work Title */}
                <div className="assign-work-form-group">
                  <label htmlFor="title">
                    Work Title <b>*</b>
                  </label>

                  <input
                    id="title"
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="Enter work title"
                    maxLength={100}
                    required
                  />
                </div>

                {/* Due Date */}
                <div className="assign-work-form-group">
                  <label htmlFor="dueDate">
                    Due Date <b>*</b>
                  </label>

                  <input
                    id="dueDate"
                    type="date"
                    name="dueDate"
                    value={formData.dueDate}
                    onChange={handleChange}
                    min={getLocalDate()}
                    required
                  />
                </div>

                {/* Work Description */}
                <div className="assign-work-form-group assign-work-full-width">
                  <label htmlFor="description">
                    Work Description <b>*</b>
                  </label>

                  <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Enter the tasks, responsibilities, and instructions..."
                    rows={5}
                    maxLength={2000}
                    required
                  />

                  <small className="assign-work-character-count">
                    {formData.description.length}/2000 characters
                  </small>
                </div>

              </div>
            </section>

          </div>

          {/* Footer buttons */}
          <footer className="assign-work-footer">
            <button
              type="button"
              className="assign-work-reset-btn"
              onClick={handleReset}
            >
              ↻ Reset
            </button>

                    <button
            type="submit"
            className="assign-work-submit-btn"
          >
            {isEditMode ? "✓ Update Work" : "✓ Assign Work"}
          </button>
          </footer>

        </form>
      </div>
    </main>
  );
};

export default AssignStaffWork;