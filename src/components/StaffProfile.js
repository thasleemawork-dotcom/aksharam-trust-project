import React from "react";
import { useNavigate, useParams,  } from "react-router-dom";
import "./StaffProfile.css";

const StaffProfile = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  

  // Sample staff data
  // Later this data can come from your backend/database
  const staffList = [
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

  // Find staff using URL id
  const staff = staffList.find(
    (item) => item.id === Number(id)
  );

  // If staff doesn't exist
  if (!staff) {
    return (
      <div className="profile-not-found">
        <div className="not-found-card">
          <div className="not-found-icon">⚠️</div>

          <h2>Staff Not Found</h2>

          <p>
            The staff member you are looking for does not exist.
          </p>

          <button
            onClick={() => navigate("/staff/view")}
          >
            ← Back to Staff List
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="staff-profile-page">

      {/* Page Header */}
      <div className="profile-page-header">

        <div>
          <h1>Staff Profile</h1>
          <p>View complete staff information</p>
        </div>

        <button
          className="back-btn"
          onClick={() => navigate("/staff/view")}
        >
          ← Back to Staff
        </button>

      </div>

      {/* Profile Header Card */}
      <div className="profile-header-card">

        <div className="profile-photo">

          {staff.photo ? (
            <img
              src={staff.photo}
              alt={staff.name}
            />
          ) : (
            <div className="profile-initial">
              {staff.name.charAt(0).toUpperCase()}
            </div>
          )}

        </div>

        <div className="profile-main-info">

          <h2>{staff.name}</h2>

          <p className="designation">
            {staff.designation}
          </p>

          <p className="employee-id">
            Employee ID: <strong>{staff.employeeId}</strong>
          </p>

          <span
            className={
              staff.status === "Active"
                ? "profile-status active"
                : "profile-status inactive"
            }
          >
            {staff.status}
          </span>

        </div>

        <button
          className="edit-profile-btn"
          onClick={() =>
            navigate(`/staff/profile-edit/${staff.id}`, {
              state: { staff },
            })
          }
        >
          ✎ Edit Profile
        </button>

      </div>

      

      {/* Personal Information */}
      <div className="profile-section">

        <div className="section-title">
          <span>👤</span>
          <h3>Personal Information</h3>
        </div>

        <div className="profile-grid">

          <div className="profile-field">
            <label>Full Name</label>
            <strong>{staff.name}</strong>
          </div>

          <div className="profile-field">
            <label>Date of Birth</label>
            <strong>{staff.dob}</strong>
          </div>

          <div className="profile-field">
            <label>Gender</label>
            <strong>{staff.gender}</strong>
          </div>

          <div className="profile-field">
            <label>Phone Number</label>
            <strong>{staff.phone}</strong>
          </div>

          <div className="profile-field">
            <label>Email Address</label>
            <strong>{staff.email}</strong>
          </div>

        </div>

      </div>

      {/* Employment Information */}
      <div className="profile-section">

        <div className="section-title">
          <span>💼</span>
          <h3>Employment Information</h3>
        </div>

        <div className="profile-grid">

          <div className="profile-field">
            <label>Employee ID</label>
            <strong>{staff.employeeId}</strong>
          </div>

          <div className="profile-field">
            <label>Designation</label>
            <strong>{staff.designation}</strong>
          </div>

          <div className="profile-field">
            <label>Department</label>
            <strong>{staff.department}</strong>
          </div>

          <div className="profile-field">
            <label>Joining Date</label>
            <strong>{staff.joiningDate}</strong>
          </div>

          <div className="profile-field">
            <label>Employment Status</label>
            <strong>{staff.status}</strong>
          </div>

        </div>

      </div>

      {/* Qualification Information */}
      <div className="profile-section">

        <div className="section-title">
          <span>🎓</span>
          <h3>Qualification & Experience</h3>
        </div>

        <div className="profile-grid">

          <div className="profile-field">
            <label>Qualification</label>
            <strong>{staff.qualification}</strong>
          </div>

          <div className="profile-field">
            <label>Specialization</label>
            <strong>{staff.specialization}</strong>
          </div>

          <div className="profile-field">
            <label>Experience</label>
            <strong>{staff.experience}</strong>
          </div>

          <div className="profile-field">
            <label>Institution</label>
            <strong>{staff.institution}</strong>
          </div>

        </div>

      </div>

      {/* Address */}
      <div className="profile-section">

        <div className="section-title">
          <span>📍</span>
          <h3>Address Information</h3>
        </div>

        <div className="profile-grid">

          <div className="profile-field full-width">
            <label>Address</label>
            <strong>{staff.address}</strong>
          </div>

          <div className="profile-field">
            <label>City</label>
            <strong>{staff.city}</strong>
          </div>

          <div className="profile-field">
            <label>Pincode</label>
            <strong>{staff.pincode}</strong>
          </div>

        </div>

      </div>

      {/* Emergency Contact */}
      <div className="profile-section">

        <div className="section-title">
          <span>🚨</span>
          <h3>Emergency Contact</h3>
        </div>

        <div className="profile-grid">

          <div className="profile-field">
            <label>Contact Name</label>
            <strong>{staff.emergencyName}</strong>
          </div>

          <div className="profile-field">
            <label>Relationship</label>
            <strong>{staff.emergencyRelation}</strong>
          </div>

          <div className="profile-field">
            <label>Contact Number</label>
            <strong>{staff.emergencyPhone}</strong>
          </div>

        </div>

      </div>

      {/* Skills & Remarks */}
      <div className="profile-section">

        <div className="section-title">
          <span>⭐</span>
          <h3>Skills & Remarks</h3>
        </div>

        <div className="profile-grid">

          <div className="profile-field full-width">
            <label>Skills</label>
            <strong>{staff.skills}</strong>
          </div>

          <div className="profile-field full-width">
            <label>Remarks</label>
            <strong>{staff.remarks}</strong>
          </div>

        </div>

      </div>

      {/* Bottom Buttons */}
      <div className="profile-actions">

        <button
          className="bottom-back-btn"
          onClick={() => navigate("/staff/view")}
        >
          ← Back to Staff List
        </button>

        <button
          className="bottom-edit-btn"
          onClick={() =>
            navigate(`/staff/profile-edit/${staff.id}`, {
              state: { staff },
            })
          }
        >
          ✎ Edit Profile
        </button>

      </div>

    </div>
  );
};

export default StaffProfile;