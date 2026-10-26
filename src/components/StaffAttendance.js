import React, { useState } from "react";
import "./StaffAttendance.css";

const StaffAttendance = () => {
  const [attendance, setAttendance] = useState({
    date: "",
    staffName: "",
    checkIn: "",
    checkOut: "",
    remarks: "",
  });

  const handleChange = (e) => {
    setAttendance({
      ...attendance,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    console.log("Attendance:", attendance);

    alert("Attendance saved successfully!");

    setAttendance({
      date: "",
      staffName: "",
      checkIn: "",
      checkOut: "",
      remarks: "",
    });
  };

  return (
    <div className="attendance-page">

      <div className="attendance-card">

        {/* Header */}
        <div className="attendance-header">
          <div>
            <h1>Staff Attendance</h1>
            <p>Record staff daily attendance</p>
          </div>

          <div className="attendance-icon">
            ✓
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>

          <div className="attendance-form">

            {/* Date */}
            <div className="attendance-field">
              <label>Date</label>

              <input
                type="date"
                name="date"
                value={attendance.date}
                onChange={handleChange}
                required
              />
            </div>

            {/* Staff Name */}
            <div className="attendance-field">
              <label>Staff Name</label>

              <input
                type="text"
                name="staffName"
                value={attendance.staffName}
                onChange={handleChange}
                placeholder="Enter staff name"
                required
              />
            </div>

            {/* Check In */}
            <div className="attendance-field">
              <label>Check In Time</label>

              <input
                type="time"
                name="checkIn"
                value={attendance.checkIn}
                onChange={handleChange}
                required
              />
            </div>

            {/* Check Out */}
            <div className="attendance-field">
              <label>Check Out Time</label>

              <input
                type="time"
                name="checkOut"
                value={attendance.checkOut}
                onChange={handleChange}
              />
            </div>

            {/* Remarks */}
            <div className="attendance-field full-width">
              <label>Remarks</label>

              <textarea
                name="remarks"
                value={attendance.remarks}
                onChange={handleChange}
                placeholder="Enter remarks..."
                rows="4"
              ></textarea>
            </div>

          </div>

          {/* Buttons */}
          <div className="attendance-footer">

            <button
              type="button"
              className="attendance-cancel"
              onClick={() =>
                setAttendance({
                  date: "",
                  staffName: "",
                  checkIn: "",
                  checkOut: "",
                  remarks: "",
                })
              }
            >
              Clear
            </button>

            <button
              type="submit"
              className="attendance-save"
            >
              Save Attendance
            </button>

          </div>

        </form>

      </div>

    </div>
  );
};

export default StaffAttendance;