import { Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import VerifyEmail from './pages/VerifyEmail'
import ForgotPassword from './pages/ForgotPassword'
import ResetPassword from './pages/ResetPassword'
import ChangePassword from './pages/ChangePassword'
import StudentDashboard from './pages/student/Dashboard'
import BrowseLecturers from './pages/student/BrowseLecturers'
import MyAppointments from './pages/student/MyAppointments'
import StudentProfile from './pages/student/Profile'
import LecturerDashboard from './pages/lecturer/Dashboard'
import LecturerAppointments from './pages/lecturer/Appointments'
import LecturerSchedule from './pages/lecturer/Schedule'
import LecturerProfile from './pages/lecturer/Profile'
import ProtectedRoute from './components/ProtectedRoute'

function App() {
  return (
    <>
      <Toaster position="top-right" />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/verify-email" element={<VerifyEmail />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        
        {/* Student Routes */}
        <Route path="/student/dashboard" element={<ProtectedRoute role="STUDENT"><StudentDashboard /></ProtectedRoute>} />
        <Route path="/student/lecturers" element={<ProtectedRoute role="STUDENT"><BrowseLecturers /></ProtectedRoute>} />
        <Route path="/student/appointments" element={<ProtectedRoute role="STUDENT"><MyAppointments /></ProtectedRoute>} />
        <Route path="/student/profile" element={<ProtectedRoute role="STUDENT"><StudentProfile /></ProtectedRoute>} />
        <Route path="/student/change-password" element={<ProtectedRoute role="STUDENT"><ChangePassword /></ProtectedRoute>} />
        
        {/* Lecturer Routes */}
        <Route path="/lecturer/dashboard" element={<ProtectedRoute role="LECTURER"><LecturerDashboard /></ProtectedRoute>} />
        <Route path="/lecturer/appointments" element={<ProtectedRoute role="LECTURER"><LecturerAppointments /></ProtectedRoute>} />
        <Route path="/lecturer/schedule" element={<ProtectedRoute role="LECTURER"><LecturerSchedule /></ProtectedRoute>} />
        <Route path="/lecturer/profile" element={<ProtectedRoute role="LECTURER"><LecturerProfile /></ProtectedRoute>} />
        <Route path="/lecturer/change-password" element={<ProtectedRoute role="LECTURER"><ChangePassword /></ProtectedRoute>} />
      </Routes>
    </>
  )
}

export default App
