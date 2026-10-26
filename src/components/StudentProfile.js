import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./StudentProfile.css";

const StudentProfile = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const student = location.state?.student;

  if (!student) {
    return (
      <div className="student-profile-page">
        <div className="profile-not-found">
          <h2>Student Not Found</h2>
          <p>Student information is not available.</p>

          <button
            onClick={() => navigate("/staff/students/manage")}
          >
            ← Back to Students
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="student-profile-page">

      <div className="student-profile-card">

        {/* Header */}

        <div className="profile-header">

          <div>
            <h2>🎓 Student Profile</h2>
            <p>Complete student information</p>
          </div>

          <button
            className="back-btn"
            onClick={() => navigate("/staff/students/manage")}
          >
            ← Back
          </button>

        </div>

        {/* Student Basic Information */}

        <div className="profile-top">

          <div className="profile-avatar">
            {student.name.charAt(0).toUpperCase()}
          </div>

          <div className="profile-name">

            <h2>{student.name}</h2>

            <p>
              {student.category} • Class{" "}
              {student.classCourse}
            </p>

            <span>
              {student.institution}
            </span>

          </div>

          <button
            className="profile-edit-btn"
            onClick={() =>
              navigate(`/students/edit/${student.id}`, {
                state: { student },
              })
            }
          >
            ✎ Edit Student
          </button>

        </div>

        {/* Personal Details */}

        <div className="profile-section">

          <h3>👤 Personal Details</h3>

          <div className="profile-grid">

            <div>
              <label>Full Name</label>
              <strong>{student.name}</strong>
            </div>

            <div>
              <label>Age</label>
              <strong>{student.age}</strong>
            </div>

            <div>
              <label>Date of Birth</label>
              <strong>{student.dob}</strong>
            </div>

            <div>
              <label>Gender</label>
              <strong>{student.gender}</strong>
            </div>

            <div>
              <label>Phone</label>
              <strong>{student.phone}</strong>
            </div>

            <div>
              <label>Project Area</label>
              <strong>{student.projectArea}</strong>
            </div>

          </div>

        </div>

        {/* Academic */}

        <div className="profile-section">

          <h3>📖 Academic Details</h3>

          <div className="profile-grid">

            <div>
              <label>Category</label>
              <strong>{student.category}</strong>
            </div>

            <div>
              <label>Class / Course</label>
              <strong>{student.classCourse}</strong>
            </div>

            <div>
              <label>Institution</label>
              <strong>{student.institution}</strong>
            </div>

            <div>
              <label>Performance</label>
              <strong>{student.performance}</strong>
            </div>

          </div>

        </div>

        {/* Address */}

        <div className="profile-section">

          <h3>📍 Address Details</h3>

          <div className="profile-grid">

            <div className="full-width">
              <label>Address</label>
              <strong>{student.address || "-"}</strong>
            </div>

            <div>
              <label>City</label>
              <strong>{student.city || "-"}</strong>
            </div>

            <div>
              <label>Pincode</label>
              <strong>{student.pincode || "-"}</strong>
            </div>

          </div>

        </div>

        {/* Parents */}

        <div className="profile-section">

          <h3>👥 Parent Details</h3>

          <div className="profile-grid">

            <div>
              <label>Father's Name</label>
              <strong>{student.fatherName || "-"}</strong>
            </div>

            <div>
              <label>Mother's Name</label>
              <strong>{student.motherName || "-"}</strong>
            </div>

            <div>
              <label>Father's Occupation</label>
              <strong>
                {student.fatherOccupation || "-"}
              </strong>
            </div>

            <div>
              <label>Mother's Occupation</label>
              <strong>
                {student.motherOccupation || "-"}
              </strong>
            </div>

          </div>

        </div>

        {/* Additional */}

        <div className="profile-section">

          <h3>📄 Additional Information</h3>

          <div className="profile-grid">

            <div>
              <label>Ambition</label>
              <strong>{student.ambition || "-"}</strong>
            </div>

            <div>
              <label>Health Issues</label>
              <strong>
                {student.healthIssues || "None"}
              </strong>
            </div>

            <div>
              <label>Hobbies</label>
              <strong>{student.hobbies || "-"}</strong>
            </div>

            <div>
              <label>Skills</label>
              <strong>{student.skills || "-"}</strong>
            </div>

            <div className="full-width">
              <label>Remarks</label>
              <strong>{student.remarks || "-"}</strong>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
};

export default StudentProfile;