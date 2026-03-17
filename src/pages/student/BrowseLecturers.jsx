import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { lecturerAPI, studentAPI } from '../../services/api'
import toast from 'react-hot-toast'
import Navbar from '../../components/Navbar'
import Sidebar from '../../components/Sidebar'

const avatarGradients = [
  'from-violet-500 to-purple-600',
  'from-blue-500 to-cyan-500',
  'from-emerald-500 to-teal-600',
  'from-rose-500 to-pink-600',
  'from-amber-500 to-orange-600',
  'from-indigo-500 to-blue-600',
  'from-fuchsia-500 to-pink-500',
  'from-teal-500 to-green-500',
]

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
    } catch (error) {
      console.error('Failed to fetch availability')
    }
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

  const getInitials = (name) => {
    if (!name) return '?'
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
  }

  const getGradient = (index) => avatarGradients[index % avatarGradients.length]

  const filteredLecturers = lecturers.filter((l) => {
    const q = searchQuery.toLowerCase()
    return (
      l.userId?.name?.toLowerCase().includes(q) ||
      l.department?.toLowerCase().includes(q) ||
      l.specialization?.toLowerCase().includes(q)
    )
  })

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/40">
      <Navbar onMenuToggle={() => setSidebarOpen(!sidebarOpen)} />
      <div className="flex">
        <Sidebar mobileOpen={sidebarOpen} onMobileClose={() => setSidebarOpen(false)} />
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          <div className="max-w-6xl">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Find Lecturers</h1>
                <p className="text-gray-500 text-sm mt-1">Browse available lecturers and book a consultation</p>
              </div>
              {!fetching && lecturers.length > 0 && (
                <div className="relative">
                  <svg className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  <input
                    type="text"
                    placeholder="Search by name, department..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-64 transition-shadow"
                  />
                </div>
              )}
            </div>

            {/* Loading Skeleton */}
            {fetching ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map(i => (
                  <div key={i} className="animate-pulse bg-white rounded-2xl p-6 border border-gray-100">
                    <div className="flex items-center gap-4 mb-5">
                      <div className="w-14 h-14 bg-gray-200 rounded-full" />
                      <div className="space-y-2 flex-1">
                        <div className="h-4 bg-gray-200 rounded-lg w-3/4" />
                        <div className="h-3 bg-gray-200 rounded-lg w-1/2" />
                      </div>
                    </div>
                    <div className="h-3 bg-gray-200 rounded-lg w-2/3 mb-5" />
                    <div className="h-11 bg-gray-200 rounded-xl" />
                  </div>
                ))}
              </div>
            ) : filteredLecturers.length === 0 ? (
              <div className="text-center py-20">
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <p className="text-gray-500 text-lg font-medium">
                  {searchQuery ? 'No lecturers match your search' : 'No lecturers available'}
                </p>
                <p className="text-gray-400 text-sm mt-1">
                  {searchQuery ? 'Try a different search term' : 'Check back later for available lecturers'}
                </p>
              </div>
            ) : (
              <>
                <p className="text-sm text-gray-400 mb-4">{filteredLecturers.length} lecturer{filteredLecturers.length !== 1 ? 's' : ''} available</p>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredLecturers.map((lecturer, index) => (
                    <div key={lecturer._id} className="group bg-white rounded-2xl border border-gray-200 p-6 hover:shadow-lg hover:border-blue-200 transition-all duration-300 relative overflow-hidden">
                      {/* Subtle top accent */}
                      <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${getGradient(index)} opacity-0 group-hover:opacity-100 transition-opacity`} />

                      <div className="flex items-center gap-4 mb-4">
                        <div className={`w-14 h-14 rounded-full bg-gradient-to-br ${getGradient(index)} flex items-center justify-center shadow-md group-hover:scale-105 transition-transform`}>
                          <span className="text-white font-bold text-lg">{getInitials(lecturer.userId?.name)}</span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-gray-900 truncate">{lecturer.userId?.name || 'Unknown'}</h3>
                          {lecturer.department && (
                            <p className="text-sm text-gray-500 flex items-center gap-1.5 truncate">
                              <svg className="w-3.5 h-3.5 flex-shrink-0 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                              </svg>
                              {lecturer.department}
                            </p>
                          )}
                        </div>
                      </div>

                      {lecturer.specialization && (
                        <div className="mb-3">
                          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 text-indigo-700 rounded-lg text-xs font-medium">
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                            </svg>
                            {lecturer.specialization}
                          </span>
                        </div>
                      )}

                      {/* Availability on card */}
                      <div className="mb-4">
                        {lecturer.availability && lecturer.availability.length > 0 ? (
                          <div className="bg-green-50 rounded-lg p-3">
                            <p className="text-xs font-semibold text-green-700 mb-1.5 flex items-center gap-1">
                              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              Available Hours
                            </p>
                            <div className="space-y-0.5">
                              {['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'].map(day => {
                                const slots = lecturer.availability.filter(s => s.day === day)
                                if (slots.length === 0) return null
                                return (
                                  <div key={day} className="flex items-center gap-1.5 text-xs text-green-600">
                                    <span className="font-medium w-14 truncate">{day.slice(0, 3)}</span>
                                    <span>{slots.map(s => `${s.startTime}-${s.endTime}`).join(', ')}</span>
                                  </div>
                                )
                              })}
                            </div>
                          </div>
                        ) : (
                          <p className="text-xs text-gray-400 italic">No availability set yet</p>
                        )}
                      </div>

                      <button
                        onClick={() => openBookingModal(lecturer)}
                        className="w-full py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all text-sm font-semibold shadow-sm hover:shadow-md"
                      >
                        Book Consultation
                      </button>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Booking Modal */}
          {showModal && selectedLecturer && (
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowModal(false)}>
              <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-0 overflow-hidden" onClick={(e) => e.stopPropagation()}>
                {/* Modal Header */}
                <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-5 text-white">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-lg font-bold">Book Consultation</h2>
                      <p className="text-blue-100 text-sm mt-0.5">with {selectedLecturer.userId?.name}</p>
                    </div>
                    <button onClick={() => setShowModal(false)} className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors">
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                </div>

                {/* Modal Body */}
                <form onSubmit={handleBooking} className="p-6 space-y-4">
                  {/* Availability Info */}
                  <div className="bg-blue-50 rounded-xl p-4">
                    <p className="text-sm font-medium text-blue-800 mb-2">Available Hours</p>
                    {loadingAvailability ? (
                      <p className="text-xs text-blue-600">Loading availability...</p>
                    ) : lecturerAvailability.length > 0 ? (
                      <div className="space-y-1">
                        {['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'].map(day => {
                          const slots = lecturerAvailability.filter(s => s.day === day)
                          if (slots.length === 0) return null
                          return (
                            <div key={day} className="flex items-center gap-2 text-xs text-blue-700">
                              <span className="font-semibold w-20">{day}</span>
                              <span>{slots.map(s => `${s.startTime} - ${s.endTime}`).join(', ')}</span>
                            </div>
                          )
                        })}
                      </div>
                    ) : (
                      <p className="text-xs text-blue-600">No specific hours set — any time may work, but the lecturer will confirm.</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Date & Time</label>
                    <input
                      type="datetime-local"
                      required
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm transition-shadow"
                      value={formData.date}
                      onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Topic</label>
                    <textarea
                      required
                      rows={3}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm resize-none transition-shadow"
                      value={formData.topic}
                      onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
                      placeholder="What would you like to discuss?"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Meeting Type</label>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, meetingType: 'in-person' })}
                        className={`flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium border-2 transition-all ${
                          formData.meetingType === 'in-person'
                            ? 'border-blue-600 bg-blue-50 text-blue-700'
                            : 'border-gray-200 text-gray-600 hover:border-gray-300'
                        }`}
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        In Person
                      </button>
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, meetingType: 'online' })}
                        className={`flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium border-2 transition-all ${
                          formData.meetingType === 'online'
                            ? 'border-blue-600 bg-blue-50 text-blue-700'
                            : 'border-gray-200 text-gray-600 hover:border-gray-300'
                        }`}
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                        Online
                      </button>
                    </div>
                  </div>
                  <div className="flex gap-3 pt-2">
                    <button
                      type="submit"
                      disabled={loading}
                      className="flex-1 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm"
                    >
                      {loading ? (
                        <span className="flex items-center justify-center gap-2">
                          <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                          </svg>
                          Booking...
                        </span>
                      ) : 'Confirm Booking'}
                    </button>
                    <button
                      type="button"
                      onClick={() => { setShowModal(false); setFormData({ date: '', topic: '', meetingType: 'in-person' }) }}
                      className="flex-1 py-2.5 border border-gray-300 rounded-xl hover:bg-gray-50 text-sm font-medium text-gray-700 transition-colors"
                    >
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