import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { studentAPI } from '../../services/api'
import toast from 'react-hot-toast'
import Navbar from '../../components/Navbar'
import Sidebar from '../../components/Sidebar'

const MyAppointments = () => {
  const [appointments, setAppointments] = useState([])
  const [loading, setLoading] = useState(true)
  const [progress, setProgress] = useState(0)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const navigate = useNavigate()

  useEffect(() => { fetchAppointments() }, [])

  const fetchAppointments = async () => {
    setProgress(10)
    const timer1 = setTimeout(() => setProgress(40), 200)
    const timer2 = setTimeout(() => setProgress(70), 500)
    try {
      const { data } = await studentAPI.getAppointments()
      setProgress(90)
      if (data.success) setAppointments(data.appointments)
    } catch (error) { toast.error('Failed to fetch appointments') }
    clearTimeout(timer1)
    clearTimeout(timer2)
    setProgress(100)
    setTimeout(() => setLoading(false), 300)
  }

  const handleCancel = async (id) => {
    if (!confirm('Are you sure you want to cancel this appointment?')) return
    try {
      const { data } = await studentAPI.cancelAppointment(id)
      if (data.success) { toast.success('Appointment cancelled'); fetchAppointments() }
      else toast.error(data.message)
    } catch (error) { toast.error('Failed to cancel appointment') }
  }

  const getStatusStyle = (status) => {
    switch (status) {
      case 'PENDING': return { background: '#fef3c7', color: '#92400e' }
      case 'APPROVED': return { background: '#dcfce7', color: 'var(--green-800)' }
      case 'DECLINED': return { background: '#fee2e2', color: '#991b1b' }
      default: return { background: 'var(--gray-100)', color: 'var(--gray-800)' }
    }
  }

  if (loading) return (
    <div className="min-h-screen bg-gradient-main">
      <Navbar onMenuToggle={() => setSidebarOpen(!sidebarOpen)} />
      <div className="page-layout">
        <Sidebar mobileOpen={sidebarOpen} onMobileClose={() => setSidebarOpen(false)} />
        <main className="page-main">
          <div style={{ maxWidth: '24rem', margin: '4rem auto', textAlign: 'center' }}>
            <p style={{ marginBottom: '1rem', fontWeight: 600, color: 'var(--gray-600)' }}>Loading appointments...</p>
            <div className="progress-bar-container">
              <div className="progress-bar-fill" style={{ width: `${progress}%` }} />
            </div>
            <p className="progress-text">{progress}%</p>
          </div>
        </main>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gradient-main mobile-overflow-fix">
      <Navbar onMenuToggle={() => setSidebarOpen(!sidebarOpen)} />
      <div className="page-layout">
        <Sidebar mobileOpen={sidebarOpen} onMobileClose={() => setSidebarOpen(false)} />
        <main className="page-main">
          <button onClick={() => navigate(-1)} className="back-btn">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
            Back
          </button>
          <h1 style={{ fontSize: '1.875rem', fontWeight: 700, marginBottom: '2rem' }}>My Appointments</h1>
          {appointments.length > 0 ? (
            <div className="space-y-4">
              {appointments.map((apt) => (
                <div key={apt._id} className="card">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '0.5rem' }}>{apt.lecturerId?.name}</h3>
                      <p style={{ color: 'var(--gray-600)', marginBottom: '0.25rem' }}>📅 {new Date(apt.date).toLocaleString()}</p>
                      <p style={{ color: 'var(--gray-600)', marginBottom: '0.25rem' }}>
                        {apt.meetingType === 'online' ? '💻 Online Meeting' : '🏢 In-Person Meeting'}
                      </p>
                      {apt.meetingType === 'online' && apt.zoomLink && apt.status === 'APPROVED' && (
                        <p style={{ color: 'var(--blue-600)', marginBottom: '0.25rem' }}>
                          🔗 <a href={apt.zoomLink} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'underline' }}>Join Zoom Meeting</a>
                        </p>
                      )}
                      <p style={{ color: 'var(--gray-600)', marginBottom: '0.5rem' }}>📝 {apt.topic || 'No topic specified'}</p>
                      <span className="badge" style={getStatusStyle(apt.status)}>{apt.status}</span>
                    </div>
                    {apt.status === 'PENDING' && (
                      <button onClick={() => handleCancel(apt._id)} style={{ color: 'var(--red-600)', fontWeight: 500, fontSize: '0.875rem' }}>Cancel</button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="card" style={{ textAlign: 'center', padding: '3rem 1.5rem' }}>
              <p style={{ color: 'var(--gray-500)', marginBottom: '1rem' }}>No appointments yet</p>
              <a href="/student/lecturers" className="btn btn-primary">Browse Lecturers</a>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}

export default MyAppointments
