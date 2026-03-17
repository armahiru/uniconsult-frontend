import { useState, useEffect } from 'react'
import { studentAPI } from '../../services/api'
import toast from 'react-hot-toast'
import Navbar from '../../components/Navbar'
import Sidebar from '../../components/Sidebar'

const MyAppointments = () => {
  const [appointments, setAppointments] = useState([])
  const [loading, setLoading] = useState(true)
  const [sidebarOpen, setSidebarOpen] = useState(false)

  useEffect(() => {
    fetchAppointments()
  }, [])

  const fetchAppointments = async () => {
    try {
      const { data } = await studentAPI.getAppointments()
      if (data.success) {
        setAppointments(data.appointments)
      }
    } catch (error) {
      toast.error('Failed to fetch appointments')
    }
    setLoading(false)
  }

  const handleCancel = async (id) => {
    if (!confirm('Are you sure you want to cancel this appointment?')) return
    
    try {
      const { data } = await studentAPI.cancelAppointment(id)
      if (data.success) {
        toast.success('Appointment cancelled')
        fetchAppointments()
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error('Failed to cancel appointment')
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

  if (loading) return <div>Loading...</div>

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/40">
      <Navbar onMenuToggle={() => setSidebarOpen(!sidebarOpen)} />
      <div className="flex">
        <Sidebar mobileOpen={sidebarOpen} onMobileClose={() => setSidebarOpen(false)} />
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          <h1 className="text-3xl font-bold mb-8">My Appointments</h1>
          
          {appointments.length > 0 ? (
            <div className="space-y-4">
              {appointments.map((apt) => (
                <div key={apt._id} className="card">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold mb-2">{apt.lecturerId?.name}</h3>
                      <p className="text-gray-600 mb-1">📅 {new Date(apt.date).toLocaleString()}</p>
                      <p className="text-gray-600 mb-1">
                        {apt.meetingType === 'online' ? '💻' : '🏢'} 
                        {apt.meetingType === 'online' ? 'Online Meeting' : 'In-Person Meeting'}
                      </p>
                      {apt.meetingType === 'online' && apt.zoomLink && apt.status === 'APPROVED' && (
                        <p className="text-blue-600 mb-1">
                          🔗 <a href={apt.zoomLink} target="_blank" rel="noopener noreferrer" className="underline">Join Zoom Meeting</a>
                        </p>
                      )}
                      <p className="text-gray-600 mb-2">📝 {apt.topic || 'No topic specified'}</p>
                      <span className={`px-3 py-1 rounded-full text-sm ${getStatusColor(apt.status)}`}>
                        {apt.status}
                      </span>
                    </div>
                    {apt.status === 'PENDING' && (
                      <button
                        onClick={() => handleCancel(apt._id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="card text-center py-12">
              <p className="text-gray-500 mb-4">No appointments yet</p>
              <a href="/student/lecturers" className="btn-primary">Browse Lecturers</a>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}

export default MyAppointments
