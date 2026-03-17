import { useState, useEffect } from 'react'
import { lecturerAPI } from '../../services/api'
import toast from 'react-hot-toast'
import Navbar from '../../components/Navbar'
import Sidebar from '../../components/Sidebar'

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']

const Schedule = () => {
  const [schedule, setSchedule] = useState([])
  const [availability, setAvailability] = useState([])
  const [loading, setLoading] = useState(true)
  const [progress, setProgress] = useState(0)
  const [saving, setSaving] = useState(false)
  const [newSlot, setNewSlot] = useState({ day: 'Monday', startTime: '09:00', endTime: '10:00' })
  const [activeTab, setActiveTab] = useState('availability')
  const [sidebarOpen, setSidebarOpen] = useState(false)

  useEffect(() => { fetchData() }, [])

  const fetchData = async () => {
    setProgress(10)
    const timer1 = setTimeout(() => setProgress(40), 200)
    const timer2 = setTimeout(() => setProgress(70), 500)
    try {
      const [scheduleRes, profileRes] = await Promise.all([
        lecturerAPI.getSchedule(),
        lecturerAPI.getProfile()
      ])
      setProgress(90)
      if (scheduleRes.data.success) setSchedule(scheduleRes.data.schedule)
      if (profileRes.data.success) setAvailability(profileRes.data.lecturer.availability || [])
    } catch (error) { console.error('Failed to fetch data', error) }
    clearTimeout(timer1)
    clearTimeout(timer2)
    setProgress(100)
    setTimeout(() => setLoading(false), 300)
  }

  const addSlot = () => {
    if (newSlot.startTime >= newSlot.endTime) { toast.error('End time must be after start time'); return }
    const duplicate = availability.some(s => s.day === newSlot.day && s.startTime === newSlot.startTime && s.endTime === newSlot.endTime)
    if (duplicate) { toast.error('This slot already exists'); return }
    setAvailability([...availability, { ...newSlot }])
  }

  const removeSlot = (index) => { setAvailability(availability.filter((_, i) => i !== index)) }

  const saveAvailability = async () => {
    setSaving(true)
    try {
      const { data } = await lecturerAPI.updateProfile({ availability })
      if (data.success) toast.success('Availability saved')
      else toast.error(data.message)
    } catch (error) { toast.error('Failed to save availability') }
    setSaving(false)
  }

  const groupedAvailability = DAYS.reduce((acc, day) => {
    const slots = availability.filter(s => s.day === day)
    if (slots.length > 0) acc[day] = slots
    return acc
  }, {})

  if (loading) return (
    <div className="min-h-screen bg-gradient-main">
      <Navbar onMenuToggle={() => setSidebarOpen(!sidebarOpen)} />
      <div className="page-layout">
        <Sidebar mobileOpen={sidebarOpen} onMobileClose={() => setSidebarOpen(false)} />
        <main className="page-main">
          <div style={{ maxWidth: '24rem', margin: '4rem auto', textAlign: 'center' }}>
            <p style={{ marginBottom: '1rem', fontWeight: 600, color: 'var(--gray-600)' }}>Loading schedule...</p>
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
          <div style={{ maxWidth: '56rem' }}>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--gray-900)', marginBottom: '0.5rem' }}>Schedule & Availability</h1>
            <p style={{ color: 'var(--gray-500)', fontSize: '0.875rem', marginBottom: '1.5rem' }}>Set your available hours so students can book within those times</p>

            {/* Tabs */}
            <div className="tab-container" style={{ marginBottom: '1.5rem' }}>
              <button onClick={() => setActiveTab('availability')} className={`tab-btn ${activeTab === 'availability' ? 'active' : ''}`}>
                My Availability
              </button>
              <button onClick={() => setActiveTab('appointments')} className={`tab-btn ${activeTab === 'appointments' ? 'active' : ''}`}>
                Upcoming Appointments
              </button>
            </div>

            {activeTab === 'availability' ? (
              <div className="space-y-6">
                {/* Add Slot */}
                <div className="card" style={{ borderRadius: '1rem', padding: '1.5rem' }}>
                  <h2 style={{ fontSize: '1.125rem', fontWeight: 600, color: 'var(--gray-900)', marginBottom: '1rem' }}>Add Available Time Slot</h2>
                  <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'flex-end', gap: '1rem' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, color: 'var(--gray-700)', marginBottom: '0.375rem' }}>Day</label>
                      <select value={newSlot.day} onChange={(e) => setNewSlot({ ...newSlot, day: e.target.value })} className="input" style={{ borderRadius: '0.75rem', width: 'auto' }}>
                        {DAYS.map(d => <option key={d} value={d}>{d}</option>)}
                      </select>
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, color: 'var(--gray-700)', marginBottom: '0.375rem' }}>Start Time</label>
                      <input type="time" value={newSlot.startTime} onChange={(e) => setNewSlot({ ...newSlot, startTime: e.target.value })} className="input" style={{ borderRadius: '0.75rem', width: 'auto' }} />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, color: 'var(--gray-700)', marginBottom: '0.375rem' }}>End Time</label>
                      <input type="time" value={newSlot.endTime} onChange={(e) => setNewSlot({ ...newSlot, endTime: e.target.value })} className="input" style={{ borderRadius: '0.75rem', width: 'auto' }} />
                    </div>
                    <button onClick={addSlot} className="btn btn-primary" style={{ fontSize: '0.875rem', padding: '0.625rem 1.25rem', borderRadius: '0.75rem' }}>
                      Add Slot
                    </button>
                  </div>
                </div>

                {/* Current Availability */}
                <div className="card" style={{ borderRadius: '1rem', padding: '1.5rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                    <h2 style={{ fontSize: '1.125rem', fontWeight: 600, color: 'var(--gray-900)' }}>Your Available Hours</h2>
                    <button onClick={saveAvailability} disabled={saving} className="btn-gradient" style={{ opacity: saving ? 0.5 : 1 }}>
                      {saving ? 'Saving...' : 'Save Changes'}
                    </button>
                  </div>

                  {Object.keys(groupedAvailability).length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '2.5rem 0' }}>
                      <div style={{ width: '4rem', height: '4rem', background: 'var(--gray-100)', borderRadius: '9999px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 0.75rem' }}>
                        <svg style={{ width: '2rem', height: '2rem', color: 'var(--gray-400)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <p style={{ color: 'var(--gray-500)', fontSize: '0.875rem' }}>No availability set yet. Add your available time slots above.</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {DAYS.map(day => {
                        const slots = groupedAvailability[day]
                        if (!slots) return null
                        return (
                          <div key={day} style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem', padding: '0.75rem', background: 'var(--gray-50)', borderRadius: '0.75rem' }}>
                            <span style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--gray-700)', width: '6rem', paddingTop: '0.25rem' }}>{day}</span>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', flex: 1 }}>
                              {slots.map((slot, i) => {
                                const globalIndex = availability.findIndex(s => s.day === slot.day && s.startTime === slot.startTime && s.endTime === slot.endTime)
                                return (
                                  <span key={i} className="slot-tag">
                                    {slot.startTime} - {slot.endTime}
                                    <button onClick={() => removeSlot(globalIndex)}>
                                      <svg style={{ width: '0.875rem', height: '0.875rem' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                      </svg>
                                    </button>
                                  </span>
                                )
                              })}
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  )}
                </div>
              </div>
            ) : (
              /* Appointments Tab */
              schedule.length > 0 ? (
                <div className="space-y-4">
                  {schedule.map((apt) => (
                    <div key={apt._id} className="card" style={{ borderRadius: '1rem', padding: '1.25rem', borderLeft: '4px solid var(--green-600)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <div>
                          <h3 style={{ fontWeight: 600, color: 'var(--gray-900)' }}>{apt.studentId?.name}</h3>
                          <p style={{ color: 'var(--gray-500)', fontSize: '0.875rem', marginTop: '0.25rem' }}>📅 {new Date(apt.date).toLocaleString()}</p>
                          <p style={{ color: 'var(--gray-500)', fontSize: '0.875rem' }}>📝 {apt.topic || 'No topic specified'}</p>
                          <p style={{ color: 'var(--gray-500)', fontSize: '0.875rem' }}>📧 {apt.studentId?.email}</p>
                        </div>
                        <span className="badge badge-approved">APPROVED</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="card" style={{ borderRadius: '1rem', textAlign: 'center', padding: '3rem 1.5rem' }}>
                  <p style={{ color: 'var(--gray-500)' }}>No scheduled appointments</p>
                </div>
              )
            )}
          </div>
        </main>
      </div>
    </div>
  )
}

export default Schedule
