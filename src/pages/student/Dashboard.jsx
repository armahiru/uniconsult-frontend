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

  const getGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return 'Good morning'
    if (hour < 17) return 'Good afternoon'
    return 'Good evening'
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-main">
        <Navbar onMenuToggle={() => setSidebarOpen(!sidebarOpen)} />
        <div className="page-layout">
          <Sidebar mobileOpen={sidebarOpen} onMobileClose={() => setSidebarOpen(false)} />
          <main className="page-main">
            <div style={{ maxWidth: '24rem', margin: '4rem auto', textAlign: 'center' }}>
              <p style={{ marginBottom: '1rem', fontWeight: 600, color: 'var(--gray-600)' }}>Loading dashboard...</p>
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

  const statCards = [
    {
      label: 'Total Appointments',
      value: stats?.totalAppointments || 0,
      color: 'blue',
      icon: (
        <svg style={{ width: '1.5rem', height: '1.5rem', color: 'var(--blue-600)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      )
    },
    {
      label: 'Pending',
      value: stats?.pendingAppointments || 0,
      color: 'amber',
      icon: (
        <svg style={{ width: '1.5rem', height: '1.5rem', color: 'var(--amber-600)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    },
    {
      label: 'Approved',
      value: stats?.approvedAppointments || 0,
      color: 'green',
      icon: (
        <svg style={{ width: '1.5rem', height: '1.5rem', color: 'var(--green-600)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    }
  ]

  const colorMap = {
    blue: { bg: 'var(--blue-50)', border: 'var(--blue-100)', iconBg: 'var(--blue-100)', text: 'var(--blue-700)' },
    amber: { bg: 'var(--amber-50)', border: 'var(--amber-100)', iconBg: 'var(--amber-100)', text: 'var(--amber-700)' },
    green: { bg: 'var(--green-50)', border: 'var(--green-100)', iconBg: 'var(--green-100)', text: 'var(--green-700)' }
  }

  return (
    <div className="min-h-screen bg-gradient-main mobile-overflow-fix">
      <Navbar onMenuToggle={() => setSidebarOpen(!sidebarOpen)} />
      <div className="page-layout">
        <Sidebar mobileOpen={sidebarOpen} onMobileClose={() => setSidebarOpen(false)} />
        <main className="page-main">
          <div style={{ maxWidth: '72rem' }}>
            {/* Welcome Header */}
            <div style={{ marginBottom: '2rem' }}>
              <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--gray-900)' }}>
                {getGreeting()}, {user?.name?.split(' ')[0] || 'Student'} 👋
              </h1>
              <p style={{ color: 'var(--gray-500)', marginTop: '0.25rem' }}>Here's an overview of your consultations</p>
            </div>

            {/* Stats Cards */}
            <div className="grid md-grid-3" style={{ gap: '1.25rem', marginBottom: '2rem' }}>
              {statCards.map((stat) => {
                const c = colorMap[stat.color]
                return (
                  <div key={stat.label} className="stat-card" style={{ background: c.bg, borderColor: c.border }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                      <p style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--gray-600)' }}>{stat.label}</p>
                      <div className="stat-icon" style={{ background: c.iconBg }}>
                        {stat.icon}
                      </div>
                    </div>
                    <p style={{ fontSize: '1.875rem', fontWeight: 700, color: c.text }}>{stat.value}</p>
                  </div>
                )
              })}
            </div>

            {/* Quick Actions */}
            <div className="grid md-grid-2" style={{ gap: '1.25rem', marginBottom: '2rem' }}>
              <Link to="/student/lecturers" className="action-card" style={{ borderColor: 'var(--gray-200)' }}>
                <div className="action-icon" style={{ background: 'linear-gradient(135deg, var(--blue-500), var(--indigo-600))' }}>
                  <svg style={{ width: '1.5rem', height: '1.5rem', color: '#fff' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <div style={{ flex: 1 }}>
                  <h3 style={{ fontWeight: 600, color: 'var(--gray-900)' }}>Find Lecturers</h3>
                  <p style={{ fontSize: '0.875rem', color: 'var(--gray-500)' }}>Browse and book consultations</p>
                </div>
                <svg className="action-arrow" style={{ width: '1.25rem', height: '1.25rem' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>

              <Link to="/student/appointments" className="action-card" style={{ borderColor: 'var(--gray-200)' }}>
                <div className="action-icon" style={{ background: 'linear-gradient(135deg, var(--green-600), var(--emerald-500))' }}>
                  <svg style={{ width: '1.5rem', height: '1.5rem', color: '#fff' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <div style={{ flex: 1 }}>
                  <h3 style={{ fontWeight: 600, color: 'var(--gray-900)' }}>My Appointments</h3>
                  <p style={{ fontSize: '0.875rem', color: 'var(--gray-500)' }}>View and manage your bookings</p>
                </div>
                <svg className="action-arrow" style={{ width: '1.25rem', height: '1.25rem' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>

            {/* Recent Appointments */}
            <div className="card" style={{ borderRadius: '1rem', padding: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
                <h2 style={{ fontSize: '1.125rem', fontWeight: 700, color: 'var(--gray-900)' }}>Recent Appointments</h2>
                {stats?.latestAppointments?.length > 0 && (
                  <Link to="/student/appointments" style={{ fontSize: '0.875rem', color: 'var(--blue-600)', fontWeight: 500 }}>
                    View all →
                  </Link>
                )}
              </div>
              {stats?.latestAppointments?.length > 0 ? (
                <div className="space-y-3">
                  {stats.latestAppointments.map((apt) => (
                    <div key={apt._id} className="appointment-item">
                      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <div className="appointment-avatar">
                          <span>{(apt.lecturerId?.name || 'L').charAt(0).toUpperCase()}</span>
                        </div>
                        <div>
                          <p style={{ fontWeight: 600, color: 'var(--gray-900)', fontSize: '0.875rem' }}>{apt.lecturerId?.name || 'Lecturer'}</p>
                          <p style={{ fontSize: '0.75rem', color: 'var(--gray-500)' }}>
                            {new Date(apt.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                            {' · '}
                            {new Date(apt.date).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                          </p>
                          {apt.topic && <p style={{ fontSize: '0.75rem', color: 'var(--gray-400)', marginTop: '2px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '16rem' }}>{apt.topic}</p>}
                        </div>
                      </div>
                      <span className="badge" style={
                        apt.status === 'APPROVED' ? { background: 'var(--green-100)', color: 'var(--green-700)' } :
                        apt.status === 'PENDING' ? { background: 'var(--amber-100)', color: 'var(--amber-700)' } :
                        { background: 'var(--red-100)', color: 'var(--red-700)' }
                      }>
                        {apt.status.charAt(0) + apt.status.slice(1).toLowerCase()}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{ textAlign: 'center', padding: '3rem 0' }}>
                  <div style={{ width: '4rem', height: '4rem', background: 'var(--gray-100)', borderRadius: '9999px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem' }}>
                    <svg style={{ width: '2rem', height: '2rem', color: 'var(--gray-400)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <p style={{ color: 'var(--gray-500)', marginBottom: '0.25rem' }}>No appointments yet</p>
                  <p style={{ fontSize: '0.875rem', color: 'var(--gray-400)', marginBottom: '1.25rem' }}>Book your first consultation to get started</p>
                  <Link to="/student/lecturers" className="btn btn-primary" style={{ fontSize: '0.875rem', display: 'inline-flex', alignItems: 'center', gap: '0.5rem', borderRadius: '0.75rem' }}>
                    <svg style={{ width: '1rem', height: '1rem' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Book Consultation
                  </Link>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

export default Dashboard
