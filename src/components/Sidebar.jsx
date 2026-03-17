import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const Sidebar = ({ mobileOpen, onMobileClose }) => {
  const { isStudent } = useAuth()
  const location = useLocation()
  const [collapsed, setCollapsed] = useState(false)

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
    <div className="sidebar-content">
      <button onClick={() => setCollapsed(!collapsed)} className="sidebar-toggle lg-block" style={{ display: 'none' }} title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}>
        <svg style={{ width: '1.25rem', height: '1.25rem', transition: 'transform 0.3s', transform: collapsed ? 'rotate(180deg)' : 'none' }} fill="none" stroke="currentColor" strokeWidth={3} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
        </svg>
      </button>

      <button onClick={onMobileClose} className="sidebar-close lg-hidden" aria-label="Close sidebar">
        <svg style={{ width: '1.25rem', height: '1.25rem' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      {!collapsed && (
        <h2 className="sidebar-label">{isStudent ? 'Student Portal' : 'Lecturer Portal'}</h2>
      )}

      <nav className="space-y-1">
        {links.map((link) => {
          const isActive = location.pathname === link.path
          return (
            <Link key={link.path} to={link.path} title={collapsed ? link.label : ''} className={`sidebar-link ${isActive ? 'active' : ''} ${collapsed ? 'collapsed' : ''}`}>
              <span className="sidebar-link-icon">{link.icon}</span>
              {!collapsed && <span className="sidebar-link-text">{link.label}</span>}
            </Link>
          )
        })}
      </nav>
    </div>
  )

  return (
    <>
      {mobileOpen && <div className="sidebar-overlay lg-hidden" onClick={onMobileClose} />}
      <aside className={`sidebar-mobile ${mobileOpen ? 'open' : ''}`}>{sidebarContent}</aside>
      <aside className={`sidebar-desktop ${collapsed ? 'collapsed' : ''}`} style={{ display: 'none' }}>
        <style>{`@media (min-width: 1024px) { .sidebar-desktop { display: block !important; } .sidebar-toggle { display: flex !important; } .sidebar-close { display: none !important; } }`}</style>
        {sidebarContent}
      </aside>
    </>
  )
}

export default Sidebar
