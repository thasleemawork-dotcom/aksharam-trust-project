
import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./AdminAddEditStaff.css";

const AdminAddEditStaff = () => {
  const navigate = useNavigate(); 
  const location = useLocation(); 
  
  const staff = location.state?.staff;


  // const [formData, setFormData] = useState({
  //   name: "",
  //   gender: "",
  //   phone: "",
  //   email: "",

  //   designation: "",
  //   department: "",
  //   joiningDate: "",
  //   employeeId: "",

  //   qualification: "",
  //   specialization: "",

  //   remarks: "",

  //   photo: null,

  //   // Staff Login
  //   username: "",
  //   password: "",
  //   confirmPassword: "",
  // });



  const [formData, setFormData] = useState({
    name: staff?.name || "",
    gender: staff?.gender || "",
    phone: staff?.phone || "",
    email: staff?.email || "",

    designation: staff?.designation || "",
    department: staff?.department || "",
    joiningDate: staff?.joiningDate || "",
    employeeId: staff?.employeeId || "",
    workLocation: staff?.workLocation || "",

    qualification: staff?.qualification || "",
    specialization: staff?.specialization || "",

    remarks: staff?.remarks || "",

    photo: staff?.photo || null,

    username: staff?.username || "",
    password: "",
    confirmPassword: "",
  });

  const isEdit = Boolean(staff);


  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePhoto = (e) => {
    const file = e.target.files[0];

    if (file) {
      setFormData((prev) => ({
        ...prev,
        photo: file,
      }));
    }
  };

const handleSubmit = (e) => {
  e.preventDefault();

  if (formData.password !== formData.confirmPassword) {
    alert("Passwords do not match!");
    return;
  }

  if (isEdit) {
    console.log("Updated Staff:", formData);

    alert("Staff updated successfully!");
  } else {
    console.log("Added Staff:", formData);

    alert("Staff added successfully!");
  }

  navigate("/admin/staff/manage");
};




  const handleCancel = () => {
    setFormData({
      name: "",
      gender: "",
      phone: "",
      email: "",

      designation: "",
      department: "",
      joiningDate: "",
      employeeId: "",
      workLocation: "",

      qualification: "",
      specialization: "",

      remarks: "",
      photo: null,

      username: "",
      password: "",
      confirmPassword: "",
    });
    navigate("/admin/staff/manage");
  };

  return (
    <div className="admin-staff-page">

      <div className="admin-staff-card">

        {/* HEADER */}
        <div className="admin-staff-header">
          <div className="header-left">
            <span className="header-icon">👥</span>

            <div>
             <h2>{isEdit ? "Edit Staff" : "Add Staff"}</h2>
              <p> {isEdit ? "Update staff information" : "Create a new staff account"} </p>
            </div>
          </div>

          <button className="close-btn">×</button>
        </div>


        <form onSubmit={handleSubmit}>

          <div className="admin-content">


            {/* LEFT */}
            <div className="admin-left">

              {/* PERSONAL DETAILS */}
              <section className="admin-section">

                <div className="admin-section-title">
                  👤
                  <span>Personal Details</span>
                </div>

                <div className="admin-grid">

                  <div className="admin-group">
                    <label>
                      Full Name <b>*</b>
                    </label>

                    <input
                      type="text"
                      name="name"
                      placeholder="Enter staff name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                    />
                  </div>

                 
                  <div className="admin-group">
                    <label>
                      Gender <b>*</b>
                    </label>

                    <select
                      name="gender"
                      value={formData.gender}
                      onChange={handleChange}
                      required
                    >
                      <option value="">Select Gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  <div className="admin-group">
                    <label>
                      Phone Number <b>*</b>
                    </label>

                    <input
                      type="tel"
                      name="phone"
                      placeholder="Enter phone number"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="admin-group">
                    <label>Email</label>

                    <input
                      type="email"
                      name="email"
                      placeholder="Enter email address"
                      value={formData.email}
                      onChange={handleChange}
                    />
                  </div>

                </div>
              </section>


              {/* EMPLOYMENT */}
              <section className="admin-section">

                <div className="admin-section-title">
                  💼
                  <span>Employment Details</span>
                </div>

                <div className="admin-grid">

                  <div className="admin-group">
                    <label>
                      Employee ID <b>*</b>
                    </label>

                    <input
                      type="text"
                      name="employeeId"
                      placeholder="Enter employee ID"
                      value={formData.employeeId}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="admin-group">
                    <label>
                      Designation <b>*</b>
                    </label>

                    <input
                      type="text"
                      name="designation"
                      placeholder="Enter designation"
                      value={formData.designation}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="admin-group">
                    <label>
                      Department <b>*</b>
                    </label>

                    <select
                      name="department"
                      value={formData.department}
                      onChange={handleChange}
                      required
                    >
                      <option value="">Select Department</option>
                      <option value="Administration">
                        Administration
                      </option>
                      <option value="Coordinator">
                        Coordinator
                      </option>
                      <option value="Education">
                        Education
                      </option>
                      <option value="Counselling">
                        Counselling
                      </option>
                      <option value="Accounts">
                        Accounts
                      </option>
                      <option value="Project">
                        Project
                      </option>
                      <option value="Social Work">
                        Social Work
                      </option>
                      <option value="Support">
                        Support
                      </option>
                    </select>
                  </div>

                  <div className="admin-group">
                    <label>
                      Joining Date <b>*</b>
                    </label>

                    <input
                      type="date"
                      name="joiningDate"
                      value={formData.joiningDate}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="admin-group">
                    <label>
                      Work Location <b>*</b>
                    </label>

                    <input
                      type="text"
                      name="workLocation"
                      value={formData.workLocation}
                      onChange={handleChange}
                      required
                    />
                  </div>


                  {/* STAFF STATUS */}

                  <div className="form-group">
                    <label htmlFor="status">Staff Status</label>

                    <select
                      id="status"
                      name="status"
                      value={formData.status || "Active"}
                      onChange={handleChange}
                    >
                      <option value="Active">Active</option>
                      <option value="Inactive">Inactive</option>
                    </select>
                  </div>

                </div>
              </section>


              {/* QUALIFICATION */}
              <section className="admin-section">

                <div className="admin-section-title">
                  🎓
                  <span>Qualification</span>
                </div>

                <div className="admin-grid">

                  <div className="admin-group">
                    <label>
                      Qualification <b>*</b>
                    </label>

                    <input
                      type="text"
                      name="qualification"
                      placeholder="Enter highest qualification"
                      value={formData.qualification}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="admin-group">
                    <label>Specialization</label>

                    <input
                      type="text"
                      name="specialization"
                      placeholder="Enter specialization"
                      value={formData.specialization}
                      onChange={handleChange}
                    />
                  </div>

                </div>
              </section>


              {/* STAFF LOGIN */}
              <section className="admin-section">

                <div className="admin-section-title">
                  🔐
                  <span>Staff Login Account</span>
                </div>

                <div className="login-info">
                  Login credentials will be used by the staff member
                  to access the staff portal.
                </div>

                <div className="admin-grid">

                  <div className="admin-group">
                    <label>
                      Username <b>*</b>
                    </label>

                    <input
                      type="text"
                      name="username"
                      placeholder="Enter username"
                      value={formData.username}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="admin-group">
                    <label>
                      Password <b>*</b>
                    </label>

                    <div className="password-box">

                      <input
                        type={showPassword ? "text" : "password"}
                        name="password"
                        placeholder="Enter password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                      />

                      <button
                        type="button"
                        onClick={() =>
                          setShowPassword(!showPassword)
                        }
                      >
                        {showPassword ? "🙈" : "👁"}
                      </button>

                    </div>
                  </div>

                  <div className="admin-group">

                    <label>
                      Confirm Password <b>*</b>
                    </label>

                    <div className="password-box">

                      <input
                        type={
                          showConfirmPassword
                            ? "text"
                            : "password"
                        }
                        name="confirmPassword"
                        placeholder="Confirm password"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        required
                      />

                      <button
                        type="button"
                        onClick={() =>
                          setShowConfirmPassword(
                            !showConfirmPassword
                          )
                        }
                      >
                        {showConfirmPassword ? "🙈" : "👁"}
                      </button>

                    </div>

                  </div>

                </div>
              </section>


              {/* REMARKS */}
              <section className="admin-section">

                <div className="admin-section-title">
                  📄
                  <span>Additional Information</span>
                </div>

                <div className="admin-group remarks-group">

                  <label>Remarks</label>

                  <textarea
                    name="remarks"
                    placeholder="Enter remarks"
                    value={formData.remarks}
                    onChange={handleChange}
                  />

                </div>

              </section>

            </div>


            {/* RIGHT SIDE */}
            <div className="admin-right">

              {/* PHOTO */}
              <div className="admin-photo-card">

                <div className="photo-preview">
                  {formData.photo ? (
                    <img
                      src={URL.createObjectURL(formData.photo)}
                      alt="Staff"
                    />
                  ) : (
                    <span>👤</span>
                  )}
                </div>

                <label className="photo-upload">

                  ⬆ Upload Photo

                  <input
                    type="file"
                    accept="image/png,image/jpeg"
                    onChange={handlePhoto}
                  />

                </label>

                <small>
                  JPG or PNG • Maximum 2MB
                </small>

              </div>


              {/* STAFF PREVIEW */}
              <div className="staff-preview">

                <div className="preview-title">
                  ▣ Staff Preview
                </div>

                <div className="preview-row">
                  <span>Name</span>
                  <strong>
                    {formData.name || "-"}
                  </strong>
                </div>

                <div className="preview-row">
                  <span>Employee ID</span>
                  <strong>
                    {formData.employeeId || "-"}
                  </strong>
                </div>

                <div className="preview-row">
                  <span>Designation</span>
                  <strong>
                    {formData.designation || "-"}
                  </strong>
                </div>

                <div className="preview-row">
                  <span>Department</span>
                  <strong>
                    {formData.department || "-"}
                  </strong>
                </div>

                <div className="preview-row">
                  <span>Phone</span>
                  <strong>
                    {formData.phone || "-"}
                  </strong>
                </div>

                <div className="preview-row">
                  <span>Username</span>
                  <strong>
                    {formData.username || "-"}
                  </strong>
                </div>

              </div>


              {/* NOTE */}
              <div className="admin-note">

                <div className="note-circle">
                  i
                </div>

                <div>
                  <h4>Admin Note</h4>

                  <p>
                    After saving the staff details, the staff
                    member can use the created username and
                    password to access the staff portal.
                  </p>
                </div>

              </div>

            </div>

          </div>


          {/* FOOTER */}
          <div className="admin-footer">

            <button
              type="button"
              className="admin-cancel"
              onClick={handleCancel}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="admin-save"
            >
              💾 {isEdit ? "Update Staff" : "Save Staff"}
            </button>

          </div>

        </form>

      </div>

    </div>
  );
};

export default AdminAddEditStaff;



