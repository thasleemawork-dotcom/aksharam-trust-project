import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./ViewStaff.css";
import logo from "../assets/aksharam-logo.jpeg";

const ViewStaff = ({role="staff"}) => {
  const navigate = useNavigate();

  // ========================================
  // ROLE
  // ========================================

  const isAdmin = role === "admin";
  const isStaff = role === "staff";

  // ========================================
  // DEFAULT STAFF DATA
  // ========================================

  const defaultStaff = [
    {
      id: 1,
      employeeId: "STF001",
      name: "Amina Rahman",
      email: "amina@gmail.com",
      phone: "9876543210",
      designation: "Teacher",
      department: "Education",
      joiningDate: "2025-06-10",
      status: "Active",
      dob: "1995-04-12",
      gender: "Female",
      qualification: "B.Ed",
      specialization: "English",
      experience: "5 Years",
      institution: "University of Calicut",
      address: "Kozhikode, Kerala",
      city: "Kozhikode",
      pincode: "673001",
      emergencyName: "Rahman Ali",
      emergencyPhone: "9876501234",
      emergencyRelation: "Father",
      skills: "Teaching, Communication, Student Management",
      remarks: "Dedicated and experienced teacher.",
      photo: "",
    },
    {
      id: 2,
      employeeId: "STF002",
      name: "Rahul Kumar",
      email: "rahul@gmail.com",
      phone: "9876543211",
      designation: "Accountant",
      department: "Accounts",
      joiningDate: "2025-07-15",
      status: "Active",
      dob: "1992-08-20",
      gender: "Male",
      qualification: "B.Com",
      specialization: "Finance",
      experience: "6 Years",
      institution: "University of Kerala",
      address: "Kochi, Kerala",
      city: "Kochi",
      pincode: "682001",
      emergencyName: "Suresh Kumar",
      emergencyPhone: "9876501235",
      emergencyRelation: "Father",
      skills: "Accounting, Excel, Tally",
      remarks: "Responsible for trust accounts.",
      photo: "",
    },
    {
      id: 3,
      employeeId: "STF003",
      name: "Fathima Nisha",
      email: "fathima@gmail.com",
      phone: "9876543212",
      designation: "Coordinator",
      department: "Administration",
      joiningDate: "2024-11-20",
      status: "Inactive",
      dob: "1994-02-15",
      gender: "Female",
      qualification: "MBA",
      specialization: "Human Resources",
      experience: "4 Years",
      institution: "University of Calicut",
      address: "Malappuram, Kerala",
      city: "Malappuram",
      pincode: "676505",
      emergencyName: "Nisha Begum",
      emergencyPhone: "9876501236",
      emergencyRelation: "Mother",
      skills: "Management, Communication, Coordination",
      remarks: "Administrative coordinator.",
      photo: "",
    },
    {
      id: 4,
      employeeId: "STF004",
      name: "Arun Das",
      email: "arun@gmail.com",
      phone: "9876543213",
      designation: "Teacher",
      department: "Education",
      joiningDate: "2026-01-05",
      status: "Active",
      dob: "1990-11-10",
      gender: "Male",
      qualification: "M.A",
      specialization: "Social Science",
      experience: "8 Years",
      institution: "University of Calicut",
      address: "Kannur, Kerala",
      city: "Kannur",
      pincode: "670001",
      emergencyName: "Dasan",
      emergencyPhone: "9876501237",
      emergencyRelation: "Father",
      skills: "Teaching, Leadership, Communication",
      remarks: "Senior teaching staff.",
      photo: "",
    },
  ];

  // ========================================
  // LOAD STAFF FROM LOCAL STORAGE
  // ========================================

  const [staffList, setStaffList] = useState(() => {
    try {
      const savedStaff = localStorage.getItem("aksharam_staff");

      return savedStaff ? JSON.parse(savedStaff) : defaultStaff;
    } catch (error) {
      console.error("Error loading staff:", error);
      return defaultStaff;
    }
  });

  // ========================================
  // SEARCH AND FILTER STATES
  // ========================================

  const [search, setSearch] = useState("");
  const [department, setDepartment] = useState("All");
  const [selectedLocation, setSelectedLocation] = useState("All");

  // ========================================
  // SAVE STAFF TO LOCAL STORAGE
  // ========================================

 useEffect(() => {
  try {
    localStorage.setItem(
      "aksharam_staff",
      JSON.stringify(staffList)
    );
  } catch (error) {
    console.error("Unable to save staff data:", error);
  }
}, [staffList]);

  // ========================================
  // LOCATION OPTIONS
  // Must be declared after staffList
  // ========================================

  const locations = [
    "All",
    ...new Set(
      staffList
        .map((staff) => staff.city)
        .filter(Boolean)
    ),
  ];

  // ========================================
  // DEPARTMENT OPTIONS
  // ========================================

  const departments = [
    "All",
    ...new Set(
      staffList
        .map((staff) => staff.department)
        .filter(Boolean)
    ),
  ];

  // ========================================
  // SEARCH AND FILTER STAFF
  // ========================================

  const filteredStaff = staffList.filter((staff) => {
    const searchValue = search.toLowerCase().trim();

    const matchesSearch =
      (staff.name || "").toLowerCase().includes(searchValue) ||
      (staff.employeeId || "").toLowerCase().includes(searchValue) ||
      (staff.email || "").toLowerCase().includes(searchValue) ||
      (staff.phone || "").toLowerCase().includes(searchValue);

    const matchesDepartment =
      department === "All" || staff.department === department;

    const matchesLocation =
      selectedLocation === "All" || staff.city === selectedLocation;

    return matchesSearch && matchesDepartment && matchesLocation;
  });

  // ========================================
  // SUMMARY COUNTS
  // ========================================

  const totalStaff = staffList.length;

  const activeStaff = staffList.filter(
    (staff) => staff.status === "Active"
  ).length;

  const inactiveStaff = staffList.filter(
    (staff) => staff.status === "Inactive"
  ).length;

  const totalDepartments = new Set(
    staffList.map((staff) => staff.department).filter(Boolean)
  ).size;

  // ========================================
  // ADD STAFF - ADMIN ONLY
  // ========================================

  const handleAddStaff = () => {
    if (!isAdmin) return;

    navigate("/admin/add-staff");
  };

  // ========================================
  // VIEW STAFF PROFILE
  // ========================================

  const handleView = (staff) => {
    navigate(`/staff/profile/${staff.id}`, {
      state: { staff },
    });
  };

  // ========================================
  // EDIT STAFF - ADMIN ONLY
  // ========================================

  const handleEdit = (staff) => {
    if (!isAdmin) return;

    navigate(`/admin/edit-staff/${staff.id}`, {
      state: { staff },
    });
  };

  // ========================================
  // DELETE STAFF - ADMIN ONLY
  // ========================================

  const handleDelete = (id) => {
    if (!isAdmin) return;

    const confirmDelete = window.confirm(
      "Are you sure you want to delete this staff member?"
    );

    if (!confirmDelete) return;

    setStaffList((previousStaff) =>
      previousStaff.filter((staff) => staff.id !== id)
    );
  };


  // ========================================
// CHANGE STAFF STATUS - ADMIN ONLY
// ========================================

// ========================================
// CHANGE STAFF STATUS - ADMIN ONLY
// ========================================

const handleStatusChange = (staffId, newStatus) => {
  if (!isAdmin) return;

  if (!["Active", "Inactive"].includes(newStatus)) return;

  setStaffList((previousStaff) =>
    previousStaff.map((staff) =>
      staff.id === staffId
        ? { ...staff, status: newStatus }
        : staff
    )
  );
};  
  // ========================================
  //  NAVIGATION
  // ========================================


  const handleHome = () => {
  navigate(isAdmin ? "/admin/dashboard" : "/staff/dashboard");
  };


  const handleStaff = () => {
  navigate(isAdmin ? "/admin/staff/manage" : "/staff/staff/manage");
  };
  
  // const handleAssignWork = () => {
  // navigate(isAdmin ? "/admin/dashboard" : "/staff/assign-work/manage");
  // };

  // const handleAttendance = () => {
  // navigate(isAdmin ? "/admin/dashboard" : "/staff/dashboard");
  // };

  // ========================================
  // RESET FILTERS
  // ========================================

  const handleReset = () => {
    setSearch("");
    setDepartment("All");
    setSelectedLocation("All");
  };

  // ========================================
  // UI
  // ========================================

  return (
    <div className="dashboard">
{/* NAVBAR */}

<header className="top-navbar">
  <div className="navbar-brand">
    <img src={logo} alt="Aksharam Trust" />
  </div>

  <nav className="navbar-menu">
    {/* HOME */}
    <button
      type="button"
      className="nav-home"
       onClick={handleHome}
    >
      🏠 Home
    </button>

    {/* STAFF */}
    <button
      type="button"
      className="nav-module active"
      onClick={handleStaff}
    >
      👥 Staff
    </button>

    {/* STAFF WORK */}
    <button
      type="button"
      className="nav-module"
      onClick={() => navigate("/staff-assignwork/manage")}
    >
      📋 Assign Work
    </button>

    {/* STAFF ATTENDANCE */}
    <button
      type="button"
      className="nav-module"
      onClick={() => navigate("/staff-attendance/manage")}
    >
      🕒 Attendance
    </button>

    {/* STAFF DIARY */}
    <button
      type="button"
      className="nav-module"
      onClick={() => navigate("/staff-diary/manage")}
    >
      📔 To-Do
    </button>
  </nav>
</header>   


   {/* STAFF PAGE */}

      <div className="view-staff-page">
        {/* PAGE HEADER */}

        <div className="staff-page-header">
          <div>
            <h1>👥 Staff Management</h1>

            <p>
              {isAdmin
                ? "Manage staff members and their professional information."
                : "View staff members and their professional profiles."}
            </p>
          </div>

          {/* ADD BUTTON - ADMIN ONLY */}

         {isAdmin && (
            <div className="staff-action-buttons">
              <button
                type="button"
                className="add-staff-btn"
                onClick={handleAddStaff}
              >
                + Add Staff
              </button>
            </div>
          )}
         </div>

        {/* SUMMARY CARDS */}

        <div className="staff-summary-cards">

          <div className="staff-summary-card">
            <div className="staff-summary-icon">👥</div>

            <div>
              <span>Total Staff</span>
              <strong>{totalStaff}</strong>
            </div>
          </div>

          <div className="staff-summary-card">
            <div className="staff-summary-icon">✅</div>

            <div>
              <span>Active Staff</span>
              <strong>{activeStaff}</strong>
            </div>
          </div>

          <div className="staff-summary-card">
            <div className="staff-summary-icon">⏸️</div>

            <div>
              <span>Inactive Staff</span>
              <strong>{inactiveStaff}</strong>
            </div>
          </div>

          <div className="staff-summary-card">
            <div className="staff-summary-icon">🏢</div>

            <div>
              <span>Departments</span>
              <strong>{totalDepartments}</strong>
            </div>
          </div>
        </div>

        {/* SEARCH AND FILTERS */}

        <div className="staff-filter-box">
          {/* SEARCH */}

          <div className="staff-search-box">
            <span>🔍</span>

            <input
              type="text"
              placeholder="Search by name, ID, email or phone..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {/* LOCATION FILTER */}

            <select className="filter-group"
              id="locationFilter"
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
            >
              {locations.map((location) => (
                <option key={location} value={location}>
                  {location === "All" ? "All Locations" : location}
                </option>
              ))}
            </select>
         

          {/* DEPARTMENT FILTER */}

          <select
            className="staff-department-filter"
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
            aria-label="Filter by department"
          >
            {departments.map((dept) => (
              <option key={dept} value={dept}>
                {dept === "All" ? "All Departments" : dept}
              </option>
            ))}
          </select>

          {/* RESET FILTERS */}

          {(search ||
            department !== "All" ||
            selectedLocation !== "All") && (
            <button
              type="button"
              className="staff-reset-btn"
              onClick={handleReset}
            >
              ↻ Reset
            </button>
          )}
        </div>

        {/* STAFF TABLE */}

        <div className="staff-table-container">
          <div className="staff-table-heading">
            <div>
              <h3>Staff Directory</h3>

              <span>
                Showing {filteredStaff.length} of {staffList.length} staff
                members
              </span>
            </div>
          </div>

          <div className="staff-table-responsive">
            <table className="staff-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Employee ID</th>
                  <th>Staff Member</th>
                  <th>Designation</th>
                  <th>Department</th>
                  <th>Location</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {filteredStaff.length > 0 ? (
                  filteredStaff.map((staff, index) => (
                    <tr key={staff.id}>
                      <td>{index + 1}</td>

                      <td>
                        <span className="employee-id">
                          {staff.employeeId}
                        </span>
                      </td>

                      <td>
                        <div className="staff-name-cell">
                          <div className="staff-avatar">
                            {(staff.name || "S").charAt(0).toUpperCase()}
                          </div>

                          <div>
                            <strong>{staff.name}</strong>
                            <small>{staff.qualification}</small>
                          </div>
                        </div>
                      </td>

                      <td>{staff.designation}</td>

                      <td>
                        <span className="department-badge">
                          {staff.department}
                        </span>
                      </td>

                      <td>{staff.city || "Not specified"}</td>

                      <td>{staff.email}</td>

                      <td>{staff.phone}</td>

                      {/* STAFF STATUS */}

                      <td>
                        {isAdmin ? (
                          <select
                            className={`staff-status-select ${
                              staff.status === "Active"
                                ? "status-active"
                                : "status-inactive"
                            }`}
                            value={staff.status || "Active"}
                            onChange={(e) =>
                              handleStatusChange(staff.id, e.target.value)
                            }
                            aria-label={`Change status for ${staff.name}`}
                          >
                            <option value="Active">Active</option>
                            <option value="Inactive">Inactive</option>
                          </select>
                        ) : (
                          <span
                            className={`staff-status ${
                              staff.status === "Active"
                                ? "status-active"
                                : "status-inactive"
                            }`}
                          >
                            {staff.status || "Active"}
                          </span>
                        )}
                      </td>

                      <td>
                        <div className="action-buttons">
                          <button
                            type="button"
                            className="view-btn"
                            title="View Staff Profile"
                            onClick={() => handleView(staff)}
                          >
                            👁
                          </button>

                          {/* EDIT AND DELETE - ADMIN ONLY */}

                          {isAdmin && (
                            <>
                              <button
                                type="button"
                                className="edit-btn"
                                title="Edit Staff"
                                onClick={() => handleEdit(staff)}
                              >
                                ✎
                              </button>
                         
                              <button
                                type="button"
                                className="delete-btn"
                                title="Delete Staff"
                                onClick={() => handleDelete(staff.id)}
                              >
                                🗑
                              </button>
                                    </>
                          )}

                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="10" className="no-staff">
                      <div>
                        <span>👥</span>
                        <h3>No Staff Found</h3>
                        <p>
                          No staff members match your search or selected
                          filters.
                        </p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewStaff;