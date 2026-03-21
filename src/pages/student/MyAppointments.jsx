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
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const navigate = useNavigate()

  useEffect(() => { fetchAppointments() }, [])

  const fetchAppointments = async () => {
    setProgress(10)
    const t1 = setTimeout(() => setProgress(40), 200)
    const t2 = setTimeout(() => setProgress(70), 500)
    try {
      const { data } = await studentAPI.getAppointments()
      setProgress(90)
      if (data.success) setAppointments(data.appointments)
    } catch (error) { toast.error('Failed to fetch appointments') }
    clearTimeout(t1); clearTimeout(t2)
    setProgress(100)
    setTimeout(() => setLoading(false), 300)
  }

  const handleCancel = async (id) => {
    if (!confirm('Cancel this appointment?')) return
    try {
      const { data } = await studentAPI.cancelAppointment(id)
      if (data.success) { toast.success('Appointment cancelled'); fetchAppointments() }
      else toast.error(data.message)
    } catch (error) { toast.error('Failed to cancel') }
  }

  // Calendar helpers
  const year = currentMonth.getFullYear()
  const month = currentMonth.getMonth()
  const firstDay = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const monthName = currentMonth.toLocaleString('en-US', { month: 'long', year: 'numeric' })
  const today = new Date()

  const appointmentDates = new Set(appointments.map(a => {
    const d = new Date(a.date)
    return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`
  }))
  const hasAppointment = (day) => appointmentDates.has(`${year}-${month}-${day}`)
  const isToday = (day) => today.getFullYear() === year && today.getMonth() === month && today.getDate() === day

  const prevMonth = () => setCurrentMonth(new Date(year, month - 1, 1))
  const nextMonth = () => setCurrentMonth(new Date(year, month + 1, 1))

  const confirmedAppointments = appointments.filter(a => a.status === 'APPROVED')
  const pendingAppointments = appointments.filter(a => a.status === 'PENDING')

  const avatarColors = ['#6366f1', '#2563eb', '#0891b2', '#059669', '#d97706', '#dc2626', '#7c3aed', '#db2777']
  const getAvatarColor = (name) => avatarColors[(name || '').charCodeAt(0) % avatarColors.length]
  const getInitials = (name) => name ? name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) : '?'

  const statusStyle = (status) => {
    if (status === 'APPROVED') return { background: '#dcfce7', color: '#166534' }
    if (status === 'PENDING') return { background: '#fef3c7', color: '#92400e' }
    return { background: '#fee2e2', color: '#991b1b' }
  }

  if (loading) return (
    <div style={{ minHeight: '100vh', background: '#f8fafc' }}>
      <Navbar onMenuToggle={() => setSidebarOpen(!sidebarOpen)} />
      <div style={{ display: 'flex' }}>
        <Sidebar mobileOpen={sidebarOpen} onMobileClose={() => setSidebarOpen(false)} />
        <main style={{ flex: 1, padding: '2rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ maxWidth: '24rem', width: '100%', textAlign: 'center' }}>
            <p style={{ marginBottom: '1rem', fontWeight: 600, color: '#6b7280' }}>Loading schedule...</p>
            <div className="progress-bar-container"><div className="progress-bar-fill" style={{ width: `${progress}%` }} /></div>
            <p className="progress-text">{progress}%</p>
          </div>
        </main>
      </div>
    </div>
  )

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc' }} className="mobile-overflow-fix">
      <Navbar onMenuToggle={() => setSidebarOpen(!sidebarOpen)} />
      <div style={{ display: 'flex' }}>
        <Sidebar mobileOpen={sidebarOpen} onMobileClose={() => setSidebarOpen(false)} />
        <main style={{ flex: 1, padding: '1.5rem', overflow: 'hidden' }}>
          <div style={{ maxWidth: '56rem' }}>
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
              <button onClick={() => navigate(-1)} style={{ color: '#6b7280', background: 'none', border: 'none', cursor: 'pointer', display: 'flex' }}>
                <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
              </button>
              <h1 style={{ fontSize: '1.375rem', fontWeight: 700, color: '#111827' }}>My Schedule</h1>
            </div>

            {/* Calendar */}
            <div style={{ background: '#fff', borderRadius: '1rem', border: '1px solid #f3f4f6', padding: '1.25rem', marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <button onClick={prevMonth} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6b7280', padding: '0.25rem' }}>
                  <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                </button>
                <h2 style={{ fontSize: '1rem', fontWeight: 700, color: '#111827' }}>{monthName}</h2>
                <button onClick={nextMonth} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6b7280', padding: '0.25rem' }}>
                  <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                </button>
              </div>

              {/* Day headers */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', textAlign: 'center', marginBottom: '0.5rem' }}>
                {['SU','MO','TU','WE','TH','FR','SA'].map(d => (
                  <span key={d} style={{ fontSize: '0.6875rem', fontWeight: 600, color: '#9ca3af', padding: '0.25rem' }}>{d}</span>
                ))}
              </div>

              {/* Calendar grid */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', textAlign: 'center' }}>
                {Array.from({ length: firstDay }, (_, i) => <span key={`e-${i}`} />)}
                {Array.from({ length: daysInMonth }, (_, i) => {
                  const day = i + 1
                  const hasApt = hasAppointment(day)
                  const isTodayDay = isToday(day)
                  return (
                    <div key={day} style={{ padding: '0.375rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.125rem' }}>
                      <span style={{
                        width: '2rem', height: '2rem', borderRadius: '9999px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8125rem', fontWeight: isTodayDay || hasApt ? 600 : 400,
                        background: isTodayDay ? '#2563eb' : hasApt ? '#dcfce7' : 'transparent',
                        color: isTodayDay ? '#fff' : hasApt ? '#166534' : '#374151',
                      }}>{day}</span>
                      {hasApt && !isTodayDay && <span style={{ width: '0.25rem', height: '0.25rem', borderRadius: '9999px', background: '#2563eb' }} />}
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Confirmed Consultations */}
            <h2 style={{ fontSize: '1.125rem', fontWeight: 700, color: '#111827', marginBottom: '1rem' }}>Confirmed Consultations</h2>
            {confirmedAppointments.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '2rem' }}>
                {confirmedAppointments.map((apt) => {
                  const name = apt.lecturerId?.name || 'Lecturer'
                  const date = new Date(apt.date)
                  return (
                    <div key={apt._id} style={{ background: '#fff', borderRadius: '1rem', border: '1px solid #f3f4f6', padding: '1.25rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                          <div style={{ width: '2.75rem', height: '2.75rem', borderRadius: '9999px', background: getAvatarColor(name), display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                            <span style={{ color: '#fff', fontWeight: 700, fontSize: '0.875rem' }}>{getInitials(name)}</span>
                          </div>
                          <div>
                            <h3 style={{ fontWeight: 700, color: '#111827', fontSize: '0.9375rem' }}>{name}</h3>
                            <p style={{ fontSize: '0.75rem', color: '#9ca3af' }}>{apt.topic || 'No topic'}</p>
                          </div>
                        </div>
                        <span style={{ ...statusStyle('APPROVED'), padding: '0.25rem 0.625rem', borderRadius: '9999px', fontSize: '0.6875rem', fontWeight: 600 }}>CONFIRMED</span>
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', fontSize: '0.8125rem', color: '#6b7280' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                          {date.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric', year: 'numeric' })}
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                          {date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })}
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /></svg>
                          {apt.meetingType === 'online' ? 'Online' : 'Physical'}
                        </div>
                        {apt.meetingType === 'online' && apt.zoomLink && (
                          <a href={apt.zoomLink} target="_blank" rel="noopener noreferrer" style={{ color: '#2563eb', textDecoration: 'underline', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101" /></svg>
                            Join Zoom
                          </a>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            ) : (
              <div style={{ background: '#fff', borderRadius: '1rem', border: '1px solid #f3f4f6', padding: '2rem', textAlign: 'center', marginBottom: '2rem' }}>
                <p style={{ color: '#9ca3af' }}>No confirmed consultations</p>
              </div>
            )}

            {/* Pending Appointments */}
            {pendingAppointments.length > 0 && (
              <>
                <h2 style={{ fontSize: '1.125rem', fontWeight: 700, color: '#111827', marginBottom: '1rem' }}>Pending Requests</h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {pendingAppointments.map((apt) => {
                    const name = apt.lecturerId?.name || 'Lecturer'
                    const date = new Date(apt.date)
                    return (
                      <div key={apt._id} style={{ background: '#fff', borderRadius: '1rem', border: '1px solid #f3f4f6', padding: '1.25rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                            <div style={{ width: '2.75rem', height: '2.75rem', borderRadius: '9999px', background: getAvatarColor(name), display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                              <span style={{ color: '#fff', fontWeight: 700, fontSize: '0.875rem' }}>{getInitials(name)}</span>
                            </div>
                            <div>
                              <h3 style={{ fontWeight: 700, color: '#111827', fontSize: '0.9375rem' }}>{name}</h3>
                              <p style={{ fontSize: '0.75rem', color: '#9ca3af' }}>{apt.topic || 'No topic'}</p>
                            </div>
                          </div>
                          <span style={{ ...statusStyle('PENDING'), padding: '0.25rem 0.625rem', borderRadius: '9999px', fontSize: '0.6875rem', fontWeight: 600 }}>PENDING</span>
                        </div>
                        <p style={{ fontSize: '0.8125rem', color: '#6b7280', marginBottom: '0.75rem' }}>
                          {date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })} · {date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })}
                        </p>
                        <button onClick={() => handleCancel(apt._id)} style={{ padding: '0.5rem 1rem', background: '#fee2e2', color: '#dc2626', borderRadius: '0.5rem', fontSize: '0.8125rem', fontWeight: 600, border: 'none', cursor: 'pointer' }}>Cancel Request</button>
                      </div>
                    )
                  })}
                </div>
              </>
            )}
          </div>
          <div className="mobile-bottom-spacer" style={{ display: 'none' }} />
        </main>
      </div>
    </div>
  )
}

export default MyAppointments
