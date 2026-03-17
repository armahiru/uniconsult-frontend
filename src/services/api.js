import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
})

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.token = token
  }
  return config
})

// Add response interceptor for better error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', {
      url: error.config?.url,
      method: error.config?.method,
      status: error.response?.status,
      data: error.response?.data,
      message: error.message
    });
    return Promise.reject(error);
  }
)

// Auth APIs
export const authAPI = {
  register: (data) => api.post('/api/auth/register', data),
  login: (data) => api.post('/api/auth/login', data),
  verifyEmail: (token) => api.post('/api/auth/verify-email', { token }),
  resendVerification: (email) => api.post('/api/auth/resend-verification', { email }),
  forgotPassword: (email) => api.post('/api/auth/forgot-password', { email }),
  resetPassword: (token, newPassword) => api.post('/api/auth/reset-password', { token, newPassword }),
  changePassword: (currentPassword, newPassword) => api.post('/api/auth/change-password', { currentPassword, newPassword })
}

// Student APIs
export const studentAPI = {
  getProfile: () => api.get('/api/student/get-profile'),
  updateProfile: (data) => api.post('/api/student/update-profile', data),
  bookAppointment: (data) => api.post('/api/student/book-appointment', data),
  getAppointments: () => api.get('/api/student/appointments'),
  cancelAppointment: (appointmentId) => api.post('/api/student/cancel-appointment', { appointmentId }),
  getDashboard: () => api.get('/api/dashboard/student')
}

// Lecturer APIs
export const lecturerAPI = {
  getAll: () => api.get('/api/lecturer/list'),
  getAvailability: (lecturerId) => api.get(`/api/lecturer/availability/${lecturerId}`),
  getProfile: () => api.get('/api/lecturer/profile'),
  updateProfile: (data) => api.post('/api/lecturer/update-profile', data),
  uploadPhoto: (formData) => api.post('/api/lecturer/upload-photo', formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
  getAppointments: () => api.get('/api/lecturer/appointments'),
  approveAppointment: (appointmentId) => api.post('/api/lecturer/approve-appointment', { appointmentId }),
  declineAppointment: (appointmentId) => api.post('/api/lecturer/decline-appointment', { appointmentId }),
  updateZoomLink: (appointmentId, zoomLink) => api.post('/api/lecturer/update-zoom-link', { appointmentId, zoomLink }),
  getDashboard: () => api.get('/api/dashboard/lecturer'),
  getSchedule: () => api.get('/api/schedule/lecturer')
}

// Notification APIs
export const notificationAPI = {
  getAll: () => api.get('/api/notifications'),
  markAsRead: (id) => api.put(`/api/notifications/${id}/read`)
}

export default api
