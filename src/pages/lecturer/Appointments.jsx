import { useState, useEffect } from 'react'
import { lecturerAPI } from '../../services/api'
import toast from 'react-hot-toast'
import Navbar from '../../components/Navbar'
import Sidebar from '../../components/Sidebar'

const Appointments = () => {
  const [appointments, setAppointments] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('ALL')
  const [showZoomModal, setShowZoomModal] = useState(false)
  const [selectedAppointment, setSelectedAppointment] = useState(null)
  const [zoomLink, setZoomLink] = useState('')
  const [sidebarOpen, setSidebarOpen] = useState(false)

  useEffect(() => {
    fetchAppointments()
  }, [])

  const fetchAppointments = async () => {
    try {
      const { data } = await lecturerAPI.getAppointments()
      if (data.success) {
        setAppointments(data.appointments)
      }
    } catch (error) {
      toast.error('Failed to fetch appointments')
    }
    setLoading(false)
  }

  const handleApprove = async (id) => {
    try {
      const { data } = await lecturerAPI.approveAppointment(id)
      if (data.success) {
        toast.success('Appointment approved')
        fetchAppointments()
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error('Failed to approve appointment')
    }
  }

  const handleAddZoomLink = (appointment) => {
    setSelectedAppointment(appointment)
    setZoomLink(appointment.zoomLink || '')
    setShowZoomModal(true)
  }

  const handleSaveZoomLink = async () => {
    try {
      const { data } = await lecturerAPI.updateZoomLink(selectedAppointment._id, zoomLink)
      if (data.success) {
        toast.success('Zoom link updated')
        setShowZoomModal(false)
        fetchAppointments()
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error('Failed to update zoom link')
    }
  }

  const handleDecline = async (id) => {
    if (!confirm('Are you sure you want to decline this appointment?')) return
    
    try {
      const { data } = await lecturerAPI.declineAppointment(id)
      if (data.success) {
        toast.success('Appointment declined')
        fetchAppointments()
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error('Failed to decline appointment')
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'PENDING': return 'bg-yellow-100 text-yellow-800'
      case 'APPROVED': return 'bg-green-100 text-green-800'
      case 'DECLINED': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const filteredAppointments = filter === 'ALL' 
    ? appointments 
    : appointments.filter(apt => apt.status === filter)

  if (loading) return <div>Loading...</div>

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar onMenuToggle={() => setSidebarOpen(!sidebarOpen)} />
      <div className="flex">
        <Sidebar mobileOpen={sidebarOpen} onMobileClose={() => setSidebarOpen(false)} />
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          <h1 className="text-3xl font-bold mb-8">Appointments</h1>
          
          <div className="mb-6 flex space-x-2">
            {['ALL', 'PENDING', 'APPROVED', 'DECLINED'].map((status) => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={`px-4 py-2 rounded-lg ${
                  filter === status ? 'bg-primary text-white' : 'bg-white text-gray-700'
                }`}
              >
                {status}
              </button>
            ))}
          </div>

          {filteredAppointments.length > 0 ? (
            <div className="space-y-4">
              {filteredAppointments.map((apt) => (
                <div key={apt._id} className="card">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold mb-2">{apt.studentId?.name}</h3>
                      <p className="text-gray-600 mb-1">📧 {apt.studentId?.email}</p>
                      <p className="text-gray-600 mb-1">📅 {new Date(apt.date).toLocaleString()}</p>
                      <p className="text-gray-600 mb-1">
                        {apt.meetingType === 'online' ? '💻' : '🏢'} 
                        {apt.meetingType === 'online' ? 'Online Meeting' : 'In-Person Meeting'}
                      </p>
                      {apt.meetingType === 'online' && apt.zoomLink && (
                        <p className="text-blue-600 mb-1">
                          🔗 <a href={apt.zoomLink} target="_blank" rel="noopener noreferrer" className="underline">Zoom Link</a>
                        </p>
                      )}
                      <p className="text-gray-600 mb-2">📝 {apt.topic || 'No topic specified'}</p>
                      <span className={`px-3 py-1 rounded-full text-sm ${getStatusColor(apt.status)}`}>
                        {apt.status}
                      </span>
                    </div>
                    {apt.status === 'PENDING' && (
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleApprove(apt._id)}
                          className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => handleDecline(apt._id)}
                          className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
                        >
                          Decline
                        </button>
                      </div>
                    )}
                    {apt.status === 'APPROVED' && apt.meetingType === 'online' && (
                      <button
                        onClick={() => handleAddZoomLink(apt)}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                      >
                        {apt.zoomLink ? 'Update Zoom Link' : 'Add Zoom Link'}
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="card text-center py-12">
              <p className="text-gray-500">No appointments found</p>
            </div>
          )}
        </main>
      </div>

      {/* Zoom Link Modal */}
      {showZoomModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Add Zoom Link</h2>
            <p className="text-gray-600 mb-6">for {selectedAppointment?.studentId?.name}</p>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Zoom Meeting Link
                </label>
                <input
                  type="url"
                  required
                  className="input"
                  value={zoomLink}
                  onChange={(e) => setZoomLink(e.target.value)}
                  placeholder="https://zoom.us/j/..."
                />
              </div>
              
              <div className="flex space-x-3">
                <button 
                  onClick={handleSaveZoomLink}
                  className="btn btn-primary flex-1"
                >
                  Save Link
                </button>
                <button
                  onClick={() => setShowZoomModal(false)}
                  className="btn btn-secondary flex-1"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Appointments
