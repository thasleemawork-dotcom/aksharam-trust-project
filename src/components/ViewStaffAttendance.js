import React, {
  useCallback,
  useMemo,
  useState,
} from "react";

import { useNavigate } from "react-router-dom";
import "./ViewStaffAttendance.css";
import logo from "../assets/aksharam-logo.jpeg";

// ========================================
// STORAGE KEYS
// ========================================

const STORAGE_KEY = "aksharam_staff_attendance";
const STAFF_STORAGE_KEY = "aksharam_staff";

// ========================================
// DEFAULT ATTENDANCE DATA
// ========================================

const DEFAULT_ATTENDANCE = [
  {
    id: 1,
    date: "2026-10-11",
    staffName: "Arun Kumar",
    staffId: "STF001",
    locality: "",
    checkIn: "09:05 AM",
    checkOut: "05:10 PM",
    remarks: "Regular working day",
  },
  {
    id: 2,
    date: "2026-10-11",
    staffName: "Rahul Das",
    staffId: "STF002",
    locality: "",
    checkIn: "09:20 AM",
    checkOut: "05:00 PM",
    remarks: "Late by 5 minutes",
  },
  {
    id: 3,
    date: "2026-10-10",
    staffName: "Fathima",
    staffId: "STF003",
    locality: "",
    checkIn: "08:55 AM",
    checkOut: "05:15 PM",
    remarks: "Completed daily tasks",
  },
  {
    id: 4,
    date: "2026-10-10",
    staffName: "Nihal",
    staffId: "STF004",
    locality: "",
    checkIn: "09:00 AM",
    checkOut: "04:45 PM",
    remarks: "",
  },
];

// ========================================
// DATE HELPERS
// ========================================

const getLocalDate = () => {
  const now = new Date();

  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

const getCurrentMonth = () => {
  return getLocalDate().slice(0, 7);
};

const formatDate = (date) => {
  if (!date) {
    return "-";
  }

  const parts = String(date).split("-");

  if (parts.length !== 3) {
    return date;
  }

  return `${parts[2]}/${parts[1]}/${parts[0]}`;
};

// ========================================
// READ LOCAL STORAGE
// ========================================

const readArrayFromStorage = (key, fallback = []) => {
  try {
    const saved = localStorage.getItem(key);

    if (saved === null) {
      return fallback;
    }

    const parsed = JSON.parse(saved);

    return Array.isArray(parsed) ? parsed : fallback;
  } catch (error) {
    console.error(`Unable to read ${key}:`, error);

    return fallback;
  }
};

// ========================================
// FIND LOGGED-IN STAFF
//
// Checks common localStorage keys.
// You can also pass the staff object as a prop.
// ========================================

const getLoggedInStaff = () => {
  const possibleKeys = [
    "loggedInStaff",
    "currentStaff",
    "staffUser",
    "staffData",
    "currentUser",
    "loggedInUser",
    "user",
  ];

  for (const key of possibleKeys) {
    try {
      const saved = localStorage.getItem(key);

      if (!saved) {
        continue;
      }

      const parsed = JSON.parse(saved);

      if (!parsed || typeof parsed !== "object") {
        continue;
      }

      // Support objects such as { user: {...} }
      // or { staff: {...} }.
      const staff =
        parsed.staff ||
        parsed.user ||
        parsed.staffData ||
        parsed;

      const staffName =
        staff.name ||
        staff.fullName ||
        staff.staffName ||
        staff.username ||
        "";

      const staffId =
        staff.employeeId ||
        staff.staffId ||
        staff.employeeID ||
        "";

      const email = staff.email || "";

      if (staffName || staffId || email) {
        return {
          ...staff,
          name: staffName,
          employeeId: staffId,
          email,
        };
      }
    } catch (error) {
      // Ignore unrelated or incorrectly formatted storage values.
    }
  }

  return null;
};

// ========================================
// TIME CONVERSION
// Supports 09:00, 17:30, 09:00 AM and 05:30 PM
// ========================================

const getTimeInMinutes = (time) => {
  if (!time || typeof time !== "string") {
    return null;
  }

  const value = time.trim();

  // HTML time input: 09:00 or 17:30
  const twentyFourHourMatch = value.match(
    /^(\d{1,2}):(\d{2})$/
  );

  if (twentyFourHourMatch) {
    const hours = Number(twentyFourHourMatch[1]);
    const minutes = Number(twentyFourHourMatch[2]);

    if (
      hours < 0 ||
      hours > 23 ||
      minutes < 0 ||
      minutes > 59
    ) {
      return null;
    }

    return hours * 60 + minutes;
  }

  // Existing stored format: 09:00 AM or 05:30 PM
  const twelveHourMatch = value.match(
    /^(\d{1,2}):(\d{2})\s*(AM|PM)$/i
  );

  if (!twelveHourMatch) {
    return null;
  }

  let hours = Number(twelveHourMatch[1]);

  const minutes = Number(twelveHourMatch[2]);

  const period = twelveHourMatch[3].toUpperCase();

  if (
    hours < 1 ||
    hours > 12 ||
    minutes < 0 ||
    minutes > 59
  ) {
    return null;
  }

  if (period === "PM" && hours !== 12) {
    hours += 12;
  }

  if (period === "AM" && hours === 12) {
    hours = 0;
  }

  return hours * 60 + minutes;
};

// ========================================
// CONVERT TIME FOR HTML INPUT
// ========================================

const toInputTime = (time) => {
  if (!time) {
    return "";
  }

  const value = String(time).trim();

  if (/^\d{2}:\d{2}$/.test(value)) {
    return value;
  }

  const minutes = getTimeInMinutes(value);

  if (minutes === null) {
    return "";
  }

  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;

  return (
    `${String(hours).padStart(2, "0")}:` +
    `${String(remainingMinutes).padStart(2, "0")}`
  );
};

// ========================================
// DISPLAY TIME
// ========================================

const formatTime = (time) => {
  if (!time) {
    return "-";
  }

  const minutes = getTimeInMinutes(time);

  if (minutes === null) {
    return time;
  }

  const hours24 = Math.floor(minutes / 60);
  const mins = minutes % 60;

  const period = hours24 >= 12 ? "PM" : "AM";

  const hours12 =
    hours24 % 12 === 0 ? 12 : hours24 % 12;

  return (
    `${String(hours12).padStart(2, "0")}:` +
    `${String(mins).padStart(2, "0")} ${period}`
  );
};

// ========================================
// ATTENDANCE STATUS
// ========================================

const getStatus = (item) => {
  if (!item.checkIn) {
    return "Absent";
  }

  const checkInMinutes = getTimeInMinutes(item.checkIn);

  if (checkInMinutes === null) {
    return "Unknown";
  }

  // Check-in after 9:15 AM is considered late.
  return checkInMinutes > 9 * 60 + 15
    ? "Late"
    : "Present";
};

// ========================================
// STAFF INFORMATION HELPERS
// ========================================

const getStaffName = (staff) => {
  if (!staff) {
    return "";
  }

  return (
    staff.name ||
    staff.fullName ||
    staff.staffName ||
    staff.username ||
    ""
  );
};

const getStaffId = (staff) => {
  if (!staff) {
    return "";
  }

  return (
    staff.employeeId ||
    staff.staffId ||
    staff.employeeID ||
    ""
  );
};

const getStaffEmail = (staff) => {
  return staff?.email || "";
};

const getStaffLocation = (staff) => {
  if (!staff) {
    return "";
  }

  return (
    staff.city ||
    staff.locality ||
    staff.location ||
    ""
  );
};

// ========================================
// MAIN COMPONENT
// ========================================

const ViewStaffAttendance = ({
  role = "staff",
  staff: staffProp,
  staffId: staffIdProp,
  staffName: staffNameProp,
}) => {
  const navigate = useNavigate();

  // ========================================
  // ROLE
  // ========================================

  const normalizedRole = String(role || "staff")
    .trim()
    .toLowerCase();

  const isAdmin = normalizedRole === "admin";
  const isStaff = normalizedRole === "staff";

  // ========================================
  // LOGGED-IN STAFF
  // ========================================

  const [loggedInStaff] = useState(() => {
    const detectedStaff = staffProp || getLoggedInStaff();

    if (!detectedStaff) {
      return {
        name: staffNameProp || "",
        employeeId: staffIdProp || "",
      };
    }

    return {
      ...detectedStaff,
      name:
        staffNameProp ||
        getStaffName(detectedStaff),
      employeeId:
        staffIdProp ||
        getStaffId(detectedStaff),
    };
  });

  const currentStaffName = getStaffName(loggedInStaff);

  const currentStaffId = getStaffId(loggedInStaff);

  const currentStaffEmail = getStaffEmail(loggedInStaff);

  const currentStaffLocality = getStaffLocation(loggedInStaff);

  const hasStaffIdentity = Boolean(
    currentStaffId ||
    currentStaffName ||
    currentStaffEmail
  );

  // ========================================
  // ATTENDANCE DATA
  // ========================================

  const [attendanceData, setAttendanceData] = useState(
    () =>
      readArrayFromStorage(
        STORAGE_KEY,
        DEFAULT_ATTENDANCE
      ).map((item) => ({
        ...item,
        id: item.id ?? `${item.staffId}-${item.date}-${Math.random()}`,
      }))
  );

  // ========================================
  // STAFF DIRECTORY
  // ========================================

  const [staffDirectory] = useState(() =>
    readArrayFromStorage(STAFF_STORAGE_KEY, [])
  );

  // ========================================
  // FILTERS
  // ========================================

  const [search, setSearch] = useState("");

  const [selectedLocality, setSelectedLocality] =
    useState("All");

  // Current month is selected by default.
  const [selectedMonth, setSelectedMonth] =
    useState(getCurrentMonth);

  // Staff initially see their own attendance.
  // Admins see all staff attendance.
  const [attendanceView, setAttendanceView] =
    useState("mine");

  // ========================================
  // SAVE MESSAGE
  // ========================================

  const [saveMessage, setSaveMessage] = useState("");

  // ========================================
  // CURRENT DATE
  // ========================================

  const today = getLocalDate();

  const currentMonth = getCurrentMonth();

  // ========================================
  // MATCH ATTENDANCE TO LOGGED-IN STAFF
  // ========================================

  const isMyAttendance = useCallback(
    (item) => {
      // If login information was not found,
      // fall back to displaying records rather than
      // incorrectly hiding all attendance records.
      if (!hasStaffIdentity) {
        return true;
      }

      const attendanceId = String(
        item.staffId || ""
      ).trim().toLowerCase();

      const attendanceName = String(
        item.staffName || ""
      ).trim().toLowerCase();

      const attendanceEmail = String(
        item.email || ""
      ).trim().toLowerCase();

      if (currentStaffId) {
        return (
          attendanceId ===
          String(currentStaffId).trim().toLowerCase()
        );
      }

      if (currentStaffEmail) {
        if (attendanceEmail) {
          return (
            attendanceEmail ===
            currentStaffEmail.trim().toLowerCase()
          );
        }

        const matchedStaff = staffDirectory.find(
          (member) =>
            String(member.email || "")
              .trim()
              .toLowerCase() ===
            currentStaffEmail.trim().toLowerCase()
        );

        if (matchedStaff) {
          const matchedId = getStaffId(matchedStaff);

          if (matchedId) {
            return (
              attendanceId ===
              String(matchedId).trim().toLowerCase()
            );
          }
        }
      }

      if (currentStaffName) {
        return (
          attendanceName ===
          currentStaffName.trim().toLowerCase()
        );
      }

      return false;
    },
    [
      hasStaffIdentity,
      currentStaffId,
      currentStaffEmail,
      currentStaffName,
      staffDirectory,
    ]
  );

  // ========================================
  // STAFF LOCALITY
  // ========================================

  const getAttendanceLocality = useCallback(
    (attendance) => {
      if (attendance.locality) {
        return String(attendance.locality);
      }

      const matchedStaff = staffDirectory.find(
        (member) =>
          String(getStaffId(member)).toLowerCase() ===
          String(attendance.staffId || "").toLowerCase()
      );

      return (
        getStaffLocation(matchedStaff) ||
        "Not specified"
      );
    },
    [staffDirectory]
  );

  // ========================================
  // LOCALITY OPTIONS
  // ========================================

  const localities = useMemo(() => {
    const values = [
      ...attendanceData.map(getAttendanceLocality),

      ...staffDirectory.map(getStaffLocation),
    ];

    const uniqueValues = Array.from(
      new Set(
        values
          .map((value) => String(value || "").trim())
          .filter(
            (value) =>
              value && value !== "Not specified"
          )
      )
    ).sort((a, b) => a.localeCompare(b));

    return ["All", ...uniqueValues];
  }, [
    attendanceData,
    staffDirectory,
    getAttendanceLocality,
  ]);

  // ========================================
  // MONTH OPTIONS
  // Includes the current year and years
  // already present in the attendance records.
  // ========================================

  const monthOptions = useMemo(() => {
    const years = new Set([
      String(new Date().getFullYear()),
    ]);

    attendanceData.forEach((item) => {
      if (item.date && item.date.length >= 4) {
        years.add(String(item.date).slice(0, 4));
      }
    });

    const sortedYears = Array.from(years).sort(
      (a, b) => Number(b) - Number(a)
    );

    const options = [];

    sortedYears.forEach((year) => {
      for (let month = 1; month <= 12; month += 1) {
        const monthNumber = String(month).padStart(2, "0");

        const value = `${year}-${monthNumber}`;

        const label = new Date(
          Number(year),
          month - 1,
          1
        ).toLocaleString("en-IN", {
          month: "long",
        });

        options.push({
          value,
          label: `${label} ${year}`,
        });
      }
    });

    return options;
  }, [attendanceData]);

  // ========================================
  // FILTER ATTENDANCE
  // ========================================

  const filteredData = useMemo(() => {
    const searchValue = search.trim().toLowerCase();

    return attendanceData.filter((item) => {
      // Staff can switch between their own attendance
      // and all staff attendance.
      const matchesStaff =
        isAdmin ||
        attendanceView === "all" ||
        isMyAttendance(item);

      const matchesSearch =
        String(item.staffName || "")
          .toLowerCase()
          .includes(searchValue) ||
        String(item.staffId || "")
          .toLowerCase()
          .includes(searchValue);

      const matchesLocality =
        selectedLocality === "All" ||
        getAttendanceLocality(item) === selectedLocality;

      const matchesMonth =
        !selectedMonth ||
        String(item.date || "").startsWith(selectedMonth);

      return (
        matchesStaff &&
        matchesSearch &&
        matchesLocality &&
        matchesMonth
      );
    });
  }, [
    attendanceData,
    isAdmin,
    attendanceView,
    isMyAttendance,
    search,
    selectedLocality,
    selectedMonth,
    getAttendanceLocality,
  ]);

  // ========================================
  // SUMMARY CARDS
  // ========================================

  const summaryData = useMemo(() => {
    if (selectedMonth) {
      return filteredData;
    }

    return filteredData.filter(
      (item) => item.date === today
    );
  }, [filteredData, selectedMonth, today]);

  const totalRecords = filteredData.length;

  const presentCount = summaryData.filter((item) => {
    const status = getStatus(item);

    return status === "Present" || status === "Late";
  }).length;

  const absentCount = summaryData.filter(
    (item) => getStatus(item) === "Absent"
  ).length;

  const presentLabel = selectedMonth
    ? "Present This Month"
    : "Present Today";

  const absentLabel = selectedMonth
    ? "Absent This Month"
    : "Absent Today";

  // ========================================
  // NAVIGATION
  // ========================================

  const handleHome = () => {
    navigate(
      isAdmin
        ? "/admin/dashboard"
        : "/staff/dashboard"
    );
  };

  const handleStaff = () => {
    navigate(
      isAdmin
        ? "/admin/staff/manage"
        : "/staff/staff/manage"
    );
  };

  const handleAssignWork = () => {
    navigate("/staff-assignwork/manage");
  };

  const handleDiary = () => {
    navigate("/staff-diary/manage");
  };

  // ========================================
  // SWITCH ATTENDANCE VIEW
  // ========================================

  const showMyAttendance = () => {
    setAttendanceView("mine");
    setSaveMessage("");
  };

  const showAllAttendance = () => {
    setAttendanceView("all");
    setSaveMessage("");
  };

  // ========================================
  // ADD ATTENDANCE ROW
  // ========================================

  const addAttendance = () => {
    if (!isStaff) {
      return;
    }

    const newRow = {
      id: `new-${Date.now()}-${Math.random()}`,
      date: today,

      // Automatically fill the logged-in staff details.
      staffName: currentStaffName,
      staffId: currentStaffId,
      locality: currentStaffLocality,

      checkIn: "",
      checkOut: "",
      remarks: "",

      // Internal flag used to identify a new row.
      isNew: true,
    };

    setAttendanceData((previous) => [
      newRow,
      ...previous,
    ]);

    // Show the newly added row.
    setAttendanceView("mine");
    setSelectedMonth(currentMonth);

    setSaveMessage("");
  };

  // ========================================
  // CHECK IF ROW CAN BE EDITED
  // ========================================

  const canEditAttendance = (item) => {
    if (!isStaff) {
      return false;
    }

    // A new row can always be edited.
    if (item.isNew) {
      return true;
    }

    // If login information is unavailable,
    // allow editing as a development fallback.
    if (!hasStaffIdentity) {
      return true;
    }

    // Staff cannot edit another staff member's record.
    return isMyAttendance(item);
  };

  // ========================================
  // UPDATE ATTENDANCE FIELD
  // ========================================

  const handleChange = (id, field, value) => {
    if (!isStaff) {
      return;
    }

    setAttendanceData((previous) =>
      previous.map((item) => {
        if (item.id !== id) {
          return item;
        }

        if (!canEditAttendance(item)) {
          return item;
        }

        // Keep the logged-in staff identity fixed.
        if (
          hasStaffIdentity &&
          ["staffName", "staffId"].includes(field)
        ) {
          return item;
        }

        return {
          ...item,
          [field]: value,
        };
      })
    );

    setSaveMessage("");
  };

  // ========================================
  // SELECT STAFF FROM DIRECTORY
  // Used only if login identity was not detected.
  // ========================================

  const handleStaffSelect = (id, selectedId) => {
    if (!isStaff || hasStaffIdentity) {
      return;
    }

    const selectedStaff = staffDirectory.find(
      (member) =>
        String(getStaffId(member)) === String(selectedId)
    );

    setAttendanceData((previous) =>
      previous.map((item) =>
        item.id === id
          ? {
              ...item,
              staffId: selectedId,
              staffName: getStaffName(selectedStaff),
              locality:
                getStaffLocation(selectedStaff) ||
                item.locality ||
                "",
            }
          : item
      )
    );

    setSaveMessage("");
  };

  // ========================================
  // DELETE ATTENDANCE ROW
  // ========================================

  const deleteAttendance = (id) => {
    if (!isStaff) {
      return;
    }

    const itemToDelete = attendanceData.find(
      (item) => item.id === id
    );

    if (!itemToDelete || !canEditAttendance(itemToDelete)) {
      window.alert(
        "You can delete only your own attendance record."
      );

      return;
    }

    const confirmed = window.confirm(
      "Are you sure you want to delete this attendance record?"
    );

    if (!confirmed) {
      return;
    }

    setAttendanceData((previous) =>
      previous.filter((item) => item.id !== id)
    );

    setSaveMessage("");
  };

  // ========================================
  // SAVE ATTENDANCE
  // ========================================

  const saveAttendance = () => {
    if (!isStaff) {
      return;
    }

    const incompleteRow = attendanceData.find(
      (item) =>
        !item.date ||
        !String(item.staffName || "").trim() ||
        !String(item.staffId || "").trim()
    );

    if (incompleteRow) {
      window.alert(
        "Please enter the date, staff name and staff ID for every attendance record before saving."
      );

      return;
    }

    // Check that check-in/check-out values are valid.
    const invalidTimeRow = attendanceData.find(
      (item) =>
        (item.checkIn &&
          getTimeInMinutes(item.checkIn) === null) ||
        (item.checkOut &&
          getTimeInMinutes(item.checkOut) === null)
    );

    if (invalidTimeRow) {
      window.alert(
        "Please enter valid check-in and check-out times."
      );

      return;
    }

    try {
      // Remove temporary properties before saving.
      const dataToSave = attendanceData.map(
        ({ isNew, ...item }) => item
      );

      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(dataToSave)
      );

      // Keep the UI consistent with the saved data.
      setAttendanceData(dataToSave);

      setSaveMessage(
        "Attendance saved successfully."
      );
    } catch (error) {
      console.error(
        "Unable to save attendance:",
        error
      );

      window.alert(
        "Unable to save attendance. Please check your browser storage."
      );
    }
  };

  // ========================================
  // VIEW DETAILS
  // ========================================

  const handleView = (item) => {
    const details = [
      `Staff Name: ${item.staffName || "-"}`,
      `Staff ID: ${item.staffId || "-"}`,
      `Date: ${formatDate(item.date)}`,
      `Check In: ${formatTime(item.checkIn)}`,
      `Check Out: ${formatTime(item.checkOut)}`,
      `Status: ${getStatus(item)}`,
      `Locality: ${getAttendanceLocality(item)}`,
      `Remarks: ${item.remarks || "-"}`,
    ].join("\n");

    window.alert(details);
  };

  // ========================================
  // RESET FILTERS
  // ========================================

  const handleReset = () => {
    setSearch("");
    setSelectedLocality("All");
    setSelectedMonth(currentMonth);
  };

  // ========================================
  // ACTIVE FILTERS
  // ========================================

  const hasActiveFilters =
    search.trim() !== "" ||
    selectedLocality !== "All" ||
    selectedMonth !== currentMonth;

  // ========================================
  // RENDER
  // ========================================

  return (
    <div className="attendance-dashboard">

      {/* ======================================
          NAVBAR
      ====================================== */}

      <header className="attendance-navbar">

        <div className="attendance-navbar-brand">
          <img
            src={logo}
            alt="Aksharam Trust"
          />
        </div>

        <nav
          className="attendance-navbar-menu"
          aria-label="Main navigation"
        >
          <button
            type="button"
            className="attendance-nav-btn"
            onClick={handleHome}
          >
            <span>🏠</span>
            <span>Home</span>
          </button>

          <button
            type="button"
            className="attendance-nav-btn"
            onClick={handleStaff}
          >
            <span>👥</span>
            <span>Staff</span>
          </button>

          <button
            type="button"
            className="attendance-nav-btn"
            onClick={handleAssignWork}
          >
            <span>📋</span>
            <span>Assign Work</span>
          </button>

          <button
            type="button"
            className="attendance-nav-btn active"
            aria-current="page"
          >
            <span>🕒</span>
            <span>Attendance</span>
          </button>

          <button
            type="button"
            className="attendance-nav-btn"
            onClick={handleDiary}
          >
            <span>📔</span>
            <span>To-Do</span>
          </button>
        </nav>

      </header>

      {/* ======================================
          MAIN CONTENT
      ====================================== */}

      <main className="view-attendance-page">

        {/* PAGE HEADER */}

        <section className="attendance-page-header">

          <div>
            <h1>🕒 Staff Attendance</h1>

            <p>
              {isAdmin
                ? "View staff attendance records and monitor daily attendance."
                : "Manage your monthly attendance and view other staff records when needed."}
            </p>
          </div>

        </section>

        {/* ======================================
            SUMMARY CARDS
        ====================================== */}

        <section
          className="attendance-summary"
          aria-label="Attendance summary"
        >

          <article className="attendance-summary-card">
            <div
              className="attendance-summary-icon"
              aria-hidden="true"
            >
              📋
            </div>

            <div>
              <span>Total Records</span>
              <strong>{totalRecords}</strong>
            </div>
          </article>

          <article className="attendance-summary-card">
            <div
              className="attendance-summary-icon"
              aria-hidden="true"
            >
              ✅
            </div>

            <div>
              <span>{presentLabel}</span>
              <strong>{presentCount}</strong>
            </div>
          </article>

          <article className="attendance-summary-card">
            <div
              className="attendance-summary-icon"
              aria-hidden="true"
            >
              ❌
            </div>

            <div>
              <span>{absentLabel}</span>
              <strong>{absentCount}</strong>
            </div>
          </article>

        </section>

        {/* ======================================
            ATTENDANCE VIEW TOGGLE
        ====================================== */}

          {isStaff && (
            <section
              className="attendance-view-switch"
              aria-label="Choose attendance view"
            >
              <button
                type="button"
                className={
                  attendanceView === "mine"
                    ? "attendance-view-toggle active"
                    : "attendance-view-toggle"
                }
                onClick={showMyAttendance}
              >
                👤 My Attendance
              </button>

              <button
                type="button"
                className={
                  attendanceView === "all"
                    ? "attendance-view-toggle active"
                    : "attendance-view-toggle"
                }
                onClick={showAllAttendance}
              >
                👥 All Attendance
              </button>
            </section>
          )}

          
        {/* ======================================
            FILTERS
        ====================================== */}

        <section
          className="attendance-filter-section"
          aria-label="Search and filter attendance"
        >

          {/* SEARCH */}

          <div className="attendance-search-box">
            <span aria-hidden="true">🔍</span>

            <input
              type="search"
              placeholder="Search by staff name or ID..."
              aria-label="Search by staff name or ID"
              value={search}
              onChange={(event) =>
                setSearch(event.target.value)
              }
            />
          </div>

          {/* LOCALITY */}

          <select
            className="attendance-locality-filter"
            value={selectedLocality}
            onChange={(event) =>
              setSelectedLocality(event.target.value)
            }
            aria-label="Filter by locality"
          >
            {localities.map((locality) => (
              <option
                key={locality}
                value={locality}
              >
                {locality === "All"
                  ? "All Localities"
                  : locality}
              </option>
            ))}
          </select>

          {/* MONTH */}

          <select
            className="attendance-month-filter"
            value={selectedMonth}
            onChange={(event) =>
              setSelectedMonth(event.target.value)
            }
            aria-label="Filter by month"
          >
            <option value="">All Months</option>

            {monthOptions.map((month) => (
              <option
                key={month.value}
                value={month.value}
              >
                {month.label}
              </option>
            ))}
          </select>

          {/* RESET */}

          {hasActiveFilters && (
            <button
              type="button"
              className="attendance-reset-btn"
              onClick={handleReset}
            >
              ↻ Reset
            </button>
          )}

        </section>

        {/* ======================================
            ATTENDANCE DIRECTORY
        ====================================== */}

        <section className="attendance-table-card">

          {/* TABLE HEADER */}

          <div className="attendance-table-heading">

            <div>
              <h2>Attendance Directory</h2>

              <p>
                {isAdmin
                  ? "View attendance records for all staff members."
                  : attendanceView === "mine"
                    ? "Showing your attendance records."
                    : "Showing attendance records for all staff members."}
              </p>
            </div>

            {isStaff && (
              <button
                type="button"
                className="add-button"
                onClick={addAttendance}
              >
                + Add Attendance
              </button>
            )}

          </div>

          {/* LOGIN IDENTITY NOTICE */}

          {isStaff && !hasStaffIdentity && (
            <div className="attendance-identity-notice">
              Your logged-in staff details could not be detected.
              Please check that your login component saves the staff
              details in localStorage or passes them to this page.
            </div>
          )}

          {/* TABLE */}

          <div className="attendance-table-container">

            <table className="attendance-table">

              <thead>
                <tr>
                  <th scope="col">#</th>
                  <th scope="col">Date</th>
                  <th scope="col">Staff Member</th>
                  <th scope="col">Staff ID</th>
                  <th scope="col">Locality</th>
                  <th scope="col">Check In</th>
                  <th scope="col">Check Out</th>
                  <th scope="col">Remarks</th>
                  <th scope="col">Status</th>
                  <th scope="col">Action</th>
                </tr>
              </thead>

              <tbody>

                {filteredData.length > 0 ? (
                  filteredData.map((item, index) => {
                    const status = getStatus(item);

                    const canEdit = canEditAttendance(item);

                    return (
                      <tr key={item.id}>

                        {/* NUMBER */}

                        <td className="row-number">
                          {index + 1}
                        </td>

                        {/* DATE */}

                        <td>
                          {canEdit ? (
                            <input
                              type="date"
                              value={item.date || ""}
                              onChange={(event) =>
                                handleChange(
                                  item.id,
                                  "date",
                                  event.target.value
                                )
                              }
                              aria-label="Attendance date"
                            />
                          ) : (
                            formatDate(item.date)
                          )}
                        </td>

                        {/* STAFF NAME */}

                        <td>
                          {canEdit &&
                          (!hasStaffIdentity || item.isNew) ? (
                            <input
                              type="text"
                              placeholder="Staff name"
                              value={item.staffName || ""}
                              onChange={(event) =>
                                handleChange(
                                  item.id,
                                  "staffName",
                                  event.target.value
                                )
                              }
                              aria-label="Staff name"
                            />
                          ) : (
                            <div className="attendance-staff-cell">
                              <div
                                className="attendance-staff-avatar"
                                aria-hidden="true"
                              >
                                {(item.staffName || "S")
                                  .charAt(0)
                                  .toUpperCase()}
                              </div>

                              <strong>
                                {item.staffName || "Unknown"}
                              </strong>
                            </div>
                          )}
                        </td>

                        {/* STAFF ID */}

                        <td>
                          {canEdit &&
                          (!hasStaffIdentity || item.isNew) ? (
                            staffDirectory.length > 0 &&
                            !hasStaffIdentity ? (
                              <select
                                value={item.staffId || ""}
                                onChange={(event) =>
                                  handleStaffSelect(
                                    item.id,
                                    event.target.value
                                  )
                                }
                                aria-label="Select staff ID"
                              >
                                <option value="">
                                  Select staff
                                </option>

                                {staffDirectory.map((staff) => {
                                  const employeeId =
                                    getStaffId(staff);

                                  return (
                                    <option
                                      key={employeeId}
                                      value={employeeId}
                                    >
                                      {employeeId} - {getStaffName(staff)}
                                    </option>
                                  );
                                })}
                              </select>
                            ) : (
                              <input
                                type="text"
                                placeholder="Staff ID"
                                value={item.staffId || ""}
                                onChange={(event) =>
                                  handleChange(
                                    item.id,
                                    "staffId",
                                    event.target.value
                                  )
                                }
                                aria-label="Staff ID"
                              />
                            )
                          ) : (
                            <span className="attendance-staff-id">
                              {item.staffId || "-"}
                            </span>
                          )}
                        </td>

                        {/* LOCALITY */}

                        <td>
                          {canEdit ? (
                            <input
                              type="text"
                              placeholder="Locality"
                              value={
                                item.locality ||
                                (
                                  getAttendanceLocality(item) ===
                                  "Not specified"
                                    ? ""
                                    : getAttendanceLocality(item)
                                )
                              }
                              onChange={(event) =>
                                handleChange(
                                  item.id,
                                  "locality",
                                  event.target.value
                                )
                              }
                              aria-label="Locality"
                            />
                          ) : (
                            getAttendanceLocality(item)
                          )}
                        </td>

                        {/* CHECK IN */}

                        <td>
                          {canEdit ? (
                            <input
                              type="time"
                              value={toInputTime(item.checkIn)}
                              onChange={(event) =>
                                handleChange(
                                  item.id,
                                  "checkIn",
                                  event.target.value
                                )
                              }
                              aria-label="Check-in time"
                            />
                          ) : (
                            <span className="attendance-time">
                              {formatTime(item.checkIn)}
                            </span>
                          )}
                        </td>

                        {/* CHECK OUT */}

                        <td>
                          {canEdit ? (
                            <input
                              type="time"
                              value={toInputTime(item.checkOut)}
                              onChange={(event) =>
                                handleChange(
                                  item.id,
                                  "checkOut",
                                  event.target.value
                                )
                              }
                              aria-label="Check-out time"
                            />
                          ) : (
                            <span className="attendance-time">
                              {formatTime(item.checkOut)}
                            </span>
                          )}
                        </td>

                        {/* REMARKS */}

                        <td>
                          {canEdit ? (
                            <input
                              type="text"
                              placeholder="Remarks"
                              value={item.remarks || ""}
                              onChange={(event) =>
                                handleChange(
                                  item.id,
                                  "remarks",
                                  event.target.value
                                )
                              }
                              aria-label="Attendance remarks"
                            />
                          ) : (
                            item.remarks || "-"
                          )}
                        </td>

                        {/* AUTOMATIC STATUS */}

                        <td>
                          <span
                            className={
                              `attendance-status-badge ${status.toLowerCase()}`
                            }
                          >
                            {status}
                          </span>
                        </td>

                        {/* ACTIONS */}

                        <td>
                          <div className="attendance-action-buttons">

                            {!canEdit && (
                              <button
                                type="button"
                                className="attendance-view-btn"
                                title="View attendance details"
                                onClick={() => handleView(item)}
                              >
                                👁 View
                              </button>
                            )}

                            {canEdit && isStaff && (
                              <button
                                type="button"
                                className="attendance-delete-btn"
                                title="Delete"
                                onClick={() =>
                                  deleteAttendance(item.id)
                                }
                              >
                                🗑 
                              </button>
                            )}

                          </div>
                        </td>

                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td
                      colSpan="10"
                      className="attendance-no-records"
                    >
                      <div>
                        <span aria-hidden="true">📋</span>

                        <h3>
                          {attendanceView === "mine" && isStaff
                            ? "No Attendance Records for This Month"
                            : "No Attendance Records Found"}
                        </h3>

                        <p>
                          {attendanceView === "mine" && isStaff
                            ? "You have no attendance records matching the selected month and filters. Click Add Attendance to create a record."
                            : "No records match your search or filters. Try changing your filters."}
                        </p>
                      </div>
                    </td>
                  </tr>
                )}

              </tbody>

            </table>

          </div>

          {/* TABLE FOOTER */}

          <div className="attendance-table-footer">
            Showing <strong>{filteredData.length}</strong> of{" "}
            <strong>{attendanceData.length}</strong> records
          </div>

          {/* SAVE SECTION */}

          {isStaff && (
            <div className="attendance-save-section">

              {saveMessage && (
                <p
                  className="attendance-save-message"
                  role="status"
                >
                  {saveMessage}
                </p>
              )}

              <button
                type="button"
                className="save-button"
                onClick={saveAttendance}
              >
                💾 Save Attendance
              </button>

            </div>
          )}

        </section>

      </main>
    </div>
  );
};

export default ViewStaffAttendance;