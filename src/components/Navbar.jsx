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
      <nav className="bg-gradient-to-r from-blue-700 to-indigo-700 shadow-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              {/* Hamburger - only shows on mobile when authenticated (pages with sidebar) */}
              {isAuthenticated && onMenuToggle && (
                <button
                  onClick={onMenuToggle}
                  className="lg:hidden p-2 -ml-2 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-colors"
                  aria-label="Toggle menu"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </button>
              )}
              <Link to="/" className="flex items-center space-x-2.5">
                <div className="w-9 h-9 bg-white/20 rounded-lg flex items-center justify-center">
                  <span className="text-white font-extrabold text-lg">U</span>
                </div>
                <span className="text-lg font-bold text-white tracking-tight">UniConsult</span>
              </Link>
            </div>

            <div className="flex items-center space-x-3 sm:space-x-5">
              {isAuthenticated ? (
                <>
                  <span className="text-[13px] font-medium text-blue-100 hidden sm:inline">{user?.name}</span>
                  <Link
                    to={user?.role === 'STUDENT' ? '/student/dashboard' : '/lecturer/dashboard'}
                    className="text-[13px] font-medium text-white/80 hover:text-white transition-colors hidden sm:inline"
                  >
                    Dashboard
                  </Link>
                  <button
                    onClick={() => setShowLogoutModal(true)}
                    className="text-[13px] px-4 py-1.5 bg-white/15 text-white rounded-lg hover:bg-white/25 transition-colors font-semibold"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" className="text-[13px] font-medium text-white/80 hover:text-white transition-colors">Login</Link>
                  <Link to="/register" className="text-[13px] px-4 py-1.5 bg-white text-blue-700 rounded-lg hover:bg-blue-50 transition-colors font-bold">Get Started</Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Logout Confirmation Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-[60] flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-sm w-full p-6 animate-in">
            <div className="flex justify-center mb-4">
              <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center">
                <svg className="w-7 h-7 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
              </div>
            </div>
            <h3 className="text-lg font-bold text-gray-900 text-center mb-1">Log Out</h3>
            <p className="text-sm text-gray-500 text-center mb-6">
              Are you sure you want to log out of your account?
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowLogoutModal(false)}
                className="flex-1 py-2.5 border border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors text-sm"
              >
                Cancel
              </button>
              <button
                onClick={handleLogout}
                className="flex-1 py-2.5 bg-red-600 text-white rounded-xl font-medium hover:bg-red-700 transition-colors text-sm"
              >
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