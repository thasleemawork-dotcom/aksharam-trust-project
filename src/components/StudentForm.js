import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./StudentForm.css";

const StudentForm = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Student data received from ViewStudents when editing
  const student = location.state?.student;

  // Add or Edit mode
  const isEdit = Boolean(student);
  
  const [formData, setFormData] = useState({
    name: student?.name || "",
    age: student?.age || "",
    dob: student?.dob || "",
    gender: student?.gender || "",
    projectArea: student?.projectArea || "",
    phone: student?.phone || "",

    category: student?.category || "",
    classCourse: student?.classCourse || "",
    institution: student?.institution || "",
    performance: student?.performance || "",

    address: student?.address || "",
    city: student?.city || "",
    pincode: student?.pincode || "",

    fatherName: student?.fatherName || "",
    motherName: student?.motherName || "",
    fatherOccupation: student?.fatherOccupation || "",
    motherOccupation: student?.motherOccupation || "",
    fatherQualification: student?.fatherQualification || "",
    motherQualification: student?.motherQualification || "",

    ambition: student?.ambition || "",
    healthIssues: student?.healthIssues || "",
    hobbies: student?.hobbies || "",
    skills: student?.skills || "",
    remarks: student?.remarks || "",

    photo: student?.photo || null,
  });

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

      console.log(formData);

      if (isEdit) {
        alert("Student updated successfully!");
      } else {
        alert("Student added successfully!");
      }

      navigate("/staff/students/manage");
  }; 
  
  
  return (
    <div className="student-page">

      <div className="student-form">

        {/* ================= HEADER ================= */}

        <div className="student-header">
          <div className="student-title">
            <span className="graduation-icon">🎓</span>

            <div>
              <h2>{isEdit ? "Edit Student" : "Add Student"}</h2>

              <p>
                {isEdit
                  ? "Update student information"
                  : "Create a new student record"}
              </p>       
            </div>
          </div>

          <button
            type="button"
            className="close-btn"
            onClick={() => navigate("/staff/students/manage")}
          >
            ×
          </button>
        </div>

        {/* ================= ADD / EDIT ================= */}

        <form onSubmit={handleSubmit}>

          <div className="form-layout">

            {/* ==================================================
                LEFT SIDE
            ================================================== */}

            <div className="form-left">

              {/* ================= PERSONAL DETAILS ================= */}

              <section className="form-section">

                <div className="section-title">
                  <span>👤</span>
                   Personal Details
                </div>

                <div className="form-grid">

                  <div className="form-group">
                    <label>Full Name <b>*</b></label>

                    <div className="input-box">
                      <span>👤</span>

                      <input
                        type="text"
                        name="name"
                        placeholder="Enter student name"
                        value={formData.name}
                        onChange={handleChange}
                      />
                    </div>
                  </div>


                  <div className="form-group">
                    <label>Age <b>*</b></label>

                    <div className="input-box">
                      <span>📅</span>

                      <input
                        type="number"
                        name="age"
                        placeholder="Enter age"
                        value={formData.age}
                        onChange={handleChange}
                      />
                    </div>
                  </div>


                  <div className="form-group">
                    <label>DoB <b>*</b></label>

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
                    <label>Gender <b>*</b></label>

                    <select
                      name="gender"
                      value={formData.gender}
                      onChange={handleChange}
                    >
                      <option value="">Select Gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>


                  <div className="form-group">
                    <label>Phone Number</label>

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
                   <label>Project Area / Locality<b>*</b></label>
                        <input
                            type="text"
                            name="projectArea"
                            value={formData.projectArea}
                            onChange={handleChange}
                            placeholder="Enter project area"
                        />
                        </div>


                </div>

              </section>


              {/* ================= ACADEMIC DETAILS ================= */}

              <section className="form-section">

                <div className="section-title">
                  <span>📖</span>
                    Academic Details
                </div>

                <div className="form-grid">

                  <div className="form-group">
                    <label>Category <b>*</b></label>

                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                    >
                      <option value="">Select Category</option>
                      <option value="LP">LP - Lower Primary</option>
                      <option value="UP">UP - Upper Primary</option>
                      <option value="HS">HS - High School</option>
                      <option value="HSS">HSS - Higher Secondary</option>
                      <option value="VHSE">
                        VHSE - Vocational Higher Secondary
                      </option>
                      <option value="UG">UG - Undergraduate</option>
                      <option value="PG">PG - Postgraduate</option>
                    </select>
                  </div>


                  <div className="form-group">
                    <label>Class / Course <b>*</b></label>

                    <select
                      name="classCourse"
                      value={formData.classCourse}
                      onChange={handleChange}
                    >
                      <option value="">Select Class / Course</option>

                      <option value="1">Class 1</option>
                      <option value="2">Class 2</option>
                      <option value="3">Class 3</option>
                      <option value="4">Class 4</option>
                      <option value="5">Class 5</option>
                      <option value="6">Class 6</option>
                      <option value="7">Class 7</option>
                      <option value="8">Class 8</option>
                      <option value="9">Class 9</option>
                      <option value="10">Class 10</option>
                      <option value="11">Plus One</option>
                      <option value="12">Plus Two</option>

                      <option value="UG">UG</option>
                      <option value="PG">PG</option>
                    </select>
                  </div>


                  <div className="form-group">
                    <label>School / College / Institution <b>*</b></label>
                    <div className="input-box">
                      <span>🏫</span>

                      <input
                        type="text"
                        name="institution"
                        placeholder="Enter school/college name"
                        value={formData.institution}
                        onChange={handleChange}
                      />
                    </div>
                  </div>


                  <div className="form-group">
                    <label>Academic Performance <b>*</b></label>

                    <select
                      name="performance"
                      value={formData.performance}
                      onChange={handleChange}
                    >
                      <option value="">Select Performance</option>
                      <option value="Excellent">Excellent</option>
                      <option value="Very Good">Very Good</option>
                      <option value="Good">Good</option>
                      <option value="Average">Average</option>
                      <option value="Needs Improvement"> Needs Improvement </option>
                      <option value="Needs Improvement"> Needs Special Care </option>

                    </select>
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
                   
                  <label>Address</label>

                  <textarea
                    name="address"
                    placeholder="Enter address"
                    value={formData.address}
                    onChange={handleChange}
                  />

                </div>


                <div className="form-grid">

                  <div className="form-group">

                    <label>City</label>

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

                    <label>Pincode</label>

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


              {/* ================= PARENT DETAILS ================= */}

              <section className="form-section">

                <div className="section-title">
                  <span>👥</span>
                  Parent Details
                </div>


                <div className="form-grid">

                  <div className="form-group">
                    <label>Father's Name</label>

                    <input
                      type="text"
                      name="fatherName"
                      placeholder="Enter father's name"
                      value={formData.fatherName}
                      onChange={handleChange}
                    />
                  </div>


                  <div className="form-group">
                    <label>Mother's Name</label>

                    <input
                      type="text"
                      name="motherName"
                      placeholder="Enter mother's name"
                      value={formData.motherName}
                      onChange={handleChange}
                    />
                  </div>


                  <div className="form-group">
                    <label>Father's Occupation</label>

                    <input
                      type="text"
                      name="fatherOccupation"
                      placeholder="Enter occupation"
                      value={formData.fatherOccupation}
                      onChange={handleChange}
                    />
                  </div>


                  <div className="form-group">
                    <label>Mother's Occupation</label>

                    <input
                      type="text"
                      name="motherOccupation"
                      placeholder="Enter occupation"
                      value={formData.motherOccupation}
                      onChange={handleChange}
                    />
                  </div>


                  <div className="form-group">
                    <label>Father's Qualification</label>

                    <input
                      type="text"
                      name="fatherQualification"
                      placeholder="Enter qualification"
                      value={formData.fatherQualification}
                      onChange={handleChange}
                    />
                  </div>


                  <div className="form-group">
                    <label>Mother's Qualification</label>

                    <input
                      type="text"
                      name="motherQualification"
                      placeholder="Enter qualification"
                      value={formData.motherQualification}
                      onChange={handleChange}
                    />
                  </div>

                </div>

              </section>


              {/* ================= ADDITIONAL ================= */}

              <section className="form-section">

                <div className="section-title">
                  <span>📄</span>
                  Additional Information
                </div>


                <div className="three-grid">

                  <div className="form-group">

                    <label>Ambition / Future Goal</label>

                    <input
                      type="text"
                      name="ambition"
                      placeholder="Enter ambition"
                      value={formData.ambition}
                      onChange={handleChange}
                    />

                  </div>


                  <div className="form-group">

                    <label>Health Issues (if any)</label>

                    <input
                      type="text"
                      name="healthIssues"
                      placeholder="Enter health issues"
                      value={formData.healthIssues}
                      onChange={handleChange}
                    />

                  </div>


                  <div className="form-group">

                    <label>Hobbies</label>

                    <input
                      type="text"
                      name="hobbies"
                      placeholder="Enter hobbies"
                      value={formData.hobbies}
                      onChange={handleChange}
                    />

                  </div>

                </div>


                <div className="form-group">

                  <label>Skills</label>

                  <input
                    type="text"
                    name="skills"
                    placeholder="Enter skills"
                    value={formData.skills}
                    onChange={handleChange}
                  />

                </div>

        
                <div className="form-group">

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


            {/* ==================================================
                RIGHT SIDE
            ================================================== */}

            <div className="form-right">

              {/* PHOTO */}

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

                <small>JPG, PNG (Max 2MB)</small>

              </div>


              {/* SUMMARY */}

              <div className="summary-box">

                <div className="summary-title">
                  ▣
                  <span>Student Summary</span>
                </div>

                <div className="summary-row">
                  <span>Name</span>
                  <b>:</b>
                  <strong>{formData.name || "-"}</strong>
                </div>

                <div className="summary-row">
                  <span>Category</span>
                  <b>:</b>
                  <strong>{formData.category || "-"}</strong>
                </div>

                <div className="summary-row">
                  <span>Class</span>
                  <b>:</b>
                  <strong>{formData.classCourse || "-"}</strong>
                </div>

                <div className="summary-row">
                  <span>School/College</span>
                  <b>:</b>
                  <strong>{formData.institution || "-"}</strong>
                </div>

                <div className="summary-row">
                  <span>Age</span>
                  <b>:</b>
                  <strong>{formData.age || "-"}</strong>
                </div>

                <div className="summary-row">
                  <span>Performance</span>
                  <b>:</b>
                  <strong>{formData.performance || "-"}</strong>
                </div>

                <div className="summary-row">
                  <span>DoB</span>
                  <b>:</b>
                  <strong>{formData.dob || "-"}</strong>
                </div>

                <div className="summary-row">
                  <span>Gender</span>
                  <b>:</b>
                  <strong>{formData.gender || "-"}</strong>
                </div>

              </div>


              {/* NOTE */}

              <div className="note-box">

                <div className="note-icon">
                  i
                </div>

                <div>
                  <h4>Note:</h4>

                  <p>
                    This form can be used for both
                    adding new students and editing
                    existing student details.
                  </p>
                </div>

              </div>

            </div>

          </div>


          {/* ================= FOOTER ================= */}

          <div className="form-footer">

             
                    <button
                      type="button"
                      className="cancel-btn"
                      onClick={() => navigate("/staff/students/manage")}
                    >
                      Cancel
                    </button>

                    <button type="submit" className="save-btn">
                      💾 {isEdit ? "Update Student" : "Save Student"}
                    </button>

                  </div>
              
        

        </form>

      </div>

    </div>
  );
};


export default StudentForm;