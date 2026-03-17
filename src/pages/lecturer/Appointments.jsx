import { useState, useEffect } from 'react'
import { lecturerAPI } from '../../services/api'
import toast from 'react-hot-toast'
import Navbar from '../../components/Navbar'
import Sidebar from '../../components/Sidebar'

const Appointments = () => {
  const [appointments, setAppointments] = useState([])
  const [loading, setLoading] = useState(true)
  const [progress, setProgress] = useState(0)
  const [filter, setFilter] = useState('ALL')
  const [showZoomModal, setShowZoomModal] = useState(false)
  const [selectedAppointment, setSelectedAppointment] = useState(null)
  const [zoomLink, setZoomLink] = useState('')
  const [sidebarOpen, setSidebarOpen] = useState(false)

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
    } catch (error) { toast.error('Failed to approve appointment') }
  }

  const handleDecline = async (id) => {
    if (!confirm('Are you sure you want to decline this appointment?')) return
    try {
      const { data } = await lecturerAPI.declineAppointment(id)
      if (data.success) { toast.success('Appointment declined'); fetchAppointments() }
      else toast.error(data.message)
    } catch (error) { toast.error('Failed to decline appointment') }
  }

  const handleAddZoomLink = (apt) => { setSelectedAppointment(apt); setZoomLink(apt.zoomLink || ''); setShowZoomModal(true) }

  const handleSaveZoomLink = async () => {
    try {
      const { data } = await lecturerAPI.updateZoomLink(selectedAppointment._id, zoomLink)
      if (data.success) { toast.success('Zoom link updated'); setShowZoomModal(false); fetchAppointments() }
      else toast.error(data.message)
    } catch (error) { toast.error('Failed to update zoom link') }
  }

  const getStatusStyle = (status) => {
    switch (status) {
      case 'PENDING': return { background: '#fef3c7', color: '#92400e' }
      case 'APPROVED': return { background: '#dcfce7', color: 'var(--green-800)' }
      case 'DECLINED': return { background: '#fee2e2', color: '#991b1b' }
      default: return { background: 'var(--gray-100)', color: 'var(--gray-800)' }
    }
  }

  const filteredAppointments = filter === 'ALL' ? appointments : appointments.filter(a => a.status === filter)

  if (loading) return (
    <div className="min-h-screen" style={{ background: 'var(--gray-50)' }}>
      <Navbar onMenuToggle={() => setSidebarOpen(!sidebarOpen)} />
      <div className="page-layout">
        <Sidebar mobileOpen={sidebarOpen} onMobileClose={() => setSidebarOpen(false)} />
        <main className="page-main">
          <div style={{ maxWidth: '24rem', margin: '4rem auto', textAlign: 'center' }}>
            <p style={{ marginBottom: '1rem', fontWeight: 600, color: 'var(--gray-600)' }}>Loading requests...</p>
            <div className="progress-bar-container"><div className="progress-bar-fill" style={{ width: `${progress}%` }} /></div>
            <p className="progress-text">{progress}%</p>
          </div>
        </main>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen mobile-overflow-fix" style={{ background: 'var(--gray-50)' }}>
      <Navbar onMenuToggle={() => setSidebarOpen(!sidebarOpen)} />
      <div className="page-layout">
        <Sidebar mobileOpen={sidebarOpen} onMobileClose={() => setSidebarOpen(false)} />
        <main className="page-main">
          <h1 style={{ fontSize: '1.875rem', fontWeight: 700, marginBottom: '2rem' }}>Appointments</h1>
          <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
            {['ALL', 'PENDING', 'APPROVED', 'DECLINED'].map((status) => (
              <button key={status} onClick={() => setFilter(status)} className={`filter-btn ${filter === status ? 'active' : ''}`}>{status}</button>
            ))}
          </div>

          {filteredAppointments.length > 0 ? (
            <div className="space-y-4">
              {filteredAppointments.map((apt) => (
                <div key={apt._id} className="card">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '0.5rem' }}>{apt.studentId?.name}</h3>
                      <p style={{ color: 'var(--gray-600)', marginBottom: '0.25rem' }}>📧 {apt.studentId?.email}</p>
                      <p style={{ color: 'var(--gray-600)', marginBottom: '0.25rem' }}>📅 {new Date(apt.date).toLocaleString()}</p>
                      <p style={{ color: 'var(--gray-600)', marginBottom: '0.25rem' }}>{apt.meetingType === 'online' ? '💻 Online Meeting' : '🏢 In-Person Meeting'}</p>
                      {apt.meetingType === 'online' && apt.zoomLink && (
                        <p style={{ color: 'var(--blue-600)', marginBottom: '0.25rem' }}>🔗 <a href={apt.zoomLink} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'underline' }}>Zoom Link</a></p>
                      )}
                      <p style={{ color: 'var(--gray-600)', marginBottom: '0.5rem' }}>📝 {apt.topic || 'No topic specified'}</p>
                      <span className="badge" style={getStatusStyle(apt.status)}>{apt.status}</span>
                    </div>
                    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                      {apt.status === 'PENDING' && (
                        <>
                          <button onClick={() => handleApprove(apt._id)} style={{ background: 'var(--green-600)', color: '#fff', padding: '0.5rem 1rem', borderRadius: '0.5rem', fontSize: '0.875rem', fontWeight: 500, transition: 'background 0.2s' }}>Approve</button>
                          <button onClick={() => handleDecline(apt._id)} style={{ background: 'var(--red-600)', color: '#fff', padding: '0.5rem 1rem', borderRadius: '0.5rem', fontSize: '0.875rem', fontWeight: 500, transition: 'background 0.2s' }}>Decline</button>
                        </>
                      )}
                      {apt.status === 'APPROVED' && apt.meetingType === 'online' && (
                        <button onClick={() => handleAddZoomLink(apt)} style={{ background: 'var(--blue-600)', color: '#fff', padding: '0.5rem 1rem', borderRadius: '0.5rem', fontSize: '0.875rem', fontWeight: 500 }}>
                          {apt.zoomLink ? 'Update Zoom' : 'Add Zoom'}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="card" style={{ textAlign: 'center', padding: '3rem 1.5rem' }}>
              <p style={{ color: 'var(--gray-500)' }}>No appointments found</p>
            </div>
          )}
        </main>
      </div>

      {showZoomModal && (
        <div className="modal-overlay">
          <div className="modal-card" style={{ padding: '1.5rem' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--gray-900)', marginBottom: '0.5rem' }}>Add Zoom Link</h2>
            <p style={{ color: 'var(--gray-600)', marginBottom: '1.5rem' }}>for {selectedAppointment?.studentId?.name}</p>
            <div className="space-y-4">
              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, color: 'var(--gray-700)', marginBottom: '0.5rem' }}>Zoom Meeting Link</label>
                <input type="url" required className="input" value={zoomLink} onChange={(e) => setZoomLink(e.target.value)} placeholder="https://zoom.us/j/..." />
              </div>
              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <button onClick={handleSaveZoomLink} className="btn btn-primary" style={{ flex: 1 }}>Save Link</button>
                <button onClick={() => setShowZoomModal(false)} className="btn btn-secondary" style={{ flex: 1 }}>Cancel</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Appointments
