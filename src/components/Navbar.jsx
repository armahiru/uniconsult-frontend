import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const Navbar = ({ onMenuToggle }) => {
  const { user, logout, isAuthenticated, isStudent } = useAuth()
  const [showLogoutModal, setShowLogoutModal] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const prefix = isStudent ? '/student' : '/lecturer'

  const mobileTabsStudent = [
    { path: '/student/dashboard', label: 'Dashboard', icon: (
      <svg width="22" height="22" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>
    )},
    { path: '/student/appointments', label: 'Bookings', icon: (
      <svg width="22" height="22" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
    )},
    { path: '/student/lecturers', label: 'Lecturers', icon: (
      <svg width="22" height="22" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
    )},
    { path: '/student/profile', label: 'Profile', icon: (
      <svg width="22" height="22" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
    )}
  ]

  const mobileTabsLecturer = [
    { path: '/lecturer/dashboard', label: 'Dashboard', icon: mobileTabsStudent[0].icon },
    { path: '/lecturer/appointments', label: 'Bookings', icon: mobileTabsStudent[1].icon },
    { path: '/lecturer/schedule', label: 'Schedule', icon: (
      <svg width="22" height="22" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
    )},
    { path: '/lecturer/profile', label: 'Profile', icon: mobileTabsStudent[3].icon }
  ]

  const mobileTabs = isStudent ? mobileTabsStudent : mobileTabsLecturer

  return (
    <>
      {/* Top Navbar */}
      <nav style={{ background: '#fff', borderBottom: '1px solid #e5e7eb', position: 'sticky', top: 0, zIndex: 50 }}>
        <div style={{ maxWidth: '80rem', margin: '0 auto', padding: '0 1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: '3.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            {isAuthenticated && onMenuToggle && (
              <button onClick={onMenuToggle} className="lg-hidden" style={{ padding: '0.375rem', color: '#374151', background: 'none', border: 'none', cursor: 'pointer' }} aria-label="Toggle menu">
                <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
              </button>
            )}
            <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none' }}>
              <svg width="28" height="28" viewBox="0 0 48 48" fill="none">
                <path d="M24 4L2 16l22 12 22-12L24 4z" fill="#2563eb"/>
                <path d="M6 22v12c0 0 6 8 18 8s18-8 18-8V22" stroke="#2563eb" strokeWidth="2.5" fill="none"/>
              </svg>
              <span style={{ fontSize: '1.0625rem', fontWeight: 700, color: '#2563eb' }}>UniConsult</span>
            </Link>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            {isAuthenticated ? (
              <>
                <span className="sm-hidden" style={{ fontSize: '0.8125rem', color: '#6b7280' }}>{user?.name}</span>
                <button onClick={() => setShowLogoutModal(true)} style={{ width: '2.25rem', height: '2.25rem', borderRadius: '9999px', background: '#2563eb', display: 'flex', alignItems: 'center', justifyContent: 'center', border: 'none', cursor: 'pointer' }}>
                  <svg width="18" height="18" fill="none" stroke="#fff" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                </button>
              </>
            ) : (
              <>
                <Link to="/login" style={{ fontSize: '0.875rem', fontWeight: 500, color: '#374151' }}>Login</Link>
                <Link to="/register" style={{ fontSize: '0.875rem', fontWeight: 600, color: '#fff', background: '#2563eb', padding: '0.5rem 1rem', borderRadius: '0.5rem' }}>Get Started</Link>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Mobile Bottom Tab Bar */}
      {isAuthenticated && (
        <div className="mobile-bottom-tabs" style={{ position: 'fixed', bottom: 0, left: 0, right: 0, background: '#fff', borderTop: '1px solid #e5e7eb', zIndex: 50, display: 'none', padding: '0.5rem 0 env(safe-area-inset-bottom, 0.25rem)' }}>
          <style>{`@media (max-width: 1023px) { .mobile-bottom-tabs { display: flex !important; } .mobile-bottom-spacer { display: block !important; height: 4.5rem; } }`}</style>
          <div style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center', width: '100%' }}>
            {mobileTabs.map((tab) => {
              const isActive = location.pathname === tab.path
              return (
                <Link key={tab.path} to={tab.path} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.125rem', padding: '0.375rem 0.75rem', color: isActive ? '#2563eb' : '#9ca3af', textDecoration: 'none', transition: 'color 0.2s', minWidth: '4rem' }}>
                  {tab.icon}
                  <span style={{ fontSize: '0.625rem', fontWeight: isActive ? 600 : 500 }}>{tab.label}</span>
                </Link>
              )
            })}
          </div>
        </div>
      )}

      {/* Logout Modal */}
      {showLogoutModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)', zIndex: 60, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
          <div style={{ background: '#fff', borderRadius: '1rem', boxShadow: '0 25px 50px rgba(0,0,0,0.25)', maxWidth: '24rem', width: '100%', padding: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1rem' }}>
              <div style={{ width: '3.5rem', height: '3.5rem', background: '#fee2e2', borderRadius: '9999px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg width="28" height="28" fill="none" stroke="#dc2626" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
              </div>
            </div>
            <h3 style={{ fontSize: '1.125rem', fontWeight: 700, color: '#111827', textAlign: 'center', marginBottom: '0.25rem' }}>Log Out</h3>
            <p style={{ fontSize: '0.875rem', color: '#6b7280', textAlign: 'center', marginBottom: '1.5rem' }}>Are you sure you want to log out?</p>
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button onClick={() => setShowLogoutModal(false)} style={{ flex: 1, padding: '0.625rem', border: '1px solid #d1d5db', color: '#374151', borderRadius: '0.75rem', fontWeight: 500, fontSize: '0.875rem', background: '#fff', cursor: 'pointer' }}>Cancel</button>
              <button onClick={handleLogout} style={{ flex: 1, padding: '0.625rem', background: '#dc2626', color: '#fff', borderRadius: '0.75rem', fontWeight: 500, fontSize: '0.875rem', border: 'none', cursor: 'pointer' }}>Log Out</button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default Navbar
