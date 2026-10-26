import React, { useState, useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import "./StudentForm.css";

const StaffUpdateForm = () => {

    const navigate = useNavigate();
    const location = useLocation();
    const { id } = useParams();

    const staff = location.state?.staff;

  const [formData, setFormData] = useState({
    name: "",
    dob: "",
    gender: "",
    phone: "",
    email: "",

    designation: "",
    department: "",
    joiningDate: "",
    employeeId: "",

    maritalStatus: "",
    languagesKnown: "",

    qualification: "",
    specialization: "",
    experience: "",
    institution: "",

    address: "",
    city: "",
    pincode: "",

    emergencyName: "",
    emergencyRelation: "",
    emergencyPhone: "",

    skills: "",
    remarks: "",

    photo: null,
  });

    const [mode, setMode] = useState(
      staff ? "edit" : "add"
    );


useEffect(() => {
  if (staff) {
    setFormData({
      name: staff.name || "",
      dob: staff.dob || "",
      gender: staff.gender || "",
      phone: staff.phone || "",
      email: staff.email || "",

      designation: staff.designation || "",
      department: staff.department || "",
      joiningDate: staff.joiningDate || "",
      employeeId: staff.employeeId || "",

      maritalStatus: staff.maritalStatus || "",
      languagesKnown: staff.languagesKnown || "",

      qualification: staff.qualification || "",
      specialization: staff.specialization || "",
      experience: staff.experience || "",
      institution: staff.institution || "",

      address: staff.address || "",
      city: staff.city || "",
      pincode: staff.pincode || "",

      emergencyName: staff.emergencyName || "",
      emergencyRelation: staff.emergencyRelation || "",
      emergencyPhone: staff.emergencyPhone || "",

      skills: staff.skills || "",
      remarks: staff.remarks || "",

      photo: staff.photo || null,
    });
  }
}, [staff]);



  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handlePhoto = (e) => {
    setFormData({
      ...formData,
      photo: e.target.files[0],
    });
  };

const handleSubmit = (e) => {
  e.preventDefault();

  console.log("Staff Data:", formData);

  if (mode === "add") {
    alert("Staff added successfully!");

    navigate("/staff/view");
  } else {
    alert("Staff updated successfully!");

    navigate(`/staff/profile/${id}`, {
      state: {
        staff: {
          ...staff,
          ...formData,
          id: staff?.id || Number(id),
        },
      },
    });
  }
};

  return (
    <div className="student-page">

      <div className="student-form">

        {/* ================= HEADER ================= */}

        <div className="student-header">

          <div className="student-title">
            <span className="graduation-icon">👥</span>
            <h2>Staff Form</h2>
          </div>

          <button className="close-btn">×</button>

        </div>


        {/* ================= ADD / EDIT ================= */}

        <div className="form-mode">

          <button
            type="button"
            className={
              mode === "add"
                ? "mode-btn active"
                : "mode-btn"
            }
            onClick={() => setMode("add")}
          >
            ➕ Add Staff
          </button>


          <button
            type="button"
            className={
              mode === "edit"
                ? "mode-btn active-edit"
                : "mode-btn"
            }
            onClick={() => setMode("edit")}
          >
            ✎ Edit Staff
          </button>

        </div>


        <form onSubmit={handleSubmit}>

          <div className="form-layout">

            {/* =================================================
                LEFT SIDE
            ================================================= */}

            <div className="form-left">


              {/* ================= PERSONAL DETAILS ================= */}

              <section className="form-section">

                <div className="section-title">
                  <span>👤</span>
                  Personal Details
                </div>



                <div className="form-grid">

                  <div className="form-group">

                    <label>
                      Full Name <b>*</b>
                    </label>

                    <div className="input-box">

                      <span>👤</span>

                      <input
                        type="text"
                        name="name"
                        placeholder="Enter staff name"
                        value={formData.name}
                        onChange={handleChange}
                      />

                    </div>

                  </div>


                  <div className="form-group">

                    <label>
                      DoB <b>*</b>
                    </label>

                    <div className="input-box">

                      <span>📅</span>

                      <input
                        type="date"
                        name="dob"
                        value={formData.dob}
                        onChange={handleChange}
                      />

                    </div>

                  </div>


                  <div className="form-group">

                    <label>
                      Gender <b>*</b>
                    </label>

                    <select
                      name="gender"
                      value={formData.gender}
                      onChange={handleChange}
                    >

                      <option value="">
                        Select Gender
                      </option>

                      <option value="Male">
                        Male
                      </option>

                      <option value="Female">
                        Female
                      </option>

                      <option value="Other">
                        Other
                      </option>

                    </select>

                  </div>


                  <div className="form-group">

                    <label>
                      Phone Number <b>*</b>
                    </label>

                    <div className="input-box">

                      <span>📞</span>

                      <input
                        type="tel"
                        name="phone"
                        placeholder="Enter phone number"
                        value={formData.phone}
                        onChange={handleChange}
                      />

                    </div>

                  </div>


                  <div className="form-group">

                    <label>Email</label>

                    <div className="input-box">

                      <span>✉️</span>

                      <input
                        type="email"
                        name="email"
                        placeholder="Enter email address"
                        value={formData.email}
                        onChange={handleChange}
                      />

                    </div>

                  </div>

                    <div className="form-group">
                    <label>Marital Status</label>
                    <select
                        name="maritalStatus"
                        value={formData.maritalStatus}
                        onChange={handleChange}>
                        <option value="">Select Status</option>
                        <option value="Single">Single</option>
                        <option value="Married">Married</option>
                        <option value="Divorced">Divorced</option>
                        <option value="Widowed">Widowed</option>
                    </select>
                    </div>

                    <div className="form-group">
                    <label>Languages Known</label>
                    <input
                        type="text"
                        name="languagesKnown"
                        value={formData.languagesKnown}
                        onChange={handleChange}
                        placeholder="e.g. Malayalam, English, Hindi"
                    />
                    </div>




                </div>

              </section>


              {/* ================= EMPLOYMENT DETAILS ================= */}

              <section className="form-section">

                <div className="section-title">             
                  <span>💼</span>
                  Employment Details
                </div>


                <div className="form-grid">

                  <div className="form-group">

                    <label>
                      Employee ID
                    </label>

                    <div className="input-box">

                      <span>🆔</span>

                      <input
                        type="text"
                        name="employeeId"
                        placeholder="Enter employee ID"
                        value={formData.employeeId}
                        onChange={handleChange}
                      />
                    </div>

                  </div>


                  <div className="form-group">

                    <label>
                      Designation <b>*</b>
                    </label>

                    <input
                      type="text"
                      name="designation"
                      placeholder="Enter designation"
                      value={formData.designation}
                      onChange={handleChange}
                    />

                  </div>


                  <div className="form-group">

                    <label>
                      Department <b>*</b>
                    </label>

                    <select
                      name="department"
                      value={formData.department}
                      onChange={handleChange}
                    >

                      <option value="">Select Department</option>
                      <option value="Administration"> Administration </option>
                      <option value="Education"> Coordinator </option>
                      <option value="Education"> Education </option>
                      <option value="Education"> Counselling </option>
                      <option value="Accounts"> Accounts </option>
                      <option value="Project"> Project </option>
                      <option value="Social Work"> Social Work </option>
                      <option value="Support">Support</option>

                    </select>

                  </div>


                  <div className="form-group">

                    <label>
                      Joining Date <b>*</b>
                    </label>

                    <div className="input-box">

                      <span>📅</span>

                      <input
                        type="date"
                        name="joiningDate"
                        value={formData.joiningDate}
                        onChange={handleChange}
                      />

                    </div>

                  </div>

                </div>

              </section>


              {/* ================= QUALIFICATION ================= */}

              <section className="form-section">

                <div className="section-title">                 
                  <span>🎓</span>
                  Qualification & Experience
                </div>


                <div className="form-grid">

                  <div className="form-group">

                    <label>
                      Highest Qualification <b>*</b>
                    </label>

                    <input
                      type="text"
                      name="qualification"
                      placeholder="Enter qualification"
                      value={formData.qualification}
                      onChange={handleChange}
                    />

                  </div>


                  <div className="form-group">

                    <label>
                      Specialization
                    </label>

                    <input
                      type="text"
                      name="specialization"
                      placeholder="Enter specialization"
                      value={formData.specialization}
                      onChange={handleChange}
                    />

                  </div>


                  <div className="form-group">

                    <label>
                      Experience
                    </label>

                    <select
                      name="experience"
                      value={formData.experience}
                      onChange={handleChange}
                    >

                      <option value=""> Select Experience </option>
                      <option value="Fresher"> Fresher </option>
                      <option value="1-2 Years"> 1-2 Years </option>                        
                      <option value="3-5 Years"> 3-5 Years </option>                      
                      <option value="6-10 Years"> 6-10 Years </option>                                         
                      <option value="10+ Years"> 10+ Years  </option>

                    </select>

                  </div>


                  <div className="form-group">

                    <label>
                      Previous Institution / Organization
                    </label>

                    <input
                      type="text"
                      name="institution"
                      placeholder="Enter previous organization"
                      value={formData.institution}
                      onChange={handleChange}
                    />

                  </div>

                </div>

              </section>


              {/* ================= ADDRESS ================= */}

              <section className="form-section">

                <div className="section-title">
                   <span>📍</span>
                   Address Details
                </div>


                <div className="form-group">

                  <label>
                    Address
                  </label>

                  <textarea
                    name="address"
                    placeholder="Enter address"
                    value={formData.address}
                    onChange={handleChange}
                  />

                </div>


                <div className="form-grid">

                  <div className="form-group">

                    <label>
                      City
                    </label>

                    <div className="input-box">

                      <span>📍</span>

                      <input
                        type="text"
                        name="city"
                        placeholder="Enter city"
                        value={formData.city}
                        onChange={handleChange}
                      />

                    </div>

                  </div>


                  <div className="form-group">

                    <label>
                      Pincode
                    </label>

                    <div className="input-box">

                      <span>📮</span>

                      <input
                        type="text"
                        name="pincode"
                        placeholder="Enter pincode"
                        value={formData.pincode}
                        onChange={handleChange}
                      />

                    </div>

                  </div>

                </div>

              </section>


              {/* ================= EMERGENCY CONTACT ================= */}

              <section className="form-section">

                <div className="section-title">
                  <span>🚨</span>
                  Emergency Contact
                </div>


                <div className="form-grid">

                  <div className="form-group">

                    <label>
                      Contact Name
                    </label>

                    <input
                      type="text"
                      name="emergencyName"
                      placeholder="Enter contact name"
                      value={formData.emergencyName}
                      onChange={handleChange}
                    />

                  </div>


                  <div className="form-group">

                    <label>
                      Relationship
                    </label>

                    <input
                      type="text"
                      name="emergencyRelation"
                      placeholder="Example: Father, Mother, Spouse"
                      value={formData.emergencyRelation}
                      onChange={handleChange}
                    />

                  </div>


                  <div className="form-group">

                    <label>
                      Contact Number
                    </label>

                    <div className="input-box">

                      <span>📞</span>

                      <input
                        type="tel"
                        name="emergencyPhone"
                        placeholder="Enter emergency number"
                        value={formData.emergencyPhone}
                        onChange={handleChange}
                      />

                    </div>

                  </div>

                </div>

              </section>


              {/* ================= ADDITIONAL INFORMATION ================= */}

              <section className="form-section">

                <div className="section-title">                  
                  <span>📄</span>
                  Additional Information
                </div>


                <div className="three-grid">

                  <div className="form-group">

                    <label>
                      Skills
                    </label>

                    <input
                      type="text"
                      name="skills"
                      placeholder="Design, Computer........"
                      value={formData.skills}
                      onChange={handleChange}
                    />

                  </div>

                </div>


                <div className="form-group">

                  <label>
                    Remarks
                  </label>

                  <textarea
                    name="remarks"
                    placeholder="Enter remarks"
                    value={formData.remarks}
                    onChange={handleChange}
                  />

                </div>

              </section>

         </div>


            {/* =================================================
                RIGHT SIDE
            ================================================= */}

            <div className="form-right">


              {/* ================= PHOTO ================= */}

              <div className="photo-box">

                <div className="photo-placeholder">
                  👤
                </div>


                <label className="upload-btn">

                  ⬆ Upload Photo

                  <input
                    type="file"
                    accept="image/*"
                    onChange={handlePhoto}
                  />

                </label>


                <small>
                  JPG, PNG (Max 2MB)
                </small>

              </div>


              {/* ================= SUMMARY ================= */}

              <div className="summary-box">

                <div className="summary-title">
                  ▣
                  <span>Staff Summary</span>
                </div>


                <div className="summary-row">
                  <span>Name</span>
                  <b>:</b>
                  <strong>
                    {formData.name || "-"}
                  </strong>
                </div>


                <div className="summary-row">
                  <span>Employee ID</span>
                  <b>:</b>
                  <strong>
                    {formData.employeeId || "-"}
                  </strong>
                  </div>


                  <div className="summary-row">
                  <span>Department</span>
                  <b>:</b>
                  <strong>
                    {formData.department || "-"}
                  </strong>
                  
                  </div>


                  <div className="summary-row">
                  <span>Joining Date</span>
                  <b>:</b>
                  <strong>
                    {formData.joiningDate || "-"}
                  </strong>
                  </div>


                  <div className="summary-row">
                  <span>Qualification</span>
                  <b>:</b>
                  <strong>
                    {formData.qualification || "-"}
                  </strong>
                  </div>


                  <div className="summary-row">
                  <span>Experience</span>
                  <b>:</b>
                  <strong>
                    {formData.experience || "-"}
                  </strong>
                  </div>


                  <div className="summary-row">
                  <span>Phone</span>
                  <b>:</b>
                  <strong>
                    {formData.phone || "-"}
                  </strong>
                  </div>


              {/* ================= NOTE ================= */}

                            <div className="note-box">

                <div className="note-icon">
                  i
                </div>

                <div>
                  <h4>Note:</h4>

                  <p>
                    This form can be used for both
                    adding new staff and editing
                    existing staff details.
                  </p>
                </div>

              </div>

            </div>

          </div>
          </div>


          {/* ================= FOOTER ================= */}

          <div className="form-footer">

            <button
              type="button"
              className="cancel-btn"
              onClick={() => navigate(`/staff/profile/${id}`, {
                state: { staff: formData },
              })}
            >
              Cancel
            </button>


            <button
              type="submit"
              className="save-btn"
            >
              💾 {mode === "add" ? "Save Staff" : "Update Staff"}
            </button>

          </div>
          

        </form>

       </div>

    </div>
  );
};


export default StaffUpdateForm;
