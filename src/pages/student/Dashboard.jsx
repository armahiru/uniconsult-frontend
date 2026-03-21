import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { studentAPI } from '../../services/api'
import { useAuth } from '../../context/AuthContext'
import Navbar from '../../components/Navbar'
import Sidebar from '../../components/Sidebar'

const Dashboard = () => {
  const { user } = useAuth()
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [progress, setProgress] = useState(0)
  const [sidebarOpen, setSidebarOpen] = useState(false)

  useEffect(() => { fetchDashboard() }, [])

  const fetchDashboard = async () => {
    setProgress(10)
    const timer1 = setTimeout(() => setProgress(40), 200)
    const timer2 = setTimeout(() => setProgress(70), 500)
    try {
      const { data } = await studentAPI.getDashboard()
      setProgress(90)
      if (data.success) setStats(data.dashData)
    } catch (error) {
      console.error('Failed to fetch dashboard', error)
    }
    clearTimeout(timer1)
    clearTimeout(timer2)
    setProgress(100)
    setTimeout(() => setLoading(false), 300)
  }

  const getNextApproved = () => {
    if (!stats?.latestAppointments) return null
    const now = new Date()
    return stats.latestAppointments.find(a => a.status === 'APPROVED' && new Date(a.date) >= now)
  }

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', background: '#f8fafc' }}>
        <Navbar onMenuToggle={() => setSidebarOpen(!sidebarOpen)} />
        <div style={{ display: 'flex' }}>
          <Sidebar mobileOpen={sidebarOpen} onMobileClose={() => setSidebarOpen(false)} />
          <main style={{ flex: 1, padding: '2rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ maxWidth: '24rem', width: '100%', textAlign: 'center' }}>
              <p style={{ marginBottom: '1rem', fontWeight: 600, color: '#6b7280' }}>Loading dashboard...</p>
              <div className="progress-bar-container">
                <div className="progress-bar-fill" style={{ width: `${progress}%` }} />
              </div>
              <p className="progress-text">{progress}%</p>
            </div>
          </main>
        </div>
      </div>
    )
  }

  const upcoming = getNextApproved()

  const statusStyle = (status) => {
    if (status === 'APPROVED') return { background: '#dcfce7', color: '#166534', border: '1px solid #bbf7d0' }
    if (status === 'PENDING') return { background: '#fef3c7', color: '#92400e', border: '1px solid #fde68a' }
    return { background: '#fee2e2', color: '#991b1b', border: '1px solid #fecaca' }
  }

  const avatarColors = ['#6366f1', '#2563eb', '#0891b2', '#059669', '#d97706', '#dc2626', '#7c3aed', '#db2777']
  const getAvatarColor = (name) => avatarColors[(name || '').charCodeAt(0) % avatarColors.length]

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc' }} className="mobile-overflow-fix">
      <Navbar onMenuToggle={() => setSidebarOpen(!sidebarOpen)} />
      <div style={{ display: 'flex' }}>
        <Sidebar mobileOpen={sidebarOpen} onMobileClose={() => setSidebarOpen(false)} />
        <main style={{ flex: 1, padding: '1.5rem', overflow: 'hidden' }}>
          <div style={{ maxWidth: '56rem' }}>
            {/* Welcome */}
            <div style={{ marginBottom: '1.5rem' }}>
              <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#111827' }}>
                Welcome back, <span style={{ color: '#2563eb' }}>{user?.name?.split(' ')[0] || 'Student'}</span> 👋
              </h1>
              <p style={{ color: '#6b7280', fontSize: '0.875rem', marginTop: '0.25rem' }}>Here is what is happening today.</p>
            </div>

            {/* Action Cards Row */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
              {/* Book Consultation */}
              <Link to="/student/lecturers" style={{ display: 'flex', alignItems: 'center', gap: '1rem', background: '#2563eb', color: '#fff', borderRadius: '1rem', padding: '1.25rem 1.5rem', textDecoration: 'none', transition: 'transform 0.2s, box-shadow 0.2s', boxShadow: '0 4px 12px rgba(37,99,235,0.3)' }}
                onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 20px rgba(37,99,235,0.4)' }}
                onMouseLeave={(e) => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 4px 12px rgba(37,99,235,0.3)' }}
              >
                <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                <span style={{ fontSize: '1rem', fontWeight: 700 }}>Book Consultation</span>
              </Link>

              {/* Upcoming Appointment */}
              <div style={{ background: '#fff', borderRadius: '1rem', padding: '1.25rem 1.5rem', border: '1px solid #e5e7eb' }}>
                <p style={{ fontSize: '0.75rem', color: '#6b7280', fontWeight: 500, marginBottom: '0.5rem' }}>Upcoming Appointments</p>
                {upcoming ? (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <svg width="20" height="20" fill="none" stroke="#6b7280" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                    <div>
                      <p style={{ fontWeight: 600, color: '#111827', fontSize: '0.9375rem' }}>{upcoming.lecturerId?.name || 'Lecturer'}</p>
                      <p style={{ fontSize: '0.8125rem', color: '#6b7280' }}>
                        {new Date(upcoming.date).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}, {new Date(upcoming.date).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })}
                      </p>
                    </div>
                  </div>
                ) : (
                  <p style={{ fontSize: '0.875rem', color: '#9ca3af' }}>No upcoming appointments</p>
                )}
              </div>
            </div>

            {/* Recent Appointments */}
            <div>
              <h2 style={{ fontSize: '1.125rem', fontWeight: 700, color: '#111827', marginBottom: '1rem' }}>Recents Appointments</h2>
              {stats?.latestAppointments?.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {stats.latestAppointments.map((apt) => {
                    const name = apt.lecturerId?.name || 'Lecturer'
                    const initials = name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
                    return (
                      <div key={apt._id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem 1.25rem', background: '#fff', borderRadius: '0.75rem', border: '1px solid #f3f4f6', transition: 'box-shadow 0.2s' }}
                        onMouseEnter={(e) => e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.06)'}
                        onMouseLeave={(e) => e.currentTarget.style.boxShadow = 'none'}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                          <div style={{ width: '2.5rem', height: '2.5rem', borderRadius: '9999px', background: getAvatarColor(name), display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                            <span style={{ color: '#fff', fontSize: '0.8125rem', fontWeight: 700 }}>{initials}</span>
                          </div>
                          <div>
                            <p style={{ fontWeight: 600, color: '#111827', fontSize: '0.9375rem' }}>{name}</p>
                            <p style={{ fontSize: '0.8125rem', color: '#9ca3af' }}>{apt.topic || 'No topic specified'}</p>
                          </div>
                        </div>
                        <span style={{ ...statusStyle(apt.status), padding: '0.375rem 1rem', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: 600, whiteSpace: 'nowrap' }}>
                          {apt.status.charAt(0) + apt.status.slice(1).toLowerCase()}
                        </span>
                      </div>
                    )
                  })}
                </div>
              ) : (
                <div style={{ textAlign: 'center', padding: '3rem 1rem', background: '#fff', borderRadius: '0.75rem', border: '1px solid #f3f4f6' }}>
                  <svg width="48" height="48" fill="none" stroke="#d1d5db" viewBox="0 0 24 24" style={{ margin: '0 auto 1rem' }}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                  <p style={{ color: '#6b7280', marginBottom: '0.25rem' }}>No appointments yet</p>
                  <p style={{ fontSize: '0.875rem', color: '#9ca3af', marginBottom: '1rem' }}>Book your first consultation to get started</p>
                  <Link to="/student/lecturers" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.625rem 1.25rem', background: '#2563eb', color: '#fff', borderRadius: '0.5rem', fontSize: '0.875rem', fontWeight: 600, textDecoration: 'none' }}>
                    <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                    Book Consultation
                  </Link>
                </div>
              )}
            </div>
          </div>
          {/* Bottom tab spacer */}
          <div className="mobile-bottom-spacer" style={{ display: 'none' }} />
        </main>
      </div>
    </div>
  )
}

export default Dashboard
