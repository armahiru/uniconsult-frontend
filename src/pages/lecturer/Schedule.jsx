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
  const [saving, setSaving] = useState(false)
  const [newSlot, setNewSlot] = useState({ day: 'Monday', startTime: '09:00', endTime: '10:00' })
  const [activeTab, setActiveTab] = useState('availability')
  const [sidebarOpen, setSidebarOpen] = useState(false)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [scheduleRes, profileRes] = await Promise.all([
        lecturerAPI.getSchedule(),
        lecturerAPI.getProfile()
      ])
      if (scheduleRes.data.success) setSchedule(scheduleRes.data.schedule)
      if (profileRes.data.success) setAvailability(profileRes.data.lecturer.availability || [])
    } catch (error) {
      console.error('Failed to fetch data', error)
    }
    setLoading(false)
  }

  const addSlot = () => {
    if (newSlot.startTime >= newSlot.endTime) {
      toast.error('End time must be after start time')
      return
    }
    const duplicate = availability.some(
      s => s.day === newSlot.day && s.startTime === newSlot.startTime && s.endTime === newSlot.endTime
    )
    if (duplicate) {
      toast.error('This slot already exists')
      return
    }
    setAvailability([...availability, { ...newSlot }])
  }

  const removeSlot = (index) => {
    setAvailability(availability.filter((_, i) => i !== index))
  }

  const saveAvailability = async () => {
    setSaving(true)
    try {
      const { data } = await lecturerAPI.updateProfile({ availability })
      if (data.success) {
        toast.success('Availability saved')
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error('Failed to save availability')
    }
    setSaving(false)
  }

  const groupedAvailability = DAYS.reduce((acc, day) => {
    const slots = availability.filter(s => s.day === day)
    if (slots.length > 0) acc[day] = slots
    return acc
  }, {})

  if (loading) return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/40">
      <Navbar onMenuToggle={() => setSidebarOpen(!sidebarOpen)} />
      <div className="flex">
        <Sidebar mobileOpen={sidebarOpen} onMobileClose={() => setSidebarOpen(false)} />
        <main className="flex-1 p-4 sm:p-6 lg:p-8"><div className="animate-pulse"><div className="h-8 bg-gray-200 rounded w-48 mb-6" /><div className="h-64 bg-gray-200 rounded-2xl" /></div></main>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/40">
      <Navbar onMenuToggle={() => setSidebarOpen(!sidebarOpen)} />
      <div className="flex">
        <Sidebar mobileOpen={sidebarOpen} onMobileClose={() => setSidebarOpen(false)} />
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          <div className="max-w-4xl">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Schedule & Availability</h1>
            <p className="text-gray-500 text-sm mb-6">Set your available hours so students can book within those times</p>

            {/* Tabs */}
            <div className="flex gap-1 bg-gray-100 rounded-xl p-1 mb-6 w-fit">
              <button
                onClick={() => setActiveTab('availability')}
                className={`px-5 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === 'availability' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
              >
                My Availability
              </button>
              <button
                onClick={() => setActiveTab('appointments')}
                className={`px-5 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === 'appointments' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
              >
                Upcoming Appointments
              </button>
            </div>

            {activeTab === 'availability' ? (
              <div className="space-y-6">
                {/* Add Slot */}
                <div className="bg-white rounded-2xl border border-gray-200 p-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">Add Available Time Slot</h2>
                  <div className="flex flex-wrap items-end gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">Day</label>
                      <select
                        value={newSlot.day}
                        onChange={(e) => setNewSlot({ ...newSlot, day: e.target.value })}
                        className="px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        {DAYS.map(d => <option key={d} value={d}>{d}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">Start Time</label>
                      <input
                        type="time"
                        value={newSlot.startTime}
                        onChange={(e) => setNewSlot({ ...newSlot, startTime: e.target.value })}
                        className="px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">End Time</label>
                      <input
                        type="time"
                        value={newSlot.endTime}
                        onChange={(e) => setNewSlot({ ...newSlot, endTime: e.target.value })}
                        className="px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <button
                      onClick={addSlot}
                      className="px-5 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-semibold hover:bg-blue-700 transition-colors"
                    >
                      Add Slot
                    </button>
                  </div>
                </div>

                {/* Current Availability */}
                <div className="bg-white rounded-2xl border border-gray-200 p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold text-gray-900">Your Available Hours</h2>
                    <button
                      onClick={saveAvailability}
                      disabled={saving}
                      className="px-5 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl text-sm font-semibold hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 transition-all"
                    >
                      {saving ? 'Saving...' : 'Save Changes'}
                    </button>
                  </div>

                  {Object.keys(groupedAvailability).length === 0 ? (
                    <div className="text-center py-10">
                      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                        <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <p className="text-gray-500 text-sm">No availability set yet. Add your available time slots above.</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {DAYS.map(day => {
                        const slots = groupedAvailability[day]
                        if (!slots) return null
                        return (
                          <div key={day} className="flex items-start gap-4 p-3 bg-gray-50 rounded-xl">
                            <span className="text-sm font-semibold text-gray-700 w-24 pt-1">{day}</span>
                            <div className="flex flex-wrap gap-2 flex-1">
                              {slots.map((slot, i) => {
                                const globalIndex = availability.findIndex(
                                  s => s.day === slot.day && s.startTime === slot.startTime && s.endTime === slot.endTime
                                )
                                return (
                                  <span key={i} className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-50 text-blue-700 rounded-lg text-sm font-medium">
                                    {slot.startTime} - {slot.endTime}
                                    <button
                                      onClick={() => removeSlot(globalIndex)}
                                      className="text-blue-400 hover:text-red-500 transition-colors"
                                    >
                                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                    <div key={apt._id} className="bg-white rounded-2xl border border-gray-200 p-5 border-l-4 border-l-green-500">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-semibold text-gray-900">{apt.studentId?.name}</h3>
                          <p className="text-gray-500 text-sm mt-1">📅 {new Date(apt.date).toLocaleString()}</p>
                          <p className="text-gray-500 text-sm">📝 {apt.topic || 'No topic specified'}</p>
                          <p className="text-gray-500 text-sm">📧 {apt.studentId?.email}</p>
                        </div>
                        <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-semibold">APPROVED</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-white rounded-2xl border border-gray-200 text-center py-12">
                  <p className="text-gray-500">No scheduled appointments</p>
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
