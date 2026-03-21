import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { lecturerAPI } from '../../services/api'
import toast from 'react-hot-toast'
import Navbar from '../../components/Navbar'
import Sidebar from '../../components/Sidebar'

const Appointments = () => {
  const [appointments, setAppointments] = useState([])
  const [loading, setLoading] = useState(true)
  const [progress, setProgress] = useState(0)
  const [filter, setFilter] = useState('PENDING')
  const [showZoomModal, setShowZoomModal] = useState(false)
  const [selectedAppointment, setSelectedAppointment] = useState(null)
  const [zoomLink, setZoomLink] = useState('')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const navigate = useNavigate()

  useEffect(() => { fetchAppointments() }, [])

  const fetchAppointments = async () => {
    setProgress(10)
    const t1 = setTimeout(() => setProgress(40), 200)
    const t2 = setTimeout(() => setProgress(70), 500)
    try {
      const { data } = await lecturerAPI.getAppointments()
      setProgress(90)
      if (data.success) setAppointments(data.appointments)
    } catch (error) { toast.error('Failed to fetch appointments') }
    clearTimeout(t1); clearTimeout(t2)
    setProgress(100)
    setTimeout(() => setLoading(false), 300)
  }

  const handleApprove = async (id) => {
    try {
      const { data } = await lecturerAPI.approveAppointment(id)
      if (data.success) { toast.success('Appointment approved'); fetchAppointments() }
      else toast.error(data.message)
    } catch (error) { toast.error('Failed to approve') }
  }

  const handleDecline = async (id) => {
    if (!confirm('Decline this appointment?')) return
    try {
      const { data } = await lecturerAPI.declineAppointment(id)
      if (data.success) { toast.success('Appointment declined'); fetchAppointments() }
      else toast.error(data.message)
    } catch (error) { toast.error('Failed to decline') }
  }

  const handleAddZoomLink = (apt) => { setSelectedAppointment(apt); setZoomLink(apt.zoomLink || ''); setShowZoomModal(true) }
  const handleSaveZoomLink = async () => {
    try {
      const { data } = await lecturerAPI.updateZoomLink(selectedAppointment._id, zoomLink)
      if (data.success) { toast.success('Zoom link updated'); setShowZoomModal(false); fetchAppointments() }
      else toast.error(data.message)
    } catch (error) { toast.error('Failed to update zoom link') }
  }

  const avatarColors = ['#6366f1', '#2563eb', '#0891b2', '#059669', '#d97706', '#dc2626', '#7c3aed', '#db2777']
  const getAvatarColor = (name) => avatarColors[(name || '').charCodeAt(0) % avatarColors.length]
  const getInitials = (name) => name ? name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) : '?'

  const filteredAppointments = appointments.filter(a => a.status === filter)
  const pendingCount = appointments.filter(a => a.status === 'PENDING').length

  const filters = [
    { key: 'PENDING', label: 'Pending', bg: '#fef3c7', color: '#92400e', activeBg: '#f59e0b', activeColor: '#fff' },
    { key: 'APPROVED', label: 'Approved', bg: '#f3f4f6', color: '#6b7280', activeBg: '#16a34a', activeColor: '#fff' },
    { key: 'DECLINED', label: 'Declined', bg: '#f3f4f6', color: '#6b7280', activeBg: '#dc2626', activeColor: '#fff' }
  ]

  if (loading) return (
    <div style={{ minHeight: '100vh', background: '#f8fafc' }}>
      <Navbar onMenuToggle={() => setSidebarOpen(!sidebarOpen)} />
      <div style={{ display: 'flex' }}>
        <Sidebar mobileOpen={sidebarOpen} onMobileClose={() => setSidebarOpen(false)} />
        <main style={{ flex: 1, padding: '2rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ maxWidth: '24rem', width: '100%', textAlign: 'center' }}>
            <p style={{ marginBottom: '1rem', fontWeight: 600, color: '#6b7280' }}>Loading requests...</p>
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
              <button onClick={() => navigate(-1)} style={{ color: '#6b7280', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
              </button>
              <h1 style={{ fontSize: '1.375rem', fontWeight: 700, color: '#111827' }}>Appointment Requests</h1>
            </div>

            {/* Filter Tabs */}
            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem' }}>
              {filters.map(f => {
                const isActive = filter === f.key
                return (
                  <button key={f.key} onClick={() => setFilter(f.key)} style={{
                    padding: '0.5rem 1rem', borderRadius: '9999px', fontSize: '0.8125rem', fontWeight: 600, border: 'none', cursor: 'pointer', transition: 'all 0.2s',
                    background: isActive ? f.activeBg : f.bg, color: isActive ? f.activeColor : f.color
                  }}>
                    {f.label}
                    {f.key === 'PENDING' && pendingCount > 0 && !isActive && (
                      <span style={{ marginLeft: '0.375rem', background: '#f59e0b', color: '#fff', borderRadius: '9999px', padding: '0.125rem 0.5rem', fontSize: '0.6875rem' }}>{pendingCount}</span>
                    )}
                  </button>
                )
              })}
            </div>

            {/* Appointment Cards */}
            {filteredAppointments.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {filteredAppointments.map((apt) => {
                  const name = apt.studentId?.name || 'Student'
                  const initials = getInitials(name)
                  const color = getAvatarColor(name)
                  const date = new Date(apt.date)
                  return (
                    <div key={apt._id} style={{ background: '#fff', borderRadius: '1rem', border: '1px solid #f3f4f6', padding: '1.25rem', transition: 'box-shadow 0.2s' }}
                      onMouseEnter={(e) => e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.06)'}
                      onMouseLeave={(e) => e.currentTarget.style.boxShadow = 'none'}
                    >
                      {/* Student info row */}
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                          <div style={{ width: '2.75rem', height: '2.75rem', borderRadius: '9999px', background: color, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                            <span style={{ color: '#fff', fontWeight: 700, fontSize: '0.875rem' }}>{initials}</span>
                          </div>
                          <div>
                            <h3 style={{ fontWeight: 700, color: '#111827', fontSize: '0.9375rem' }}>{name}</h3>
                            <p style={{ fontSize: '0.75rem', color: '#9ca3af' }}>{apt.studentId?.email || ''}</p>
                          </div>
                        </div>
                        {apt.status === 'PENDING' && (
                          <span style={{ background: '#dcfce7', color: '#166534', padding: '0.25rem 0.625rem', borderRadius: '9999px', fontSize: '0.6875rem', fontWeight: 600 }}>NEW</span>
                        )}
                      </div>

                      {/* Details */}
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem', marginBottom: '0.75rem', fontSize: '0.8125rem', color: '#6b7280' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
                          {apt.topic || 'No topic specified'}
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                          {date.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}, {date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })}
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          {apt.meetingType === 'online' ? (
                            <><svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg> Online Meeting</>
                          ) : (
                            <><svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg> In-Person</>
                          )}
                        </div>
                        {apt.meetingType === 'online' && apt.zoomLink && (
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <svg width="14" height="14" fill="none" stroke="#2563eb" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" /></svg>
                            <a href={apt.zoomLink} target="_blank" rel="noopener noreferrer" style={{ color: '#2563eb', textDecoration: 'underline', fontSize: '0.8125rem' }}>Join Zoom</a>
                          </div>
                        )}
                      </div>

                      {/* Action Buttons */}
                      {apt.status === 'PENDING' && (
                        <div style={{ display: 'flex', gap: '0.75rem' }}>
                          <button onClick={() => handleDecline(apt._id)} style={{ flex: 1, padding: '0.625rem', background: '#fee2e2', color: '#dc2626', borderRadius: '0.75rem', fontSize: '0.8125rem', fontWeight: 600, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.375rem', transition: 'background 0.2s' }}
                            onMouseEnter={(e) => e.currentTarget.style.background = '#fecaca'}
                            onMouseLeave={(e) => e.currentTarget.style.background = '#fee2e2'}
                          >
                            <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                            Decline
                          </button>
                          <button onClick={() => handleApprove(apt._id)} style={{ flex: 1, padding: '0.625rem', background: '#dcfce7', color: '#166534', borderRadius: '0.75rem', fontSize: '0.8125rem', fontWeight: 600, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.375rem', transition: 'background 0.2s' }}
                            onMouseEnter={(e) => e.currentTarget.style.background = '#bbf7d0'}
                            onMouseLeave={(e) => e.currentTarget.style.background = '#dcfce7'}
                          >
                            <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                            Approve
                          </button>
                        </div>
                      )}
                      {apt.status === 'APPROVED' && apt.meetingType === 'online' && (
                        <button onClick={() => handleAddZoomLink(apt)} style={{ width: '100%', padding: '0.625rem', background: '#eff6ff', color: '#2563eb', borderRadius: '0.75rem', fontSize: '0.8125rem', fontWeight: 600, border: 'none', cursor: 'pointer' }}>
                          {apt.zoomLink ? '🔗 Update Zoom Link' : '🔗 Add Zoom Link'}
                        </button>
                      )}
                    </div>
                  )
                })}
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '4rem 1rem', background: '#fff', borderRadius: '1rem', border: '1px solid #f3f4f6' }}>
                <p style={{ color: '#6b7280', fontSize: '1rem' }}>No {filter.toLowerCase()} appointments</p>
              </div>
            )}
          </div>
          <div className="mobile-bottom-spacer" style={{ display: 'none' }} />
        </main>
      </div>

      {/* Zoom Modal */}
      {showZoomModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)', zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
          <div style={{ background: '#fff', borderRadius: '1rem', boxShadow: '0 25px 50px rgba(0,0,0,0.25)', maxWidth: '24rem', width: '100%', padding: '1.5rem' }}>
            <h2 style={{ fontSize: '1.125rem', fontWeight: 700, color: '#111827', marginBottom: '0.25rem' }}>Add Zoom Link</h2>
            <p style={{ color: '#6b7280', fontSize: '0.875rem', marginBottom: '1.25rem' }}>for {selectedAppointment?.studentId?.name}</p>
            <div style={{ marginBottom: '1.25rem' }}>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, color: '#374151', marginBottom: '0.375rem' }}>Zoom Meeting Link</label>
              <input type="url" required value={zoomLink} onChange={(e) => setZoomLink(e.target.value)} placeholder="https://zoom.us/j/..." style={{ width: '100%', padding: '0.625rem 0.75rem', border: '1px solid #d1d5db', borderRadius: '0.5rem', fontSize: '0.875rem', outline: 'none' }} />
            </div>
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button onClick={handleSaveZoomLink} style={{ flex: 1, padding: '0.625rem', background: '#2563eb', color: '#fff', borderRadius: '0.75rem', fontWeight: 600, fontSize: '0.875rem', border: 'none', cursor: 'pointer' }}>Save Link</button>
              <button onClick={() => setShowZoomModal(false)} style={{ flex: 1, padding: '0.625rem', border: '1px solid #d1d5db', borderRadius: '0.75rem', fontWeight: 500, fontSize: '0.875rem', color: '#374151', background: '#fff', cursor: 'pointer' }}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Appointments
