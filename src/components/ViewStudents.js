import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./ViewStudents.css";
import logo from "../assets/aksharam-logo.jpeg";

const ViewStudents = ({ role = "staff" }) => {
  const navigate = useNavigate();

  /* ================= FILTER STATES ================= */

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [locality, setLocality] = useState("All");

  /* ================= ROLE ================= */

  const isAdmin = role === "admin";
  const isStaff = role === "staff";

  /* =====================================================
     DEFAULT STUDENTS
     These are loaded only when localStorage is empty.
  ===================================================== */

  const defaultStudents = [
    {
      id: 1,
      name: "Ananya Krishnan",
      age: 14,
      dob: "2012-05-12",
      gender: "Female",

      projectArea: "Education",
      locality: "Kozhikode",

      phone: "9876543210",
      category: "HS",
      classCourse: "9",
      institution: "Government High School",
      performance: "Very Good",

      address: "Kozhikode",
      city: "Kozhikode",
      pincode: "673001",

      fatherName: "Krishnan",
      motherName: "Anitha",
      fatherOccupation: "Driver",
      motherOccupation: "Homemaker",
      fatherQualification: "SSLC",
      motherQualification: "Plus Two",

      ambition: "Doctor",
      healthIssues: "",
      hobbies: "Reading",
      skills: "Drawing",
      remarks: "",
      photo: null,
    },

    {
      id: 2,
      name: "Muhammed Shamil",
      age: 17,
      dob: "2009-02-18",
      gender: "Male",

      projectArea: "Education",
      locality: "Malappuram",

      phone: "9876501234",
      category: "HSS",
      classCourse: "12",
      institution: "Govt Higher Secondary School",
      performance: "Excellent",

      address: "Malappuram",
      city: "Malappuram",
      pincode: "676001",

      fatherName: "Abdul Rahman",
      motherName: "Fathima",
      fatherOccupation: "Business",
      motherOccupation: "Teacher",
      fatherQualification: "Degree",
      motherQualification: "Degree",

      ambition: "Engineer",
      healthIssues: "",
      hobbies: "Football",
      skills: "Leadership",
      remarks: "",
      photo: null,
    },

    {
      id: 3,
      name: "Devika Suresh",
      age: 11,
      dob: "2015-08-25",
      gender: "Female",

      projectArea: "Education",
      locality: "Kannur",

      phone: "9123456780",
      category: "UP",
      classCourse: "6",
      institution: "St. Mary's School",
      performance: "Good",

      address: "Kannur",
      city: "Kannur",
      pincode: "670001",

      fatherName: "Suresh",
      motherName: "Deepa",
      fatherOccupation: "Electrician",
      motherOccupation: "Homemaker",
      fatherQualification: "Plus Two",
      motherQualification: "Plus Two",

      ambition: "Teacher",
      healthIssues: "",
      hobbies: "Music",
      skills: "Singing",
      remarks: "",
      photo: null,
    },
  ];

  /* =====================================================
     LOAD STUDENTS FROM LOCAL STORAGE
  ===================================================== */

  const [students, setStudents] = useState(() => {
    const savedStudents = localStorage.getItem("aksharam_students");

    if (savedStudents !== null) {
      try {
        const parsedStudents = JSON.parse(savedStudents);

        if (Array.isArray(parsedStudents) && parsedStudents.length > 0) {
          return parsedStudents;
        }
      } catch (error) {
        console.error("Error loading students:", error);
      }
    }

    return defaultStudents;
  });

/* =====================================================
     SAVE STUDENTS TO LOCAL STORAGE
  ===================================================== */

  useEffect(() => {
    localStorage.setItem(
      "aksharam_students",
      JSON.stringify(students)
    );
  }, [students]);

  /* =====================================================
     LOCALITY OPTIONS
     Automatically created from student data
  ===================================================== */

  const localityOptions = [
    "All",
    ...new Set(
      students
        .map((student) => student.locality)
        .filter(Boolean)
    ),
  ];

  /* =====================================================
     FILTER STUDENTS
  ===================================================== */

  const filteredStudents = students.filter((student) => {
    const searchText = search.toLowerCase();

    const matchesSearch =
      student.name
        .toLowerCase()
        .includes(searchText) ||
      student.phone.includes(search) ||
      student.institution
        .toLowerCase()
        .includes(searchText);

    const matchesCategory =
      category === "All" ||
      student.category === category;

    const matchesLocality =
      locality === "All" ||
      student.locality === locality;

    return (
      matchesSearch &&
      matchesCategory &&
      matchesLocality
    );
  });

  /* =====================================================
     SELECTED LOCALITY COUNT
  ===================================================== */

  const selectedLocalityCount =
    locality === "All"
      ? students.length
      : students.filter(
          (student) =>
            student.locality === locality
        ).length;

  /* =====================================================
     ADD STUDENT
  ===================================================== */

  const handleAddStudent = () => {
    if (!isStaff) return;

    navigate("/students/add");
  };

  /* =====================================================
     EDIT STUDENT
  ===================================================== */

  const handleEdit = (student) => {
    if (!isStaff) return;

    navigate(`/students/edit/${student.id}`, {
      state: {
        student: student,
      },
    });
  };

  /* =====================================================
     VIEW STUDENT
  ===================================================== */

  const handleView = (student) => {
    navigate(`/students/profile/${student.id}`, {
      state: {
        student: student,
      },
    });
  };

  /* =====================================================
     DELETE STUDENT
  ===================================================== */

  const handleDelete = (id) => {
    if (!isStaff) return;

    const confirmDelete = window.confirm(
      "Are you sure you want to delete this student?"
    );

    if (!confirmDelete) return;

    setStudents((prevStudents) =>
      prevStudents.filter(
        (student) => student.id !== id
      )
    );
  };

  /* =====================================================
     CATEGORIZED STUDENTS
  ===================================================== */

  const handleCategorizedStudents = () => {
    if (isAdmin) {
      navigate("/admin/students/manage");
    } else {
      navigate("/staff/students/manage");
    }
  };

  /* =====================================================
     HOME
  ===================================================== */

  const handleHome = () => {
    if (isAdmin) {
      navigate("/admin/dashboard");
    } else {
      navigate("/staff/dashboard");
    }
  };

  /* =====================================================
     RESET FILTERS
  ===================================================== */

  const handleResetFilters = () => {
    setSearch("");
    setCategory("All");
    setLocality("All");
  };

  return (
    <div className="dashboard">

      {/* ================= TOP NAVBAR ================= */}

      <header className="top-navbar">

        <div className="navbar-brand">
          <img
            src={logo}
            alt="Aksharam Trust"
          />
        </div>

        <nav className="navbar-menu">

          <button
            className="nav-home"
            onClick={handleHome}
          >
            <span>🏠</span>
            <span>Home</span>
          </button>
         

          <button
            className="nav-module active"
            onClick={handleCategorizedStudents}
          >
            <span>🎓</span>
            <span>Students</span>
          </button>

        </nav>

      </header>

      {/* ================= PAGE ================= */}

      <div className="view-students-page">

        {/* ================= HEADER ================= */}

        <div className="students-header">

          <div>
            <h2>🎓 View Students</h2>

            <p>
              {isAdmin
                ? "View registered students and student profiles"
                : "Manage and view all registered students"}
            </p>
          </div>

          {isStaff && (
            <button
              className="add-student-btn"
              onClick={handleAddStudent}
            >
              ✚ Add Student
            </button>
          )}

        </div>

        {/* ================= SUMMARY ================= */}

        <div className="student-summary-cards">

          {/* TOTAL */}

          <div className="student-summary-card">

            <div className="summary-card-icon">
              🎓
            </div>

            <div>
              <span>Total Students</span>
              <strong>
                {students.length}
              </strong>
            </div>

          </div>

         {/* LOCALITY */}
 
         <div className="student-summary-card">

            <div  className="summary-card-icon">
              📍
            </div>

            <div>
              <span>
                {locality === "All"
                  ? "All Localities"
                  : locality}
              </span>

              <strong>
                {selectedLocalityCount}
              </strong>
            </div>

          </div>

          {/* MALE */}

          <div className="student-summary-card">

            <div className="summary-card-icon">
              👦
            </div>

            <div>
              <span>Male Students</span>

              <strong>
                {
                  filteredStudents.filter(
                    (student) =>
                      student.gender === "Male"
                  ).length
                }
              </strong>
            </div>

          </div>

          {/* FEMALE */}

          <div className="student-summary-card">

            <div className="summary-card-icon">
              👧
            </div>

            <div>
              <span>Female Students</span>

              <strong>
                {
                  filteredStudents.filter(
                    (student) =>
                      student.gender === "Female"
                  ).length
                }
              </strong>
            </div>

          </div>

          {/* HIGHER STUDIES */}

          <div className="student-summary-card">

            <div className="summary-card-icon">
              📚
            </div>

            <div>
              <span>Higher Studies</span>

              <strong>
                {
                  filteredStudents.filter(
                    (student) =>
                      student.category === "UG" ||
                      student.category === "PG"
                  ).length
                }
              </strong>
            </div>

          </div>

        </div>

        {/* ================= FILTER SECTION ================= */}

        <div className="student-filter-section">

          {/* SEARCH */}

          <div className="search-box">

            <span>🔍</span>

            <input
              type="text"
              placeholder="Search by name, phone or institution..."
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
            />

          </div>

          {/* LOCALITY */}

          <select
            className="locality-filter"
            value={locality}
            onChange={(e) =>
              setLocality(e.target.value)
            }
          >

            <option value="All">
              📍 All Localities
            </option>

            {localityOptions
              .filter(
                (item) => item !== "All"
              )
              .map((item) => (
                <option
                  key={item}
                  value={item}
                >
                  {item}
                </option>
              ))}

          </select>


        {/* CATEGORY */}

          <select
            className="category-filter"
            value={category}
            onChange={(e) =>
              setCategory(e.target.value)
            }
          >

            <option value="All">
              All Categories
            </option>

            <option value="LP">LP</option>
            <option value="UP">UP</option>
            <option value="HS">HS</option>
            <option value="HSS">HSS</option>
            <option value="VHSE">VHSE</option>
            <option value="UG">UG</option>
            <option value="PG">PG</option>

          </select>



          {/* RESET */}

          {(search ||
            category !== "All" ||
            locality !== "All") && (
            <button
              className="reset-filter-btn"
              onClick={handleResetFilters}
            >
              ↻ Reset
            </button>
          )}

        </div>

        {/* ================= LOCALITY INFO ================= */}

        {locality !== "All" && (
          <div className="selected-locality-info">

            <div className="selected-locality-icon">
              📍
            </div>

            <div>

              <strong>
                {locality}
              </strong>

              <span>
                {selectedLocalityCount}{" "}
                {selectedLocalityCount === 1
                  ? "student"
                  : "students"}{" "}
                registered in this locality
              </span>

            </div>

          </div>
        )}

        {/* ================= TABLE ================= */}

        <div className="students-table-container">

          <div className="table-heading">

            <div>

              <h3>
                {locality === "All"
                  ? "Student List"
                  : `Students in ${locality}`}
              </h3>

              <span>
                Showing{" "}
                {filteredStudents.length}{" "}
                of{" "}
                {students.length} students
              </span>

            </div>

          </div>

          <div className="table-responsive">

            <table className="students-table">

              <thead>

                <tr>
                  <th>#</th>
                  <th>Student</th>
                  <th>Age</th>
                  <th>Gender</th>
                  <th>Locality</th>
                  <th>Category</th>
                  <th>Class / Course</th>
                  <th>Institution</th>
                  <th>Performance</th>
                  <th>Phone</th>
                  <th>Actions</th>
                </tr>

              </thead>

              <tbody>

                {filteredStudents.length > 0 ? (

                  filteredStudents.map(
                    (student, index) => (

                      <tr key={student.id}>

                        <td>
                          {index + 1}
                        </td>

                        <td>

                          <div className="student-name-cell">

                            <div className="student-avatar">
                              {student.name
                                .charAt(0)
                                .toUpperCase()}
                            </div>

                            <div>

                              <strong>
                                {student.name}
                              </strong>

                              <small>
                                {student.projectArea}
                              </small>

                            </div>

                          </div>

                        </td>

                        <td>
                          {student.age}
                        </td>

                        <td>
                          {student.gender}
                        </td>

                        <td>

                          <span className="locality-badge">
                            📍 {student.locality}
                          </span>

                        </td>

                        <td>

                          <span className="category-badge">
                            {student.category}
                          </span>

                        </td>

                        <td>
                          {student.classCourse}
                        </td>

                        <td>
                          {student.institution}
                        </td>

                        <td>

                          <span
                            className={`performance-badge ${student.performance
                              .toLowerCase()
                              .replace(/\s+/g, "-")}`}
                          >
                            {student.performance}
                          </span>

                        </td>

                        <td>
                          {student.phone}
                        </td>

                        <td>

                          <div className="action-buttons">

                            {/* VIEW */}

                            <button
                              className="view-btn"
                              title="View Student Profile"
                              onClick={() =>
                                handleView(student)
                              }
                            >
                              👁
                            </button>

                            {/* EDIT */}

                            {isStaff && (
                              <button
                                className="edit-btn"
                                title="Edit Student"
                                onClick={() =>
                                  handleEdit(student)
                                }
                              >
                                ✎
                              </button>
                            )}

                            {/* DELETE */}

                            {isStaff && (
                              <button
                                className="delete-btn"
                                title="Delete Student"
                                onClick={() =>
                                  handleDelete(
                                    student.id
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
                      colSpan="11"
                      className="no-students"
                    >

                      <div>

                        <span>🎓</span>

                        <h3>
                          No Students Found
                        </h3>

                        <p>
                          No students match your
                          current search,
                          category or locality.
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

export default ViewStudents;

