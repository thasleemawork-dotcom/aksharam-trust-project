import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./StaffDiary.css";

const StaffDiary = () => {

  const navigate = useNavigate();
  

  // Get logged-in staff details
  // Change "loggedInStaff" if you are using another localStorage key
  const loggedInStaff =
    JSON.parse(localStorage.getItem("loggedInStaff")) || {};

  // Automatically get current date
  const today = new Date();

  const formattedDate = today.toISOString().split("T")[0];

  // Automatically get current day
  const dayName = today.toLocaleDateString("en-US", {
    weekday: "short",
  });

  const [tasks, setTasks] = useState(
    Array.from({ length: 10 }, (_, index) => ({
      id: index + 1,
      task: "",
      status: "Not Started",
      remarks: "",
    }))
  );

  // Handle task / status / remarks changes
  const handleChange = (id, field, value) => {
    setTasks((prevTasks) =>
      prevTasks.map((item) =>
        item.id === id
          ? { ...item, [field]: value }
          : item
      )
    );
  };

  // Save diary
const handleSave = () => {
  // Only keep rows where Task / Activity is entered
  const filledTasks = tasks.filter(
    (item) => item.task.trim() !== ""
  );

  // Don't save if no task was entered
  if (filledTasks.length === 0) {
    alert("Please enter at least one task.");
    return;
  }

  const diaryData = {
        staffId: loggedInStaff.id || "",
        staffName:
        loggedInStaff.name ||
        loggedInStaff.fullName ||
        "",
        department:
        loggedInStaff.department ||
        "",
        date: formattedDate,
        day: dayName,

        // Only entered tasks are saved
        tasks: filledTasks,
    };

    console.log("Staff Diary:", diaryData);

    localStorage.setItem(
        "staffDiary",
        JSON.stringify(diaryData)
    );

    alert(
        `${filledTasks.length} task${
        filledTasks.length > 1 ? "s" : ""
        } saved successfully!`
    );

     navigate("/staff-diary/manage")

    };


  return (
    <div className="staff-diary-page">
      <div className="staff-diary-form">

      {/* HEADER */}
      <div className="diary-header">

        <div className="header-left">
          <div className="diary-icon">📋</div>

          <div>
            <h1>Staff To-Do / Diary</h1>
          </div>
        </div>

        <div className="header-right">
          <button
            type="button"
            className="close-btn"
            onClick={() => navigate("/staff-diary/manage")}
          >
            ×
          </button>
        </div>

      </div>

      {/* STAFF INFORMATION */}
      <div className="staff-info">

        {/* NAME */}
        <div className="info-box">
          <label>
            <span className="info-icon">♙</span>
            Name
          </label>

          <input
            type="text"
            value={
              loggedInStaff.name ||
              loggedInStaff.fullName ||
              ""
            }
            readOnly
            placeholder="Staff name"
          />
        </div>

        {/* DEPARTMENT */}
        <div className="info-box">
          <label>
            <span className="info-icon">▥</span>
            Department
          </label>

          <input
            type="text"
            value={loggedInStaff.department || ""}
            readOnly
            placeholder="Department"
          />
        </div>

        {/* DATE */}
        <div className="info-box">
          <label>
            <span className="info-icon">▣</span>
            Date
          </label>

          <input
            type="date"
            value={formattedDate}
            readOnly
          />
        </div>

        {/* DAY */}
        <div className="info-box day-box">
          <label>
            <span className="info-icon">▣</span>
            Day
          </label>

          <div className="day-buttons">

            {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map(
              (day) => (
                <button
                  key={day}
                  type="button"
                  className={day === dayName ? "active-day" : ""}
                  disabled
                >
                  {day}
                </button>
              )
            )}

          </div>
        </div>

      </div>

      {/* TASK TABLE */}
      <div className="diary-table-container">

        <table className="diary-table">

          <thead>
            <tr>
              <th className="number-column">#</th>

              <th className="task-column">
                Task / Activity
              </th>

              <th className="status-column">
                Status
              </th>

              <th className="remarks-column">
                Remarks
              </th>
            </tr>
          </thead>

          <tbody>

            {tasks.map((item) => (
              <tr key={item.id}>

                {/* NUMBER */}
                <td className="task-number">
                  {item.id}
                </td>

                {/* TASK */}
                <td>
                  <input
                    type="text"
                    value={item.task}
                    onChange={(e) =>
                      handleChange(
                        item.id,
                        "task",
                        e.target.value
                      )
                    }
                    placeholder="Enter task or activity..."
                  />
                </td>

                {/* STATUS */}
                <td>

                  <div className="status-options">

                    <label>
                      <input
                        type="radio"
                        name={`status-${item.id}`}
                        value="Not Started"
                        checked={
                          item.status === "Not Started"
                        }
                        onChange={(e) =>
                          handleChange(
                            item.id,
                            "status",
                            e.target.value
                          )
                        }
                      />
                      <span>Not Started</span>
                    </label>

                    <label>
                      <input
                        type="radio"
                        name={`status-${item.id}`}
                        value="In Progress"
                        checked={
                          item.status === "In Progress"
                        }
                        onChange={(e) =>
                          handleChange(
                            item.id,
                            "status",
                            e.target.value
                          )
                        }
                      />
                      <span>In Progress</span>
                    </label>

                    <label>
                      <input
                        type="radio"
                        name={`status-${item.id}`}
                        value="Done"
                        checked={
                          item.status === "Done"
                        }
                        onChange={(e) =>
                          handleChange(
                            item.id,
                            "status",
                            e.target.value
                          )
                        }
                      />
                      <span>Done</span>
                    </label>

                  </div>

                </td>

                {/* REMARKS */}
                <td>
                  <input
                    type="text"
                    value={item.remarks}
                    onChange={(e) =>
                      handleChange(
                        item.id,
                        "remarks",
                        e.target.value
                      )
                    }
                    placeholder="Add remarks..."
                  />
                </td>

              </tr>
            ))}

          </tbody>

        </table>

      </div>

               {/* ================= FOOTER ================= */}

          <div className="form-footer">
            <button
              type="button"
              className="cancel-btn"
              onClick={() => navigate("/staff-diary/manage")}
            >
              Cancel
            </button>

            <button
             type="submit"
             className="save-btn"
             onClick={handleSave}
             >
              💾 Save
            </button>
          </div>
              
      </div>

    </div>
  );
};

export default StaffDiary;