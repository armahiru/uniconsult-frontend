import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const Navbar = ({ onMenuToggle }) => {
  const { user, logout, isAuthenticated } = useAuth()
  const [showLogoutModal, setShowLogoutModal] = useState(false)
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <>
      <nav className="navbar">
        <div className="navbar-inner">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            {isAuthenticated && onMenuToggle && (
              <button onClick={onMenuToggle} className="hamburger-btn lg-hidden" aria-label="Toggle menu">
                <svg style={{ width: '1.5rem', height: '1.5rem' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            )}
            <Link to="/" className="navbar-logo">
              <div className="navbar-logo-icon"><span>U</span></div>
              <span className="navbar-logo-text">UniConsult</span>
            </Link>
          </div>

          <div className="navbar-actions">
            {isAuthenticated ? (
              <>
                <span className="navbar-user-name sm-hidden">{user?.name}</span>
                <Link to={user?.role === 'STUDENT' ? '/student/dashboard' : '/lecturer/dashboard'} className="navbar-link sm-hidden">
                  Dashboard
                </Link>
                <button onClick={() => setShowLogoutModal(true)} className="navbar-btn-logout">Logout</button>
              </>
            ) : (
              <>
                <Link to="/login" className="navbar-link">Login</Link>
                <Link to="/register" className="navbar-btn-start">Get Started</Link>
              </>
            )}
          </div>
        </div>
      </nav>

      {showLogoutModal && (
        <div className="modal-overlay" style={{ zIndex: 60 }}>
          <div className="modal-card" style={{ maxWidth: '24rem', padding: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1rem' }}>
              <div style={{ width: '3.5rem', height: '3.5rem', background: 'var(--red-100)', borderRadius: '9999px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg style={{ width: '1.75rem', height: '1.75rem', color: 'var(--red-600)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
              </div>
            </div>
            <h3 style={{ fontSize: '1.125rem', fontWeight: 700, color: 'var(--gray-900)', textAlign: 'center', marginBottom: '0.25rem' }}>Log Out</h3>
            <p style={{ fontSize: '0.875rem', color: 'var(--gray-500)', textAlign: 'center', marginBottom: '1.5rem' }}>
              Are you sure you want to log out of your account?
            </p>
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button onClick={() => setShowLogoutModal(false)} style={{ flex: 1, padding: '0.625rem', border: '1px solid var(--gray-300)', color: 'var(--gray-700)', borderRadius: '0.75rem', fontWeight: 500, fontSize: '0.875rem', transition: 'background 0.2s' }}>
                Cancel
              </button>
              <button onClick={handleLogout} style={{ flex: 1, padding: '0.625rem', background: 'var(--red-600)', color: '#fff', borderRadius: '0.75rem', fontWeight: 500, fontSize: '0.875rem', transition: 'background 0.2s' }}>
                Log Out
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default Navbar
