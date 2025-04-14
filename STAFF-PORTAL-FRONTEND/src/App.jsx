import { Suspense, lazy } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import { NavigationProvider } from "./contexts/NavigationContext";
import { ThemeProvider } from "./contexts/ThemeContext";
import { UserProvider } from "./contexts/UserContext";
import { PhotoProvider } from "./contexts/PhotoContext";

import Layout from "./components/layout/Layout";
import LoginPage from "./pages/Auth/LoginPage";
import SignupPage from "./pages/Auth/SignupPage";
import Dashboard from "./pages/Dashboard";
import Attendance from "./features/classes/Attendance";
import AttendanceReport from "./features/classes/AttendanceReport";
import InternalMarks from "./features/classes/InternalMarks";
import SeriesMarks from "./features/classes/SeriesMarks";
import StudentPage from "./features/classes/StudentPage";

// ✅ Protected Route wrapper
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  return token ? children : <Navigate to="/login" />;
};

// ✅ Layout-wrapped protected route
const ProtectedLayoutRoute = ({ children }) => (
  <ProtectedRoute>
    <Layout>{children}</Layout>
  </ProtectedRoute>
);

// ✅ App route definitions
function AppContent() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />

      <Route
        path="/dashboard"
        element={
          <ProtectedLayoutRoute>
            <Dashboard />
          </ProtectedLayoutRoute>
        }
      />

      <Route
        path="/attendance/:classId"
        element={
          <ProtectedLayoutRoute>
            <Attendance />
          </ProtectedLayoutRoute>
        }
      />

      <Route
        path="/attendance-report/:classId"
        element={
          <ProtectedLayoutRoute>
            <AttendanceReport />
          </ProtectedLayoutRoute>
        }
      />

      <Route
        path="/internalmarks/:classId"
        element={
          <ProtectedLayoutRoute>
            <InternalMarks />
          </ProtectedLayoutRoute>
        }
      />

      <Route
        path="/seriesmarks/:classId"
        element={
          <ProtectedLayoutRoute>
            <SeriesMarks />
          </ProtectedLayoutRoute>
        }
      />

      <Route
        path="/students/:classId"
        element={
          <ProtectedLayoutRoute>
            <StudentPage />
          </ProtectedLayoutRoute>
        }
      />

      {/* Default redirect to login */}
      <Route path="/" element={<Navigate to="/login" />} />
      {/* Catch-all for unknown routes */}
      <Route path="*" element={<Navigate to="/login" />} />
    </Routes>
  );
}

// ✅ App wrapper
export default function App() {
  return (
    <Router>
      <ThemeProvider>
        <UserProvider>
          <PhotoProvider>
            <NavigationProvider>
              <Suspense fallback={<div>Loading...</div>}>
                <AppContent />
              </Suspense>
            </NavigationProvider>
          </PhotoProvider>
        </UserProvider>
      </ThemeProvider>
    </Router>
  );
}
