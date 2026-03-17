import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { studentAPI } from '../../services/api'
import { useAuth } from '../../context/AuthContext'
import Navbar from '../../components/Navbar'
import Sidebar from '../../components/Sidebar'

const Dashboard = () => {
  const { user } = useAuth()
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [sidebarOpen, setSidebarOpen] = useState(false)

  useEffect(() => { fetchDashboard() }, [])

  const fetchDashboard = async () => {
    try {
      const { data } = await studentAPI.getDashboard()
      if (data.success) setStats(data.dashData)
    } catch (error) {
      console.error('Failed to fetch dashboard', error)
    }
    setLoading(false)
  }

  const getGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return 'Good morning'
    if (hour < 17) return 'Good afternoon'
    return 'Good evening'
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/40">
        <Navbar onMenuToggle={() => setSidebarOpen(!sidebarOpen)} />
        <div className="flex">
          <Sidebar mobileOpen={sidebarOpen} onMobileClose={() => setSidebarOpen(false)} />
          <main className="flex-1 p-4 sm:p-6 lg:p-8">
            <div className="animate-pulse space-y-6">
              <div className="h-8 bg-gray-200 rounded w-1/3" />
              <div className="grid md:grid-cols-3 gap-6">
                {[1, 2, 3].map(i => (
                  <div key={i} className="bg-white rounded-2xl p-6 h-32">
                    <div className="h-4 bg-gray-200 rounded w-1/2 mb-3" />
                    <div className="h-8 bg-gray-200 rounded w-1/4" />
                  </div>
                ))}
              </div>
              <div className="grid md:grid-cols-2 gap-6">
                {[1, 2].map(i => (
                  <div key={i} className="bg-white rounded-2xl p-6 h-24">
                    <div className="h-4 bg-gray-200 rounded w-2/3" />
                  </div>
                ))}
              </div>
            </div>
          </main>
        </div>
      </div>
    )
  }

  const statCards = [
    {
      label: 'Total Appointments',
      value: stats?.totalAppointments || 0,
      color: 'blue',
      icon: (
        <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      )
    },
    {
      label: 'Pending',
      value: stats?.pendingAppointments || 0,
      color: 'amber',
      icon: (
        <svg className="w-6 h-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    },
    {
      label: 'Approved',
      value: stats?.approvedAppointments || 0,
      color: 'green',
      icon: (
        <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    }
  ]

  const colorMap = {
    blue: { bg: 'bg-blue-50', border: 'border-blue-100', iconBg: 'bg-blue-100', text: 'text-blue-700' },
    amber: { bg: 'bg-amber-50', border: 'border-amber-100', iconBg: 'bg-amber-100', text: 'text-amber-700' },
    green: { bg: 'bg-green-50', border: 'border-green-100', iconBg: 'bg-green-100', text: 'text-green-700' }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/40">
      <Navbar onMenuToggle={() => setSidebarOpen(!sidebarOpen)} />
      <div className="flex">
        <Sidebar mobileOpen={sidebarOpen} onMobileClose={() => setSidebarOpen(false)} />
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          <div className="max-w-6xl">
            {/* Welcome Header */}
            <div className="mb-8">
              <h1 className="text-2xl font-bold text-gray-900">
                {getGreeting()}, {user?.name?.split(' ')[0] || 'Student'} 👋
              </h1>
              <p className="text-gray-500 mt-1">Here's an overview of your consultations</p>
            </div>

            {/* Stats Cards */}
            <div className="grid md:grid-cols-3 gap-5 mb-8">
              {statCards.map((stat) => {
                const c = colorMap[stat.color]
                return (
                  <div key={stat.label} className={`${c.bg} border ${c.border} rounded-2xl p-5 transition-all hover:shadow-md`}>
                    <div className="flex items-center justify-between mb-3">
                      <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                      <div className={`w-10 h-10 ${c.iconBg} rounded-xl flex items-center justify-center`}>
                        {stat.icon}
                      </div>
                    </div>
                    <p className={`text-3xl font-bold ${c.text}`}>{stat.value}</p>
                  </div>
                )
              })}
            </div>

            {/* Quick Actions */}
            <div className="grid md:grid-cols-2 gap-5 mb-8">
              <Link to="/student/lecturers" className="group bg-white border border-gray-200 rounded-2xl p-5 hover:shadow-md hover:border-blue-200 transition-all">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">Find Lecturers</h3>
                    <p className="text-sm text-gray-500">Browse and book consultations</p>
                  </div>
                  <svg className="w-5 h-5 text-gray-400 group-hover:text-blue-500 group-hover:translate-x-1 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </Link>

              <Link to="/student/appointments" className="group bg-white border border-gray-200 rounded-2xl p-5 hover:shadow-md hover:border-green-200 transition-all">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">My Appointments</h3>
                    <p className="text-sm text-gray-500">View and manage your bookings</p>
                  </div>
                  <svg className="w-5 h-5 text-gray-400 group-hover:text-green-500 group-hover:translate-x-1 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </Link>
            </div>

            {/* Recent Appointments */}
            <div className="bg-white border border-gray-200 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-lg font-bold text-gray-900">Recent Appointments</h2>
                {stats?.latestAppointments?.length > 0 && (
                  <Link to="/student/appointments" className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                    View all →
                  </Link>
                )}
              </div>
              {stats?.latestAppointments?.length > 0 ? (
                <div className="space-y-3">
                  {stats.latestAppointments.map((apt) => (
                    <div key={apt._id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                          <span className="text-white text-sm font-bold">
                            {(apt.lecturerId?.name || 'L').charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900 text-sm">{apt.lecturerId?.name || 'Lecturer'}</p>
                          <p className="text-xs text-gray-500">
                            {new Date(apt.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                            {' · '}
                            {new Date(apt.date).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                          </p>
                          {apt.topic && <p className="text-xs text-gray-400 mt-0.5 truncate max-w-xs">{apt.topic}</p>}
                        </div>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        apt.status === 'APPROVED' ? 'bg-green-100 text-green-700' :
                        apt.status === 'PENDING' ? 'bg-amber-100 text-amber-700' :
                        'bg-red-100 text-red-700'
                      }`}>
                        {apt.status.charAt(0) + apt.status.slice(1).toLowerCase()}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <p className="text-gray-500 mb-1">No appointments yet</p>
                  <p className="text-sm text-gray-400 mb-5">Book your first consultation to get started</p>
                  <Link to="/student/lecturers" className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-700 transition-colors">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Book Consultation
                  </Link>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

export default Dashboard