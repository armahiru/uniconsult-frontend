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
  const [deptFilter, setDeptFilter] = useState('')
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
  const avatarColors = ['#6366f1', '#2563eb', '#0891b2', '#059669', '#d97706', '#dc2626', '#7c3aed', '#db2777']
  const getAvatarColor = (name) => avatarColors[(name || '').charCodeAt(0) % avatarColors.length]

  const departments = [...new Set(lecturers.map(l => l.department).filter(Boolean))]

  const filteredLecturers = lecturers.filter((l) => {
    const q = searchQuery.toLowerCase()
    const matchesSearch = l.userId?.name?.toLowerCase().includes(q) || l.department?.toLowerCase().includes(q) || l.specialization?.toLowerCase().includes(q)
    const matchesDept = !deptFilter || l.department === deptFilter
    return matchesSearch && matchesDept
  })

  const inputStyle = { width: '100%', padding: '0.625rem 0.75rem 0.625rem 2.5rem', border: '1px solid #e5e7eb', borderRadius: '0.75rem', fontSize: '0.875rem', outline: 'none', background: '#fff' }

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc' }} className="mobile-overflow-fix">
      <Navbar onMenuToggle={() => setSidebarOpen(!sidebarOpen)} />
      <div style={{ display: 'flex' }}>
        <Sidebar mobileOpen={sidebarOpen} onMobileClose={() => setSidebarOpen(false)} />
        <main style={{ flex: 1, padding: '1.5rem', overflow: 'hidden' }}>
          <div style={{ maxWidth: '56rem' }}>
            <h1 style={{ fontSize: '1.375rem', fontWeight: 700, color: '#111827', marginBottom: '1.25rem' }}>Browse Lecturers</h1>

            {/* Search & Filters */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '1.5rem' }}>
              <div style={{ position: 'relative', flex: '1 1 200px' }}>
                <svg width="16" height="16" fill="none" stroke="#9ca3af" viewBox="0 0 24 24" style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)' }}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                <input type="text" placeholder="Search lecturer by name" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} style={inputStyle} onFocus={(e) => e.target.style.borderColor = '#2563eb'} onBlur={(e) => e.target.style.borderColor = '#e5e7eb'} />
              </div>
              <select value={deptFilter} onChange={(e) => setDeptFilter(e.target.value)} style={{ padding: '0.625rem 0.75rem', border: '1px solid #e5e7eb', borderRadius: '0.75rem', fontSize: '0.875rem', background: '#fff', color: deptFilter ? '#111827' : '#9ca3af', outline: 'none', minWidth: '140px' }}>
                <option value="">Department</option>
                {departments.map(d => <option key={d} value={d} style={{ color: '#111827' }}>{d}</option>)}
              </select>
              <select style={{ padding: '0.625rem 0.75rem', border: '1px solid #e5e7eb', borderRadius: '0.75rem', fontSize: '0.875rem', background: '#fff', color: '#9ca3af', outline: 'none', minWidth: '120px' }}>
                <option value="">Course</option>
              </select>
            </div>

            {/* Lecturer Cards */}
            {fetching ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {[1,2,3].map(i => (
                  <div key={i} className="skeleton" style={{ height: '10rem', borderRadius: '1rem', background: '#fff' }} />
                ))}
              </div>
            ) : filteredLecturers.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '4rem 1rem' }}>
                <p style={{ color: '#6b7280', fontSize: '1rem', fontWeight: 500 }}>{searchQuery || deptFilter ? 'No lecturers match your search' : 'No lecturers available'}</p>
                <p style={{ color: '#9ca3af', fontSize: '0.875rem', marginTop: '0.25rem' }}>{searchQuery || deptFilter ? 'Try different filters' : 'Check back later'}</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {filteredLecturers.map((lecturer) => {
                  const name = lecturer.userId?.name || 'Unknown'
                  const initials = getInitials(name)
                  const color = getAvatarColor(name)
                  return (
                    <div key={lecturer._id} style={{ background: '#fff', borderRadius: '1rem', border: '1px solid #f3f4f6', padding: '1.25rem', transition: 'box-shadow 0.2s' }}
                      onMouseEnter={(e) => e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.06)'}
                      onMouseLeave={(e) => e.currentTarget.style.boxShadow = 'none'}
                    >
                      <div style={{ display: 'flex', gap: '1rem', marginBottom: '0.75rem' }}>
                        <div style={{ width: '3.5rem', height: '3.5rem', borderRadius: '9999px', background: color, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                          <span style={{ color: '#fff', fontWeight: 700, fontSize: '1rem' }}>{initials}</span>
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <h3 style={{ fontWeight: 700, color: '#111827', fontSize: '1rem', marginBottom: '0.125rem' }}>{name}</h3>
                          <p style={{ fontSize: '0.8125rem', color: '#6b7280' }}>{lecturer.department || 'No department'}</p>
                        </div>
                      </div>

                      {/* Specialization tags */}
                      {lecturer.specialization && (
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.375rem', marginBottom: '0.75rem' }}>
                          {lecturer.specialization.split(',').map((spec, i) => (
                            <span key={i} style={{ padding: '0.25rem 0.625rem', background: '#eef2ff', color: '#4338ca', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: 500 }}>{spec.trim()}</span>
                          ))}
                        </div>
                      )}

                      {/* Availability info */}
                      {lecturer.availability && lecturer.availability.length > 0 && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', marginBottom: '0.75rem', fontSize: '0.8125rem', color: '#6b7280' }}>
                          <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                          {lecturer.availability.length} time slot{lecturer.availability.length !== 1 ? 's' : ''} available
                        </div>
                      )}

                      <button onClick={() => openBookingModal(lecturer)} style={{ width: '100%', padding: '0.75rem', background: '#2563eb', color: '#fff', borderRadius: '0.75rem', fontSize: '0.875rem', fontWeight: 600, border: 'none', cursor: 'pointer', transition: 'background 0.2s' }}
                        onMouseEnter={(e) => e.currentTarget.style.background = '#1d4ed8'}
                        onMouseLeave={(e) => e.currentTarget.style.background = '#2563eb'}
                      >Book Consultation</button>
                    </div>
                  )
                })}
              </div>
            )}
          </div>

          {/* Booking Modal */}
          {showModal && selectedLecturer && (
            <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)', zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }} onClick={() => setShowModal(false)}>
              <div style={{ background: '#fff', borderRadius: '1rem', boxShadow: '0 25px 50px rgba(0,0,0,0.25)', width: '100%', maxWidth: '28rem', maxHeight: '90vh', overflowY: 'auto' }} onClick={(e) => e.stopPropagation()}>
                <div style={{ background: 'linear-gradient(to right, #2563eb, #4f46e5)', padding: '1.25rem 1.5rem', color: '#fff', borderRadius: '1rem 1rem 0 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <h2 style={{ fontSize: '1.125rem', fontWeight: 700 }}>Book Consultation</h2>
                    <p style={{ fontSize: '0.875rem', opacity: 0.8 }}>with {selectedLecturer.userId?.name}</p>
                  </div>
                  <button onClick={() => setShowModal(false)} style={{ width: '2rem', height: '2rem', borderRadius: '9999px', background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: 'none', cursor: 'pointer' }}>
                    <svg width="16" height="16" fill="none" stroke="#fff" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                  </button>
                </div>
                <form onSubmit={handleBooking} style={{ padding: '1.5rem' }}>
                  <div style={{ background: '#eff6ff', borderRadius: '0.75rem', padding: '1rem', marginBottom: '1rem' }}>
                    <p style={{ fontSize: '0.875rem', fontWeight: 500, color: '#1d4ed8', marginBottom: '0.5rem' }}>Available Hours</p>
                    {loadingAvailability ? (
                      <p style={{ fontSize: '0.75rem', color: '#2563eb' }}>Loading...</p>
                    ) : lecturerAvailability.length > 0 ? (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                        {['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'].map(day => {
                          const slots = lecturerAvailability.filter(s => s.day === day)
                          if (slots.length === 0) return null
                          return <div key={day} style={{ display: 'flex', gap: '0.5rem', fontSize: '0.75rem', color: '#1d4ed8' }}><span style={{ fontWeight: 600, width: '5rem' }}>{day}</span><span>{slots.map(s => `${s.startTime} - ${s.endTime}`).join(', ')}</span></div>
                        })}
                      </div>
                    ) : (
                      <p style={{ fontSize: '0.75rem', color: '#2563eb' }}>No specific hours set</p>
                    )}
                  </div>
                  <div style={{ marginBottom: '1rem' }}>
                    <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, color: '#374151', marginBottom: '0.375rem' }}>Date & Time</label>
                    <input type="datetime-local" required value={formData.date} onChange={(e) => setFormData({ ...formData, date: e.target.value })} style={{ width: '100%', padding: '0.625rem 0.75rem', border: '1px solid #d1d5db', borderRadius: '0.5rem', fontSize: '0.875rem', outline: 'none' }} />
                  </div>
                  <div style={{ marginBottom: '1rem' }}>
                    <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, color: '#374151', marginBottom: '0.375rem' }}>Topic</label>
                    <textarea required rows={3} value={formData.topic} onChange={(e) => setFormData({ ...formData, topic: e.target.value })} placeholder="What would you like to discuss?" style={{ width: '100%', padding: '0.625rem 0.75rem', border: '1px solid #d1d5db', borderRadius: '0.5rem', fontSize: '0.875rem', outline: 'none', resize: 'none' }} />
                  </div>
                  <div style={{ marginBottom: '1.25rem' }}>
                    <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, color: '#374151', marginBottom: '0.375rem' }}>Meeting Type</label>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                      {['in-person', 'online'].map(type => (
                        <button key={type} type="button" onClick={() => setFormData({ ...formData, meetingType: type })}
                          style={{ padding: '0.625rem', borderRadius: '0.75rem', fontSize: '0.875rem', fontWeight: 500, border: `2px solid ${formData.meetingType === type ? '#2563eb' : '#e5e7eb'}`, background: formData.meetingType === type ? '#eff6ff' : '#fff', color: formData.meetingType === type ? '#1d4ed8' : '#6b7280', cursor: 'pointer', transition: 'all 0.2s' }}>
                          {type === 'in-person' ? '🏢 In Person' : '💻 Online'}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '0.75rem' }}>
                    <button type="submit" disabled={loading} style={{ flex: 1, padding: '0.75rem', background: '#2563eb', color: '#fff', borderRadius: '0.75rem', fontWeight: 600, fontSize: '0.875rem', border: 'none', cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1 }}>
                      {loading ? 'Booking...' : 'Confirm Booking'}
                    </button>
                    <button type="button" onClick={() => { setShowModal(false); setFormData({ date: '', topic: '', meetingType: 'in-person' }) }} style={{ flex: 1, padding: '0.75rem', border: '1px solid #d1d5db', borderRadius: '0.75rem', fontWeight: 500, fontSize: '0.875rem', color: '#374151', background: '#fff', cursor: 'pointer' }}>Cancel</button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Bottom tab spacer */}
          <div className="mobile-bottom-spacer" style={{ display: 'none' }} />
        </main>
      </div>
    </div>
  )
}

export default BrowseLecturers
