import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { authAPI } from '../services/api'
import toast from 'react-hot-toast'
import Navbar from '../components/Navbar'
import Sidebar from '../components/Sidebar'

const ChangePassword = () => {
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPasswords, setShowPasswords] = useState(false)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (newPassword !== confirmPassword) { toast.error('New passwords do not match'); return }
    if (newPassword.length < 8) { toast.error('Password must be at least 8 characters'); return }
    setLoading(true)
    try {
      const { data } = await authAPI.changePassword(currentPassword, newPassword)
      if (data.success) {
        toast.success('Password changed successfully')
        setSuccess(true)
        setCurrentPassword(''); setNewPassword(''); setConfirmPassword('')
      } else { toast.error(data.message) }
    } catch (error) { toast.error('Failed to change password') }
    setLoading(false)
  }

  const EyeIcon = ({ show }) => show ? (
    <svg style={{ width: '1.25rem', height: '1.25rem' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
    </svg>
  ) : (
    <svg style={{ width: '1.25rem', height: '1.25rem' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
    </svg>
  )

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc' }} className="mobile-overflow-fix">
      <Navbar onMenuToggle={() => setSidebarOpen(!sidebarOpen)} />
      <div style={{ display: 'flex' }}>
        <Sidebar mobileOpen={sidebarOpen} onMobileClose={() => setSidebarOpen(false)} />
        <main style={{ flex: 1, padding: '1.5rem', overflow: 'hidden' }}>
          <div style={{ maxWidth: '32rem', margin: '0 auto' }}>
            <button onClick={() => navigate(-1)} className="back-btn">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
              Back
            </button>
            <div style={{ background: '#fff', borderRadius: '1rem', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)', border: '1px solid var(--gray-100)', overflow: 'hidden' }}>
              {/* Header */}
              <div style={{ background: 'linear-gradient(to right, var(--blue-600), var(--indigo-600))', padding: '1.25rem 1.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div style={{ width: '2.5rem', height: '2.5rem', background: 'rgba(255,255,255,0.2)', borderRadius: '0.75rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <svg style={{ width: '1.25rem', height: '1.25rem', color: '#fff' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                    </svg>
                  </div>
                  <div>
                    <h1 style={{ fontSize: '1.125rem', fontWeight: 700, color: '#fff' }}>Change Password</h1>
                    <p style={{ color: 'var(--blue-100)', fontSize: '0.875rem' }}>Update your account password</p>
                  </div>
                </div>
              </div>

              {/* Body */}
              <div style={{ padding: '1.5rem' }}>
                {success ? (
                  <div style={{ textAlign: 'center', padding: '2rem 0' }}>
                    <div style={{ width: '4rem', height: '4rem', background: 'var(--green-100)', borderRadius: '9999px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem' }}>
                      <svg style={{ width: '2rem', height: '2rem', color: 'var(--green-600)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <h3 style={{ fontSize: '1.125rem', fontWeight: 700, color: 'var(--gray-900)', marginBottom: '0.25rem' }}>Password Changed</h3>
                    <p style={{ fontSize: '0.875rem', color: 'var(--gray-500)' }}>A confirmation email has been sent to your inbox.</p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                      <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, color: 'var(--gray-700)', marginBottom: '0.375rem' }}>Current Password</label>
                      <input type={showPasswords ? 'text' : 'password'} required placeholder="Enter current password" className="input" style={{ borderRadius: '0.75rem', padding: '0.75rem 1rem' }} value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} />
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, color: 'var(--gray-700)', marginBottom: '0.375rem' }}>New Password</label>
                      <input type={showPasswords ? 'text' : 'password'} required placeholder="Enter new password (min 8 characters)" className="input" style={{ borderRadius: '0.75rem', padding: '0.75rem 1rem' }} value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, color: 'var(--gray-700)', marginBottom: '0.375rem' }}>Confirm New Password</label>
                      <input type={showPasswords ? 'text' : 'password'} required placeholder="Confirm new password" className="input" style={{ borderRadius: '0.75rem', padding: '0.75rem 1rem' }} value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
                      {confirmPassword && newPassword !== confirmPassword && (
                        <p style={{ color: 'var(--red-500)', fontSize: '0.75rem', marginTop: '0.375rem' }}>Passwords do not match</p>
                      )}
                    </div>

                    {/* Show/Hide toggle */}
                    <button type="button" onClick={() => setShowPasswords(!showPasswords)} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', color: 'var(--gray-500)', transition: 'color 0.2s' }}>
                      <EyeIcon show={showPasswords} />
                      {showPasswords ? 'Hide passwords' : 'Show passwords'}
                    </button>

                    <button type="submit" disabled={loading || (confirmPassword && newPassword !== confirmPassword)} className="btn-gradient" style={{ width: '100%', opacity: (loading || (confirmPassword && newPassword !== confirmPassword)) ? 0.5 : 1, cursor: loading ? 'not-allowed' : 'pointer' }}>
                      {loading ? (
                        <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                          <svg className="animate-spin" style={{ height: '1rem', width: '1rem' }} viewBox="0 0 24 24">
                            <circle style={{ opacity: 0.25 }} cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                            <path style={{ opacity: 0.75 }} fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                          </svg>
                          Changing...
                        </span>
                      ) : 'Change Password'}
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
          <div className="mobile-bottom-spacer" style={{ display: 'none' }} />
        </main>
      </div>
    </div>
  )
}

export default ChangePassword
