import React from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

// Login and Dashboards
import Login from "./components/Login";
import AdminDashboard from "./components/AdminDashboard";
import StaffDashboard from "./components/StaffDashboard";

// Student
import StudentForm from "./components/StudentForm";
import ViewStudents from "./components/ViewStudents";
import StudentProfile from "./components/StudentProfile";

// Staff
import StaffUpdateForm from "./components/StaffUpdateForm";
import AdminAddEditStaff from "./components/AdminAddEditStaff";
import ViewStaff from "./components/ViewStaff";
import StaffProfile from "./components/StaffProfile";

// Staff Diary
import StaffDiary from "./components/StaffDiary";
import ViewStaffDiary from "./components/ViewStaffDiary";

// Events
import EventDetails from "./components/EventDetails";
import ViewEvents from "./components/ViewEvents";

// Staff Work
import AssignStaffWork from "./components/AssignStaffWork";
import ViewAssignStaffWork from "./components/ViewAssignStaffWork";

// Meetings
import MeetingMinutes from "./components/MeetingMinutes";
import ViewMeetingMinutes from "./components/ViewMeetingMinutes";

// Documents
import ViewDocument from "./components/ViewDocuments";
import Document from "./components/Document";

// Donations
import ViewDonations from "./components/ViewDonations";
import DonationForm from "./components/DonationForm";

// Reports
import ReportForm from "./components/ReportForm";
import ViewReport from "./components/ViewReport";

// Accounts
import Accounts from "./components/Accounts";

// Attendance
import ViewStaffAttendance from "./components/ViewStaffAttendance";
import StaffAttendance from "./components/StaffAttendance";


// ============================================
// PROTECT ROUTES USING LOCAL STORAGE
// ============================================

const ProtectedRoute = ({ children, allowedRoles }) => {
  const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
  const userRole = localStorage.getItem("userRole");

  // If the user is not logged in, return to login
  if (!isLoggedIn || !userRole) {
    return <Navigate to="/login" replace />;
  }

  // If the user does not have permission, redirect
  if (allowedRoles && !allowedRoles.includes(userRole)) {
    if (userRole === "admin") {
      return <Navigate to="/admin/dashboard" replace />;
    }

    if (userRole === "staff") {
      return <Navigate to="/staff/dashboard" replace />;
    }

    return <Navigate to="/login" replace />;
  }

  return children;
};


// ============================================
// APP
// ============================================

function App() {
  const currentRole = localStorage.getItem("userRole") || "staff";

  // Helper for protected routes
  const protect = (element, roles = ["admin", "staff"]) => (
    <ProtectedRoute allowedRoles={roles}>
      {element}
    </ProtectedRoute>
  );

  return (
    <BrowserRouter>
      <Routes>

        {/* ====================================
            LOGIN
        ==================================== */}

        <Route
          path="/"
          element={<Navigate to="/login" replace />}
        />

        <Route
          path="/login"
          element={<Login />}
        />


        {/* ====================================
            ADMIN DASHBOARD
        ==================================== */}

        <Route
          path="/admin/dashboard"
          element={protect(<AdminDashboard />, ["admin"])}
        />


        {/* ====================================
            ADMIN STAFF
        ==================================== */}

        <Route
          path="/admin/add-staff"
          element={protect(<AdminAddEditStaff />, ["admin"])}
        />

        <Route
          path="/admin/staff/manage"
          element={protect(<ViewStaff role="admin" />, ["admin"])}
        />

        <Route
          path="/admin/edit-staff"
          element={protect(<AdminAddEditStaff />, ["admin"])}
        />

        <Route
          path="/staff/profile/:id"
          element={protect(<StaffProfile />)}
        />

        <Route
          path="/staff/profile-edit/:id"
          element={protect(<StaffUpdateForm />)}
        />


        {/* ====================================
            ADMIN STUDENTS
        ==================================== */}

        <Route
          path="/admin/students/manage"
          element={protect(<ViewStudents role="admin" />, ["admin"])}
        />

        <Route
          path="/students/profile/:id"
          element={protect(<StudentProfile />)}
        />


        {/* ====================================
            ADMIN STAFF WORK
        ==================================== */}

        <Route
          path="/staff-assignwork/add"
          element={protect(<AssignStaffWork role="admin" />, ["admin"])}
        />

        <Route
          path="/staff-assignwork/manage"
          element={protect(
            <ViewAssignStaffWork role={currentRole} />
          )}
        />

        <Route
          path="/staff-assignwork/edit/:id"
          element={protect(<AssignStaffWork role="admin" />, ["admin"])}
        />


        {/* ====================================
            STAFF DASHBOARD
        ==================================== */}

        <Route
          path="/staff/dashboard"
          element={protect(<StaffDashboard />, ["staff"])}
        />


        {/* ====================================
            STAFF STUDENTS
        ==================================== */}

        <Route
          path="/staff/students/manage"
          element={protect(<ViewStudents role="staff" />, ["staff"])}
        />

        <Route
          path="/students/add"
          element={protect(<StudentForm />, ["staff"])}
        />

        <Route
          path="/students/edit/:id"
          element={protect(<StudentForm />, ["staff"])}
        />


        {/* ====================================
            STAFF MANAGEMENT
        ==================================== */}

        <Route
          path="/staff/add"
          element={protect(<StaffUpdateForm />, ["staff"])}
        />

        <Route
          path="/staff/staff/manage"
          element={protect(<ViewStaff role="staff" />, ["staff"])}
        />

        <Route
          path="/staff/edit/:id"
          element={protect(<StaffUpdateForm />, ["staff"])}
        />


        {/* ====================================
            STAFF DIARY
        ==================================== */}

        <Route
          path="/staff/staffdiary/add"
          element={protect(<StaffDiary />, ["staff"])}
        />

        <Route
          path="/staff-diary/manage"
          element={protect(<ViewStaffDiary />, ["staff"])}
        />


        {/* ====================================
            EVENTS
        ==================================== */}

        <Route
          path="/events/add"
          element={protect(<EventDetails />)}
        />

        <Route
          path="/events/edit/:id"
          element={protect(<EventDetails />)}
        />

        <Route
          path="/admin/events/manage"
          element={protect(<ViewEvents role="admin" />, ["admin"])}
        />

        <Route
          path="/staff/events/manage"
          element={protect(<ViewEvents role="staff" />, ["staff"])}
        />


        {/* ====================================
            MEETINGS
        ==================================== */}

        <Route
          path="/meetings/add"
          element={protect(<MeetingMinutes />, ["staff"])}
        />

        <Route
          path="/meetings/edit/:id"
          element={protect(<MeetingMinutes />)}
        />

        <Route
          path="/admin/meetings/manage"
          element={protect(<ViewMeetingMinutes role="admin" />, ["admin"])}
        />

        <Route
          path="/staff/meetings/manage"
          element={protect(<ViewMeetingMinutes role="staff" />, ["staff"])}
        />


        {/* ====================================
            DOCUMENTS
        ==================================== */}

        <Route
          path="/admin/documents/manage"
          element={protect(<ViewDocument role="admin" />, ["admin"])}
        />

        <Route
          path="/staff/documents/manage"
          element={protect(<ViewDocument role="staff" />, ["staff"])}
        />

        <Route
          path="/documents/upload"
          element={protect(<Document />, ["staff"])}
        />


        {/* ====================================
            DONATIONS
        ==================================== */}

        <Route
          path="/donations/add"
          element={protect(<DonationForm role="staff" />, ["staff"])}
        />

        <Route
          path="/admin/donations/manage"
          element={protect(<ViewDonations role="admin" />, ["admin"])}
        />

        <Route
          path="/staff/donations/manage"
          element={protect(<ViewDonations role="staff" />, ["staff"])}
        />


        {/* ====================================
            REPORTS
        ==================================== */}

        <Route
          path="/reports/student-project"
          element={protect(<ReportForm />, ["staff"])}
        />

        <Route
          path="/staff/reports/manage"
          element={protect(<ViewReport role="staff" />, ["staff"])}
        />


        {/* ====================================
            ACCOUNTS
        ==================================== */}

        <Route
          path="/accounts"
          element={protect(<Accounts role={currentRole} />)}
        />


        {/* ====================================
            STAFF ATTENDANCE
        ==================================== */}

        <Route
          path="/staff-attendance/manage"
          element={protect(
            <ViewStaffAttendance role={currentRole} />
          )}
        />

        <Route
          path="/staff/add-attendance"
          element={protect(<StaffAttendance />, ["staff"])}
        />


        {/* ====================================
            PAGE NOT FOUND
        ==================================== */}

        <Route
          path="*"
          element={<Navigate to="/login" replace />}
        />

      </Routes>
    </BrowserRouter>
  );
}

export default App;