import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./ViewStaffDiary.css";
import logo from "../assets/aksharam-logo.jpeg";

const ViewStaffDiary = ({ role = "staff" }) => {
  const navigate = useNavigate();

  // ========================================
  // ROLE
  // ========================================

  const normalizedRole = String(role).trim().toLowerCase();
  const isAdmin = normalizedRole === "admin";
  const isStaff = normalizedRole === "staff";

  // ========================================
  // TODAY'S LOCAL DATE
  // ========================================

  const getToday = () => {
    const date = new Date();

    return [
      date.getFullYear(),
      String(date.getMonth() + 1).padStart(2, "0"),
      String(date.getDate()).padStart(2, "0"),
    ].join("-");
  };

  const today = getToday();

  // ========================================
  // LOGGED-IN STAFF
  // ========================================

  const [loggedInStaff] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("loggedInStaff")) || {};
    } catch {
      return {};
    }
  });

  const loggedStaffName = String(
    loggedInStaff.name ||
      loggedInStaff.fullName ||
      loggedInStaff.staffName ||
      ""
  ).trim();

  const loggedStaffId = String(
    loggedInStaff.id ||
      loggedInStaff.staffId ||
      loggedInStaff.employeeId ||
      ""
  ).trim();

  const loggedStaffDepartment = String(
    loggedInStaff.department || ""
  ).trim();

  const loggedStaffLocality = String(
    loggedInStaff.city ||
      loggedInStaff.locality ||
      loggedInStaff.location ||
      ""
  ).trim();

  // ========================================
  // LOAD DIARIES
  // ========================================

  const [diaries, setDiaries] = useState(() => {
    try {
      const savedDiary = localStorage.getItem("staffDiary");

      if (!savedDiary) return [];

      const parsedDiary = JSON.parse(savedDiary);

      if (Array.isArray(parsedDiary)) {
        return parsedDiary;
      }

      if (parsedDiary && typeof parsedDiary === "object") {
        return [parsedDiary];
      }

      return [];
    } catch (error) {
      console.error("Unable to load staff diaries:", error);
      return [];
    }
  });

  // ========================================
  // FILTER STATES
  // ========================================

  const [search, setSearch] = useState("");
  const [selectedLocality, setSelectedLocality] = useState("All");
  const [selectedMonth, setSelectedMonth] = useState("All");
  const [selectedStatus, setSelectedStatus] = useState("All");

  // Admin can filter by staff name.
  // Staff cannot change this filter.
  const [selectedStaffName, setSelectedStaffName] = useState("All");

  // ========================================
  // VIEW MODAL
  // ========================================

  const [selectedDiary, setSelectedDiary] = useState(null);

  // ========================================
  // SAVE DIARIES
  // ========================================

  useEffect(() => {
    try {
      localStorage.setItem("staffDiary", JSON.stringify(diaries));
    } catch (error) {
      console.error("Unable to save staff diaries:", error);
    }
  }, [diaries]);

  // ========================================
  // NORMALIZE TEXT
  // ========================================

  const normalizeText = (value) =>
    String(value ?? "").trim().toLowerCase();

  // ========================================
  // STAFF IDENTITY HELPERS
  // ========================================

  const getDiaryStaffName = (diary) =>
    String(
      diary.staffName ||
        diary.name ||
        diary.staff?.name ||
        diary.staff?.fullName ||
        ""
    ).trim();

  const getDiaryStaffId = (diary) =>
    String(
      diary.staffId ||
        diary.employeeId ||
        diary.staff?.id ||
        diary.staff?.staffId ||
        diary.staff?.employeeId ||
        ""
    ).trim();

  const getDiaryDepartment = (diary) =>
    diary.department ||
    diary.staffDepartment ||
    diary.staff?.department ||
    (normalizeText(getDiaryStaffName(diary)) ===
    normalizeText(loggedStaffName)
      ? loggedStaffDepartment
      : "") ||
    "—";

  const getDiaryLocality = (diary) =>
    String(
      diary.locality ||
        diary.city ||
        diary.location ||
        diary.staff?.locality ||
        diary.staff?.city ||
        diary.staff?.location ||
        (normalizeText(getDiaryStaffName(diary)) ===
        normalizeText(loggedStaffName)
          ? loggedStaffLocality
          : "")
    ).trim();

  // ========================================
  // FORMAT DATE
  // ========================================

  const formatDate = (date) => {
    if (!date) return "—";

    const parts = String(date).split("-");

    if (parts.length !== 3) return date;

    return `${parts[2]}/${parts[1]}/${parts[0]}`;
  };

  // ========================================
  // TASK STATUS
  // ========================================

  const getTaskStatus = (task) =>
    normalizeText(task?.status || "Pending");

  const isTaskCompleted = (task) =>
    ["completed", "complete", "done"].includes(getTaskStatus(task));

  const getTaskCounts = (diary) => {
    const tasks = Array.isArray(diary.tasks) ? diary.tasks : [];

    const completed = tasks.filter(isTaskCompleted).length;

    return {
      total: tasks.length,
      completed,
      pending: tasks.length - completed,
    };
  };

  // ========================================
  // DIARY STATUS
  // ========================================

  const getDiaryStatus = (diary) => {
    const tasks = Array.isArray(diary.tasks) ? diary.tasks : [];

    if (tasks.length === 0) return "Pending";

    const completedCount = tasks.filter(isTaskCompleted).length;

    if (completedCount === tasks.length) {
      return "Completed";
    }

    if (
      tasks.some(
        (task) => getTaskStatus(task) === "in progress"
      )
    ) {
      return "In Progress";
    }

    if (completedCount > 0) {
      return "In Progress";
    }

    return "Pending";
  };

  // ========================================
  // STAFF DIRECTORY FOR ADMIN FILTER
  // ========================================

  const staffOptions = useMemo(() => {
    const staffMap = new Map();

    // Use the staff directory first.
    try {
      const savedStaff = JSON.parse(
        localStorage.getItem("aksharam_staff") || "[]"
      );

      if (Array.isArray(savedStaff)) {
        savedStaff.forEach((staff) => {
          const name = String(staff.name || staff.fullName || "").trim();

          if (!name) return;

          const id = String(
            staff.id || staff.staffId || staff.employeeId || ""
          ).trim();

          staffMap.set(normalizeText(name), {
            name,
            id,
            department: staff.department || "",
            locality:
              staff.city || staff.locality || staff.location || "",
          });
        });
      }
    } catch (error) {
      console.error("Unable to load staff directory:", error);
    }

    // Include names found in diary entries.
    diaries.forEach((diary) => {
      const name = getDiaryStaffName(diary);

      if (!name) return;

      const key = normalizeText(name);

      if (!staffMap.has(key)) {
        staffMap.set(key, {
          name,
          id: getDiaryStaffId(diary),
          department: getDiaryDepartment(diary),
          locality: getDiaryLocality(diary),
        });
      }
    });

    return Array.from(staffMap.values()).sort((a, b) =>
      a.name.localeCompare(b.name)
    );
  }, [diaries, loggedStaffName, loggedStaffDepartment, loggedStaffLocality]);

  // ========================================
  // STAFF IDENTITY MATCHING
  // ========================================

  const belongsToLoggedInStaff = (diary) => {
    // Never show all diaries to a staff user when their identity
    // cannot be identified.
    if (!loggedStaffId && !loggedStaffName) {
      return false;
    }

    const diaryStaffId = getDiaryStaffId(diary);
    const diaryStaffName = getDiaryStaffName(diary);

    // Prefer IDs when both identities have an ID.
    if (loggedStaffId && diaryStaffId) {
      return loggedStaffId === diaryStaffId;
    }

    // Fallback for older diary records that only saved a name.
    if (loggedStaffName && diaryStaffName) {
      return (
        normalizeText(loggedStaffName) ===
        normalizeText(diaryStaffName)
      );
    }

    return false;
  };

  // ========================================
  // MONTH OPTIONS
  // ========================================

  const monthOptions = useMemo(() => {
    const monthSet = new Set();

    diaries.forEach((diary) => {
      if (
        typeof diary.date === "string" &&
        /^\d{4}-\d{2}-\d{2}$/.test(diary.date)
      ) {
        monthSet.add(diary.date.slice(0, 7));
      }
    });

    // Ensure the current month is available.
    monthSet.add(today.slice(0, 7));

    return Array.from(monthSet).sort((a, b) => b.localeCompare(a));
  }, [diaries, today]);

  const formatMonth = (monthValue) => {
    if (!monthValue || !/^\d{4}-\d{2}$/.test(monthValue)) {
      return monthValue;
    }

    const [year, month] = monthValue.split("-").map(Number);

    return new Date(year, month - 1, 1).toLocaleDateString("en-IN", {
      month: "long",
      year: "numeric",
    });
  };

  // ========================================
  // LOCALITY OPTIONS
  // ========================================

  const localityOptions = useMemo(() => {
    const values = new Set();

    diaries.forEach((diary) => {
      const locality = getDiaryLocality(diary);

      if (locality) values.add(locality);
    });

    staffOptions.forEach((staff) => {
      if (staff.locality) values.add(staff.locality);
    });

    return ["All", ...Array.from(values).sort()];
  }, [diaries, staffOptions, loggedStaffName, loggedStaffLocality]);

  // ========================================
  // RESET STAFF FILTER IF NAME DISAPPEARS
  // ========================================

  useEffect(() => {
    if (
      selectedStaffName !== "All" &&
      !staffOptions.some(
        (staff) =>
          normalizeText(staff.name) ===
          normalizeText(selectedStaffName)
      )
    ) {
      setSelectedStaffName("All");
    }
  }, [staffOptions, selectedStaffName]);

  // ========================================
  // BASE DIARIES
  // Staff sees only their own diaries.
  // Admin sees all diaries.
  // ========================================

  const roleFilteredDiaries = useMemo(() => {
    if (isAdmin) return diaries;

    if (isStaff) {
      return diaries.filter(belongsToLoggedInStaff);
    }

    // Unknown roles have no access to diary records.
    return [];
  }, [
    diaries,
    isAdmin,
    isStaff,
    loggedStaffId,
    loggedStaffName,
  ]);

  // ========================================
  // SEARCH AND FILTER
  // ========================================

  const filteredDiaries = useMemo(() => {
    return roleFilteredDiaries.filter((diary) => {
      const staffName = getDiaryStaffName(diary);
      const department = getDiaryDepartment(diary);
      const locality = getDiaryLocality(diary);

      const tasks = Array.isArray(diary.tasks) ? diary.tasks : [];

      const taskText = tasks
        .map(
          (task) =>
            `${task.task || ""} ${task.remarks || ""} ${
              task.status || ""
            }`
        )
        .join(" ");

      const searchableText = [
        staffName,
        department,
        locality,
        diary.day || "",
        taskText,
      ]
        .join(" ")
        .toLowerCase();

      const matchesSearch = searchableText.includes(
        search.toLowerCase().trim()
      );

      const matchesLocality =
        selectedLocality === "All" ||
        normalizeText(locality) === normalizeText(selectedLocality);

      const matchesMonth =
        selectedMonth === "All" ||
        (diary.date || "").slice(0, 7) === selectedMonth;

      const matchesStatus =
        selectedStatus === "All" ||
        getDiaryStatus(diary) === selectedStatus;

      const matchesStaff =
        isStaff ||
        selectedStaffName === "All" ||
        normalizeText(staffName) ===
          normalizeText(selectedStaffName);

      return (
        matchesSearch &&
        matchesLocality &&
        matchesMonth &&
        matchesStatus &&
        matchesStaff
      );
    });
  }, [
    roleFilteredDiaries,
    search,
    selectedLocality,
    selectedMonth,
    selectedStatus,
    selectedStaffName,
    isStaff,
  ]);

  // ========================================
  // SELECTED STAFF DETAILS
  // ========================================

  const selectedStaffDetails = useMemo(() => {
    if (isStaff) {
      return {
        name: loggedStaffName,
        id: loggedStaffId,
        department: loggedStaffDepartment,
        locality: loggedStaffLocality,
      };
    }

    if (!isAdmin || selectedStaffName === "All") {
      return null;
    }

    const directoryEntry = staffOptions.find(
      (staff) =>
        normalizeText(staff.name) ===
        normalizeText(selectedStaffName)
    );

    const diaryEntry = diaries.find(
      (diary) =>
        normalizeText(getDiaryStaffName(diary)) ===
        normalizeText(selectedStaffName)
    );

    return {
      name: directoryEntry?.name || selectedStaffName,
      id: directoryEntry?.id || getDiaryStaffId(diaryEntry || {}),
      department:
        directoryEntry?.department ||
        (diaryEntry ? getDiaryDepartment(diaryEntry) : ""),
      locality:
        directoryEntry?.locality ||
        (diaryEntry ? getDiaryLocality(diaryEntry) : ""),
    };
  }, [
    isStaff,
    isAdmin,
    selectedStaffName,
    staffOptions,
    diaries,
    loggedStaffName,
    loggedStaffId,
    loggedStaffDepartment,
    loggedStaffLocality,
  ]);

  // ========================================
  // SUMMARY COUNTS
  // Based on the currently filtered diaries
  // ========================================

  const totalDiaries = filteredDiaries.length;

  const todayDiaries = filteredDiaries.filter(
    (diary) => diary.date === today
  ).length;

  const totalTasks = filteredDiaries.reduce(
    (total, diary) => total + getTaskCounts(diary).total,
    0
  );

  const completedTasks = filteredDiaries.reduce(
    (total, diary) => total + getTaskCounts(diary).completed,
    0
  );

  const pendingTasks = totalTasks - completedTasks;

  // ========================================
  // NAVIGATION
  // ========================================

  const handleHome = () => {
    navigate(isAdmin ? "/admin/dashboard" : "/staff/dashboard");
  };

  const handleStaff = () => {
    navigate(isAdmin ? "/admin/staff/manage" : "/staff/staff/manage");
  };

  const handleAssignWork = () => {
    navigate(
      isAdmin
        ? "/staff-assignwork/manage"
        : "/staff-assignwork/manage"
    );
  };

  const handleAttendance = () => {
    navigate("/staff-attendance/manage");
  };

  const handleDiary = () => {
    navigate("/staff-diary/manage");
  };

  // ========================================
  // ADD DIARY - STAFF ONLY
  // ========================================

  const handleAddDiary = () => {
    if (!isStaff) return;

    navigate("/staff/staffdiary/add");
  };

  // ========================================
  // VIEW DIARY
  // ========================================

  const handleView = (diary) => {
    setSelectedDiary(diary);
  };

  // ========================================
  // EDIT DIARY - STAFF ONLY
  // ========================================

  const handleEdit = (diary) => {
    if (!isStaff || !belongsToLoggedInStaff(diary)) return;

    if (diary.date !== today) {
      alert("You can edit your diary only for today.");
      return;
    }

    localStorage.setItem("editingStaffDiary", JSON.stringify(diary));

    navigate("/staff/diary/edit", {
      state: { diary },
    });
  };

  // ========================================
  // DELETE DIARY - STAFF ONLY
  // ========================================

  const handleDelete = (diary) => {
    if (!isStaff || !belongsToLoggedInStaff(diary)) return;

    if (diary.date !== today) {
      alert("You can delete your diary only for today.");
      return;
    }

    const confirmed = window.confirm(
      "Are you sure you want to delete your diary entry?"
    );

    if (!confirmed) return;

    setDiaries((previousDiaries) =>
      previousDiaries.filter((item) => item !== diary)
    );

    setSelectedDiary((current) =>
      current === diary ? null : current
    );
  };

  // ========================================
  // RESET FILTERS
  // ========================================

  const handleReset = () => {
    setSearch("");
    setSelectedLocality("All");
    setSelectedMonth("All");
    setSelectedStatus("All");

    if (isAdmin) {
      setSelectedStaffName("All");
    }
  };

  const hasActiveFilters =
    Boolean(search) ||
    selectedLocality !== "All" ||
    selectedMonth !== "All" ||
    selectedStatus !== "All" ||
    (isAdmin && selectedStaffName !== "All");

  // ========================================
  // UI
  // ========================================

  return (
    <div className="dashboard diary-dashboard">
      {/* NAVBAR - SAME STRUCTURE AS VIEW STAFF */}

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
            🏠 Home
          </button>

          <button
            type="button"
            className="nav-module"
            onClick={handleStaff}
          >
            👥 Staff
          </button>

          <button
            type="button"
            className="nav-module"
            onClick={handleAssignWork}
          >
            📋 Assign Work
          </button>

          <button
            type="button"
            className="nav-module"
            onClick={handleAttendance}
          >
            🕒 Attendance
          </button>

          <button
            type="button"
            className="nav-module active"
            onClick={handleDiary}
          >
            📔 To-Do
          </button>
        </nav>
      </header>

      <main className="view-diary-page">
        {/* PAGE HEADER */}

        <section className="diary-page-header">
          <div>
            <h1>📔 Staff Diary Management</h1>

            <p>
              {isAdmin
                ? "Review staff diary entries and monitor task progress."
                : "Manage your daily tasks and monitor your work progress."}
            </p>
          </div>

          {isStaff && (
            <button
              type="button"
              className="add-diary-btn"
              onClick={handleAddDiary}
            >
              + Add Staff Diary
            </button>
          )}
        </section>

        {/* SUMMARY CARDS */}

        <section className="diary-summary-cards">
          <div className="diary-summary-card">
            <div className="diary-summary-icon">📔</div>
            <div>
              <span>Diary Entries</span>
              <strong>{totalDiaries}</strong>
            </div>
          </div>

          <div className="diary-summary-card">
            <div className="diary-summary-icon">📅</div>
            <div>
              <span>Today's Entries</span>
              <strong>{todayDiaries}</strong>
            </div>
          </div>

          <div className="diary-summary-card">
            <div className="diary-summary-icon">✅</div>
            <div>
              <span>Completed Tasks</span>
              <strong>{completedTasks}</strong>
            </div>
          </div>

          <div className="diary-summary-card">
            <div className="diary-summary-icon">⏳</div>
            <div>
              <span>Pending Tasks</span>
              <strong>{pendingTasks}</strong>
            </div>
          </div>
        </section>

        {/* SEARCH AND FILTERS */}

        <section className="diary-filter-section">
          <div className="diary-search-box">
            <span aria-hidden="true">🔍</span>

            <input
              type="search"
              placeholder="Search staff, department or task..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              aria-label="Search diary entries"
            />
          </div>

          {/* ADMIN STAFF FILTER */}

          {isAdmin && (
            <select
              className="diary-filter-select"
              value={selectedStaffName}
              onChange={(event) =>
                setSelectedStaffName(event.target.value)
              }
              aria-label="Filter by staff member"
            >
              <option value="All">All Staff Members</option>

              {staffOptions.map((staff) => (
                <option key={staff.id || staff.name} value={staff.name}>
                  {staff.name}
                </option>
              ))}
            </select>
          )}

          {/* LOCALITY FILTER */}

          <select
            className="diary-filter-select"
            value={selectedLocality}
            onChange={(event) =>
              setSelectedLocality(event.target.value)
            }
            aria-label="Filter by locality"
          >
            <option value="All">All Localities</option>

            {localityOptions
              .filter((locality) => locality !== "All")
              .map((locality) => (
                <option key={locality} value={locality}>
                  {locality}
                </option>
              ))}
          </select>

          {/* MONTH FILTER */}

          <select
            className="diary-filter-select"
            value={selectedMonth}
            onChange={(event) => setSelectedMonth(event.target.value)}
            aria-label="Filter by month"
          >
            <option value="All">All Months</option>

            {monthOptions.map((month) => (
              <option key={month} value={month}>
                {formatMonth(month)}
              </option>
            ))}
          </select>

          {/* STATUS FILTER */}

          <select
            className="diary-filter-select"
            value={selectedStatus}
            onChange={(event) =>
              setSelectedStatus(event.target.value)
            }
            aria-label="Filter by diary status"
          >
            <option value="All">All Statuses</option>
            <option value="Completed">Completed</option>
            <option value="In Progress">In Progress</option>
            <option value="Pending">Pending</option>
          </select>

          {hasActiveFilters && (
            <button
              type="button"
              className="diary-reset-btn"
              onClick={handleReset}
            >
              ↻ Reset
            </button>
          )}
        </section>

        {/* STAFF INFORMATION
            Staff: always shown.
            Admin: shown only after selecting a staff member.
            Date removed from this card.
        */}

        {selectedStaffDetails && (
          <section className="diary-staff-info">
            <div className="diary-staff-avatar">
              {(selectedStaffDetails.name || "S")
                .charAt(0)
                .toUpperCase()}
            </div>

            <div className="diary-staff-details">
              <span className="diary-info-label">Staff Member</span>

              <strong>
                {selectedStaffDetails.name || "Staff Member"}
              </strong>

              <span>
                {selectedStaffDetails.id
                  ? `Staff ID: ${selectedStaffDetails.id}`
                  : "Staff ID not available"}
              </span>
            </div>

            <div className="diary-staff-details">
              <span className="diary-info-label">Department</span>
              <strong>
                {selectedStaffDetails.department || "Not specified"}
              </strong>
            </div>

            <div className="diary-staff-details">
              <span className="diary-info-label">Locality</span>
              <strong>
                {selectedStaffDetails.locality || "Not specified"}
              </strong>
            </div>
          </section>
        )}

        {/* DIARY TABLE */}

        <section className="diary-table-container">
          <div className="diary-table-heading">
            <div>
              <h2>Staff Diary Records</h2>

              <span>
                Showing {filteredDiaries.length} of{" "}
                {roleFilteredDiaries.length} entries
              </span>
            </div>
          </div>

          <div className="diary-table-responsive">
            <table className="staff-diary-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Date</th>
                  <th>Staff Member</th>
                  <th>Department</th>
                  <th>Locality</th>
                  <th>Total Tasks</th>
                  <th>Completed</th>
                  <th>Pending</th>
                  <th>Diary Status</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {filteredDiaries.length > 0 ? (
                  filteredDiaries.map((diary, index) => {
                    const counts = getTaskCounts(diary);
                    const canEdit = diary.date === today;

                    const staffName =
                      getDiaryStaffName(diary) ||
                      (isStaff ? loggedStaffName : "") ||
                      "—";

                    const diaryStatus = getDiaryStatus(diary);

                    return (
                      <tr key={diary.id ?? `${diary.date}-${index}`}>
                        <td>{index + 1}</td>

                        <td>
                          <span className="diary-date-badge">
                            {formatDate(diary.date)}
                          </span>
                        </td>

                        <td>
                          <div className="diary-staff-name-cell">
                            <div className="diary-table-avatar">
                              {staffName.charAt(0).toUpperCase()}
                            </div>

                            <strong>{staffName}</strong>
                          </div>
                        </td>

                        <td>
                          <span className="diary-department-badge">
                            {getDiaryDepartment(diary)}
                          </span>
                        </td>

                        <td>{getDiaryLocality(diary) || "—"}</td>

                        <td>
                          <strong>{counts.total}</strong>
                        </td>

                        <td>
                          <span className="diary-completed-count">
                            {counts.completed}
                          </span>
                        </td>

                        <td>
                          <span className="diary-pending-count">
                            {counts.pending}
                          </span>
                        </td>

                        <td>
                          <span
                            className={`diary-status-badge ${diaryStatus
                              .toLowerCase()
                              .replace(/\s+/g, "-")}`}
                          >
                            {diaryStatus}
                          </span>
                        </td>

                        <td>
                          <div className="diary-action-buttons">
                            <button
                              type="button"
                              className="diary-view-btn"
                              title="View Diary"
                              aria-label={`View diary for ${staffName}`}
                              onClick={() => handleView(diary)}
                            >
                              👁
                            </button>

                            {isStaff && (
                              <>
                                <button
                                  type="button"
                                  className="diary-edit-btn"
                                  title={
                                    canEdit
                                      ? "Edit Today's Diary"
                                      : "Only today's diary can be edited"
                                  }
                                  aria-label="Edit diary"
                                  disabled={!canEdit}
                                  onClick={() => handleEdit(diary)}
                                >
                                  ✎
                                </button>

                                <button
                                  type="button"
                                  className="diary-delete-btn"
                                  title={
                                    canEdit
                                      ? "Delete Today's Diary"
                                      : "Only today's diary can be deleted"
                                  }
                                  aria-label="Delete diary"
                                  disabled={!canEdit}
                                  onClick={() => handleDelete(diary)}
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
                    <td colSpan="10" className="no-diary-records">
                      <div>
                        <span>📔</span>

                        <h3>
                          {isStaff && !loggedStaffId && !loggedStaffName
                            ? "Staff Identity Not Found"
                            : "No Diary Records Found"}
                        </h3>

                        <p>
                          {isStaff && !loggedStaffId && !loggedStaffName
                            ? "Your logged-in staff details are missing. Please check the login process."
                            : "No diary entries match your search or selected filters."}
                        </p>

                        {isStaff && (
                          <button
                            type="button"
                            className="empty-add-diary-btn"
                            onClick={handleAddDiary}
                          >
                            + Create Staff Diary
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

      {/* VIEW DIARY MODAL */}

      {selectedDiary && (
        <div
          className="diary-modal-overlay"
          onClick={() => setSelectedDiary(null)}
        >
          <div
            className="diary-modal"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="diary-modal-header">
              <div>
                <h2>Staff Diary Details</h2>
                <p>{formatDate(selectedDiary.date)}</p>
              </div>

              <button
                type="button"
                className="diary-modal-close"
                onClick={() => setSelectedDiary(null)}
                aria-label="Close diary details"
              >
                ×
              </button>
            </div>

            <div className="diary-modal-body">
              <div className="diary-detail-grid">
                <div>
                  <span>Staff Name</span>
                  <strong>
                    {getDiaryStaffName(selectedDiary) ||
                      loggedStaffName ||
                      "—"}
                  </strong>
                </div>

                <div>
                  <span>Department</span>
                  <strong>{getDiaryDepartment(selectedDiary)}</strong>
                </div>

                <div>
                  <span>Date</span>
                  <strong>{formatDate(selectedDiary.date)}</strong>
                </div>

                <div>
                  <span>Day</span>
                  <strong>{selectedDiary.day || "—"}</strong>
                </div>

                <div>
                  <span>Locality</span>
                  <strong>
                    {getDiaryLocality(selectedDiary) || "—"}
                  </strong>
                </div>

                <div>
                  <span>Diary Status</span>
                  <strong>{getDiaryStatus(selectedDiary)}</strong>
                </div>
              </div>

              <h3 className="diary-modal-section-title">
                Task Details
              </h3>

              <div className="diary-modal-table-wrapper">
                <table className="diary-modal-table">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Task / Activity</th>
                      <th>Status</th>
                      <th>Remarks</th>
                    </tr>
                  </thead>

                  <tbody>
                    {Array.isArray(selectedDiary.tasks) &&
                    selectedDiary.tasks.length > 0 ? (
                      selectedDiary.tasks.map((task, index) => {
                        const taskStatus = task.status || "Pending";

                        return (
                          <tr key={task.id ?? index}>
                            <td>{index + 1}</td>
                            <td>{task.task || "—"}</td>
                            <td>
                              <span
                                className={`diary-status-badge ${normalizeText(
                                  taskStatus
                                ).replace(/\s+/g, "-")}`}
                              >
                                {taskStatus}
                              </span>
                            </td>
                            <td>{task.remarks || "—"}</td>
                          </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td colSpan="4">No tasks entered.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="diary-modal-footer">
              {isStaff &&
                belongsToLoggedInStaff(selectedDiary) &&
                selectedDiary.date === today && (
                  <button
                    type="button"
                    className="diary-modal-edit-btn"
                    onClick={() => {
                      const diaryToEdit = selectedDiary;
                      setSelectedDiary(null);
                      handleEdit(diaryToEdit);
                    }}
                  >
                    ✎ Edit Diary
                  </button>
                )}

              <button
                type="button"
                className="diary-modal-close-btn"
                onClick={() => setSelectedDiary(null)}
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

export default ViewStaffDiary;