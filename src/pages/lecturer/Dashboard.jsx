import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { lecturerAPI } from '../../services/api'
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
      const { data } = await lecturerAPI.getDashboard()
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

  const getStatusStyle = (status) => {
    switch (status) {
      case 'APPROVED': return { background: 'var(--green-100)', color: 'var(--green-700)' }
      case 'PENDING': return { background: 'var(--amber-100)', color: 'var(--amber-700)' }
      default: return { background: 'var(--red-100)', color: 'var(--red-700)' }
    }
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
              <div className="progress-bar-container"><div className="progress-bar-fill" style={{ width: `${progress}%` }} /></div>
              <p className="progress-text">{progress}%</p>
            </div>
          </main>
        </div>
      </div>
    )
  }

  const statCards = [
    {
      label: 'Total Appointments', value: stats?.totalAppointments || 0, color: 'blue',
      icon: (<svg style={{ width: '1.5rem', height: '1.5rem', color: 'var(--blue-600)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>)
    },
    {
      label: 'Pending Requests', value: stats?.pendingRequests || 0, color: 'amber',
      icon: (<svg style={{ width: '1.5rem', height: '1.5rem', color: 'var(--amber-600)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>)
    },
    {
      label: 'Approved', value: stats?.approvedAppointments || 0, color: 'green',
      icon: (<svg style={{ width: '1.5rem', height: '1.5rem', color: 'var(--green-600)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>)
    },
    {
      label: "Today's Consultations", value: stats?.todayConsultations || 0, color: 'purple',
      icon: (<svg style={{ width: '1.5rem', height: '1.5rem', color: 'var(--purple-600)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" /></svg>)
    }
  ]

  const colorMap = {
    blue: { bg: 'var(--blue-50)', border: 'var(--blue-100)', iconBg: 'var(--blue-100)', text: 'var(--blue-700)' },
    amber: { bg: 'var(--amber-50)', border: 'var(--amber-100)', iconBg: 'var(--amber-100)', text: 'var(--amber-700)' },
    green: { bg: 'var(--green-50)', border: 'var(--green-100)', iconBg: 'var(--green-100)', text: 'var(--green-700)' },
    purple: { bg: 'var(--purple-100)', border: 'rgba(168,85,247,0.2)', iconBg: 'rgba(168,85,247,0.2)', text: 'var(--purple-700)' }
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc' }} className="mobile-overflow-fix">
      <Navbar onMenuToggle={() => setSidebarOpen(!sidebarOpen)} />
      <div style={{ display: 'flex' }}>
        <Sidebar mobileOpen={sidebarOpen} onMobileClose={() => setSidebarOpen(false)} />
        <main style={{ flex: 1, padding: '1.5rem', overflow: 'hidden' }}>
          <div style={{ maxWidth: '72rem' }}>
            {/* Welcome Header */}
            <div style={{ marginBottom: '2rem' }}>
              <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--gray-900)' }}>
                {getGreeting()}, {user?.name?.split(' ')[0] || 'Lecturer'} 👋
              </h1>
              <p style={{ color: 'var(--gray-500)', marginTop: '0.25rem' }}>Here's an overview of your consultations</p>
            </div>

            {/* Stats Cards */}
            <div className="grid md-grid-4" style={{ gap: '1.25rem', marginBottom: '2rem' }}>
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
              <Link to="/lecturer/appointments" className="action-card" style={{ borderColor: 'var(--gray-200)' }}>
                <div className="action-icon" style={{ background: 'linear-gradient(135deg, var(--amber-500), var(--orange-600))' }}>
                  <svg style={{ width: '1.5rem', height: '1.5rem', color: '#fff' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div style={{ flex: 1 }}>
                  <h3 style={{ fontWeight: 600, color: 'var(--gray-900)' }}>Appointment Requests</h3>
                  <p style={{ fontSize: '0.875rem', color: 'var(--gray-500)' }}>Review and manage student requests</p>
                </div>
                <svg className="action-arrow" style={{ width: '1.25rem', height: '1.25rem' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>

              <Link to="/lecturer/schedule" className="action-card" style={{ borderColor: 'var(--gray-200)' }}>
                <div className="action-icon" style={{ background: 'linear-gradient(135deg, var(--indigo-600), var(--purple-600))' }}>
                  <svg style={{ width: '1.5rem', height: '1.5rem', color: '#fff' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <div style={{ flex: 1 }}>
                  <h3 style={{ fontWeight: 600, color: 'var(--gray-900)' }}>My Schedule</h3>
                  <p style={{ fontSize: '0.875rem', color: 'var(--gray-500)' }}>Set your availability hours</p>
                </div>
                <svg className="action-arrow" style={{ width: '1.25rem', height: '1.25rem' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>

            {/* Recent Appointment Requests */}
            <div className="card" style={{ borderRadius: '1rem', padding: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
                <h2 style={{ fontSize: '1.125rem', fontWeight: 700, color: 'var(--gray-900)' }}>Recent Appointment Requests</h2>
                {stats?.latestAppointments?.length > 0 && (
                  <Link to="/lecturer/appointments" style={{ fontSize: '0.875rem', color: 'var(--blue-600)', fontWeight: 500 }}>
                    View all →
                  </Link>
                )}
              </div>
              {stats?.latestAppointments?.length > 0 ? (
                <div className="space-y-3">
                  {stats.latestAppointments.map((apt) => (
                    <div key={apt._id} className="appointment-item">
                      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <div className="appointment-avatar" style={{ background: 'linear-gradient(135deg, var(--blue-500), var(--indigo-600))' }}>
                          <span>{(apt.studentId?.name || 'S').charAt(0).toUpperCase()}</span>
                        </div>
                        <div>
                          <p style={{ fontWeight: 600, color: 'var(--gray-900)', fontSize: '0.875rem' }}>{apt.studentId?.name || 'Student'}</p>
                          <p style={{ fontSize: '0.75rem', color: 'var(--gray-500)' }}>
                            {new Date(apt.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                            {' · '}
                            {new Date(apt.date).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                          </p>
                          {apt.topic && <p style={{ fontSize: '0.75rem', color: 'var(--gray-400)', marginTop: '2px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '16rem' }}>{apt.topic}</p>}
                        </div>
                      </div>
                      <span className="badge" style={getStatusStyle(apt.status)}>
                        {apt.status.charAt(0) + apt.status.slice(1).toLowerCase()}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{ textAlign: 'center', padding: '3rem 0' }}>
                  <div style={{ width: '4rem', height: '4rem', background: 'var(--gray-100)', borderRadius: '9999px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem' }}>
                    <svg style={{ width: '2rem', height: '2rem', color: 'var(--gray-400)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                    </svg>
                  </div>
                  <p style={{ color: 'var(--gray-500)', marginBottom: '0.25rem' }}>No appointment requests yet</p>
                  <p style={{ fontSize: '0.875rem', color: 'var(--gray-400)' }}>Student requests will appear here</p>
                </div>
              )}
            </div>
          </div>
          <div className="mobile-bottom-spacer" style={{ display: 'none' }} />
        </main>
      </div>
    </div>
  )
}

export default Dashboard
