import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { lecturerAPI, studentAPI } from '../../services/api'
import toast from 'react-hot-toast'
import Navbar from '../../components/Navbar'
import Sidebar from '../../components/Sidebar'

const BrowseLecturers = () => {
  const [lecturers, setLecturers] = useState([])
  const [selectedLecturer, setSelectedLecturer] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [formData, setFormData] = useState({ date: '', topic: '', meetingType: 'in-person' })
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [lecturerAvailability, setLecturerAvailability] = useState([])
  const [loadingAvailability, setLoadingAvailability] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const navigate = useNavigate()

  useEffect(() => { fetchLecturers() }, [])

  const fetchLecturers = async () => {
    try {
      const { data } = await lecturerAPI.getAll()
      if (data.success) setLecturers(data.lecturers)
    } catch (error) { toast.error('Failed to fetch lecturers') }
    finally { setFetching(false) }
  }

  const openBookingModal = async (lecturer) => {
    setSelectedLecturer(lecturer)
    setShowModal(true)
    setLecturerAvailability([])
    setLoadingAvailability(true)
    try {
      const { data } = await lecturerAPI.getAvailability(lecturer.userId._id)
      if (data.success) setLecturerAvailability(data.availability || [])
    } catch (error) { console.error('Failed to fetch availability') }
    setLoadingAvailability(false)
  }

  const handleBooking = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const { data } = await studentAPI.bookAppointment({ lecturerId: selectedLecturer.userId._id, ...formData })
      if (data.success) {
        toast.success('Appointment booked successfully')
        setShowModal(false)
        setFormData({ date: '', topic: '', meetingType: 'in-person' })
        navigate('/student/appointments')
      } else { toast.error(data.message) }
    } catch (error) { toast.error('Failed to book appointment') }
    finally { setLoading(false) }
  }

  const getInitials = (name) => name ? name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) : '?'

  const filteredLecturers = lecturers.filter((l) => {
    const q = searchQuery.toLowerCase()
    return l.userId?.name?.toLowerCase().includes(q) || l.department?.toLowerCase().includes(q) || l.specialization?.toLowerCase().includes(q)
  })

  return (
    <div className="min-h-screen bg-gradient-main mobile-overflow-fix">
      <Navbar onMenuToggle={() => setSidebarOpen(!sidebarOpen)} />
      <div className="page-layout">
        <Sidebar mobileOpen={sidebarOpen} onMobileClose={() => setSidebarOpen(false)} />
        <main className="page-main">
          <div style={{ maxWidth: '72rem' }}>
            <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', marginBottom: '2rem' }}>
              <div>
                <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--gray-900)' }}>Find Lecturers</h1>
                <p style={{ color: 'var(--gray-500)', fontSize: '0.875rem', marginTop: '0.25rem' }}>Browse available lecturers and book a consultation</p>
              </div>
              {!fetching && lecturers.length > 0 && (
                <div style={{ position: 'relative' }}>
                  <svg style={{ width: '1rem', height: '1rem', color: 'var(--gray-400)', position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  <input type="text" placeholder="Search by name, department..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="input" style={{ paddingLeft: '2.5rem', width: '16rem', borderRadius: '0.75rem' }} />
                </div>
              )}
            </div>

            {fetching ? (
              <div className="grid md-grid-2 lg-grid-3" style={{ gap: '1.5rem' }}>
                {[1,2,3,4,5,6].map(i => (
                  <div key={i} className="skeleton" style={{ background: '#fff', borderRadius: '1rem', padding: '1.5rem', border: '1px solid var(--gray-100)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.25rem' }}>
                      <div className="skeleton" style={{ width: '3.5rem', height: '3.5rem', borderRadius: '9999px' }} />
                      <div style={{ flex: 1 }}>
                        <div className="skeleton" style={{ height: '1rem', width: '75%', marginBottom: '0.5rem' }} />
                        <div className="skeleton" style={{ height: '0.75rem', width: '50%' }} />
                      </div>
                    </div>
                    <div className="skeleton" style={{ height: '2.75rem', borderRadius: '0.75rem' }} />
                  </div>
                ))}
              </div>
            ) : filteredLecturers.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '5rem 0' }}>
                <p style={{ color: 'var(--gray-500)', fontSize: '1.125rem', fontWeight: 500 }}>
                  {searchQuery ? 'No lecturers match your search' : 'No lecturers available'}
                </p>
                <p style={{ color: 'var(--gray-400)', fontSize: '0.875rem', marginTop: '0.25rem' }}>
                  {searchQuery ? 'Try a different search term' : 'Check back later for available lecturers'}
                </p>
              </div>
            ) : (
              <>
                <p style={{ fontSize: '0.875rem', color: 'var(--gray-400)', marginBottom: '1rem' }}>{filteredLecturers.length} lecturer{filteredLecturers.length !== 1 ? 's' : ''} available</p>
                <div className="grid md-grid-2 lg-grid-3" style={{ gap: '1.5rem' }}>
                  {filteredLecturers.map((lecturer, index) => (
                    <div key={lecturer._id} className="lecturer-card">
                      <div className={`lecturer-card-accent avatar-gradient-${index % 8}`} />
                      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                        <div className={`avatar-gradient-${index % 8}`} style={{ width: '3.5rem', height: '3.5rem', borderRadius: '9999px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', flexShrink: 0 }}>
                          <span style={{ color: '#fff', fontWeight: 700, fontSize: '1.125rem' }}>{getInitials(lecturer.userId?.name)}</span>
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <h3 style={{ fontWeight: 600, color: 'var(--gray-900)' }} className="truncate">{lecturer.userId?.name || 'Unknown'}</h3>
                          {lecturer.department && <p style={{ fontSize: '0.875rem', color: 'var(--gray-500)' }} className="truncate">{lecturer.department}</p>}
                        </div>
                      </div>
                      {lecturer.specialization && (
                        <div style={{ marginBottom: '0.75rem' }}>
                          <span style={{ display: 'inline-block', padding: '0.375rem 0.75rem', background: 'var(--indigo-50)', color: 'var(--indigo-700)', borderRadius: '0.5rem', fontSize: '0.75rem', fontWeight: 500 }}>{lecturer.specialization}</span>
                        </div>
                      )}
                      {lecturer.availability && lecturer.availability.length > 0 ? (
                        <div className="availability-box" style={{ marginBottom: '1rem' }}>
                          <p style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--green-700)', marginBottom: '0.375rem' }}>Available Hours</p>
                          {['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'].map(day => {
                            const slots = lecturer.availability.filter(s => s.day === day)
                            if (slots.length === 0) return null
                            return <div key={day} style={{ fontSize: '0.75rem', color: 'var(--green-600)', display: 'flex', gap: '0.375rem' }}><span style={{ fontWeight: 500, width: '2rem' }}>{day.slice(0,3)}</span><span>{slots.map(s => `${s.startTime}-${s.endTime}`).join(', ')}</span></div>
                          })}
                        </div>
                      ) : (
                        <p style={{ fontSize: '0.75rem', color: 'var(--gray-400)', fontStyle: 'italic', marginBottom: '1rem' }}>No availability set yet</p>
                      )}
                      <button onClick={() => openBookingModal(lecturer)} className="btn-gradient" style={{ width: '100%', padding: '0.625rem' }}>Book Consultation</button>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>

          {showModal && selectedLecturer && (
            <div className="modal-overlay" onClick={() => setShowModal(false)}>
              <div className="modal-card" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                  <div>
                    <h2>Book Consultation</h2>
                    <p>with {selectedLecturer.userId?.name}</p>
                  </div>
                  <button onClick={() => setShowModal(false)} className="modal-close">
                    <svg style={{ width: '1rem', height: '1rem', color: '#fff' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                <form onSubmit={handleBooking} className="modal-body space-y-4">
                  <div style={{ background: 'var(--blue-50)', borderRadius: '0.75rem', padding: '1rem' }}>
                    <p style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--blue-700)', marginBottom: '0.5rem' }}>Available Hours</p>
                    {loadingAvailability ? (
                      <p style={{ fontSize: '0.75rem', color: 'var(--blue-600)' }}>Loading availability...</p>
                    ) : lecturerAvailability.length > 0 ? (
                      <div className="space-y-1">
                        {['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'].map(day => {
                          const slots = lecturerAvailability.filter(s => s.day === day)
                          if (slots.length === 0) return null
                          return <div key={day} style={{ display: 'flex', gap: '0.5rem', fontSize: '0.75rem', color: 'var(--blue-700)' }}><span style={{ fontWeight: 600, width: '5rem' }}>{day}</span><span>{slots.map(s => `${s.startTime} - ${s.endTime}`).join(', ')}</span></div>
                        })}
                      </div>
                    ) : (
                      <p style={{ fontSize: '0.75rem', color: 'var(--blue-600)' }}>No specific hours set — any time may work.</p>
                    )}
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, color: 'var(--gray-700)', marginBottom: '0.375rem' }}>Date & Time</label>
                    <input type="datetime-local" required className="input" style={{ borderRadius: '0.75rem' }} value={formData.date} onChange={(e) => setFormData({ ...formData, date: e.target.value })} />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, color: 'var(--gray-700)', marginBottom: '0.375rem' }}>Topic</label>
                    <textarea required rows={3} className="input" style={{ borderRadius: '0.75rem', resize: 'none' }} value={formData.topic} onChange={(e) => setFormData({ ...formData, topic: e.target.value })} placeholder="What would you like to discuss?" />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, color: 'var(--gray-700)', marginBottom: '0.375rem' }}>Meeting Type</label>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                      <button type="button" onClick={() => setFormData({ ...formData, meetingType: 'in-person' })} className={`meeting-type-btn ${formData.meetingType === 'in-person' ? 'active' : ''}`}>🏢 In Person</button>
                      <button type="button" onClick={() => setFormData({ ...formData, meetingType: 'online' })} className={`meeting-type-btn ${formData.meetingType === 'online' ? 'active' : ''}`}>💻 Online</button>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '0.75rem', paddingTop: '0.5rem' }}>
                    <button type="submit" disabled={loading} className="btn-gradient" style={{ flex: 1 }}>
                      {loading ? 'Booking...' : 'Confirm Booking'}
                    </button>
                    <button type="button" onClick={() => { setShowModal(false); setFormData({ date: '', topic: '', meetingType: 'in-person' }) }} style={{ flex: 1, padding: '0.625rem', border: '1px solid var(--gray-300)', borderRadius: '0.75rem', fontSize: '0.875rem', fontWeight: 500, color: 'var(--gray-700)', transition: 'background 0.2s' }}>
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}

export default BrowseLecturers
