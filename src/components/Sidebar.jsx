import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const Sidebar = ({ mobileOpen, onMobileClose }) => {
  const { isStudent } = useAuth()
  const location = useLocation()
  const [collapsed, setCollapsed] = useState(false)

  // Close mobile sidebar on route change
  useEffect(() => {
    if (onMobileClose) onMobileClose()
  }, [location.pathname])

  const studentLinks = [
    { path: '/student/dashboard', label: 'Dashboard', icon: '📊' },
    { path: '/student/lecturers', label: 'Find Lecturers', icon: '🔍' },
    { path: '/student/appointments', label: 'My Appointments', icon: '📅' },
    { path: '/student/profile', label: 'Profile', icon: '👤' },
    { path: '/student/change-password', label: 'Change Password', icon: '🔒' }
  ]

  const lecturerLinks = [
    { path: '/lecturer/dashboard', label: 'Dashboard', icon: '📊' },
    { path: '/lecturer/appointments', label: 'Requests', icon: '📬' },
    { path: '/lecturer/schedule', label: 'Schedule', icon: '📅' },
    { path: '/lecturer/profile', label: 'Profile', icon: '👤' },
    { path: '/lecturer/change-password', label: 'Change Password', icon: '🔒' }
  ]

  const links = isStudent ? studentLinks : lecturerLinks

  const sidebarContent = (
    <div className="p-4">
      {/* Toggle Button - desktop only */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="hidden lg:flex w-full items-center justify-center p-2 mb-4 rounded-lg text-gray-900 hover:bg-gray-100 transition-colors"
        title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
      >
        <svg className={`w-5 h-5 transition-transform duration-300 ${collapsed ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" strokeWidth={3} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
        </svg>
      </button>

      {/* Close button - mobile only */}
      <button
        onClick={onMobileClose}
        className="lg:hidden flex items-center justify-center p-2 mb-4 rounded-lg text-gray-900 hover:bg-gray-100 transition-colors ml-auto"
        aria-label="Close sidebar"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      {/* Portal Label */}
      {!collapsed && (
        <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-5 px-2">
          {isStudent ? 'Student Portal' : 'Lecturer Portal'}
        </h2>
      )}

      {/* Nav Links */}
      <nav className="space-y-1">
        {links.map((link) => {
          const isActive = location.pathname === link.path
          return (
            <Link
              key={link.path}
              to={link.path}
              title={collapsed ? link.label : ''}
              className={`flex items-center ${collapsed ? 'justify-center' : 'space-x-3'} px-3 py-2.5 rounded-lg transition-colors text-[13px] ${
                isActive
                  ? 'bg-blue-50 text-blue-700 font-semibold'
                  : 'text-gray-600 hover:bg-gray-50 font-medium'
              }`}
            >
              <span className="text-lg flex-shrink-0">{link.icon}</span>
              {!collapsed && <span className="whitespace-nowrap">{link.label}</span>}
            </Link>
          )
        })}
      </nav>
    </div>
  )

  return (
    <>
      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onMobileClose}
        />
      )}

      {/* Mobile drawer */}
      <aside
        className={`fixed top-0 left-0 h-full w-64 bg-white border-r border-gray-200 z-50 transform transition-transform duration-300 lg:hidden ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {sidebarContent}
      </aside>

      {/* Desktop sidebar */}
      <aside className={`${collapsed ? 'w-20' : 'w-64'} bg-white border-r border-gray-200 min-h-screen flex-shrink-0 transition-all duration-300 hidden lg:block`}>
        {sidebarContent}
      </aside>
    </>
  )
}

export default Sidebar