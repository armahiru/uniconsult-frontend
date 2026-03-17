import { useState } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { authAPI } from '../services/api'
import toast from 'react-hot-toast'
import Navbar from '../components/Navbar'

const ResetPassword = () => {
  const [searchParams] = useSearchParams()
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (password !== confirmPassword) { toast.error('Passwords do not match'); return }
    if (password.length < 6) { toast.error('Password must be at least 6 characters'); return }
    const token = searchParams.get('token')
    if (!token) { toast.error('Invalid reset link'); return }
    setLoading(true)
    try {
      const { data } = await authAPI.resetPassword(token, password)
      if (data.success) { toast.success('Password reset successful'); navigate('/login') }
      else { toast.error(data.message) }
    } catch (error) { toast.error('Failed to reset password') }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-gradient-blue">
      <Navbar />
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '4rem 1rem' }}>
        <div style={{ maxWidth: '28rem', width: '100%' }}>
          <div style={{ background: '#fff', borderRadius: '1rem', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)', border: '1px solid var(--gray-100)', padding: '2rem' }}>
            {/* Icon */}
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.5rem' }}>
              <div style={{ width: '4rem', height: '4rem', background: 'var(--indigo-100)', borderRadius: '9999px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg style={{ width: '2rem', height: '2rem', color: 'var(--indigo-600)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                </svg>
              </div>
            </div>

            <h2 style={{ fontSize: '1.5rem', fontWeight: 700, textAlign: 'center', color: 'var(--gray-900)', marginBottom: '0.5rem' }}>Create New Password</h2>
            <p style={{ textAlign: 'center', color: 'var(--gray-500)', fontSize: '0.875rem', marginBottom: '2rem' }}>
              Your new password must be at least 6 characters
            </p>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, color: 'var(--gray-700)', marginBottom: '0.375rem' }}>New Password</label>
                <div className="password-wrapper">
                  <input type={showPassword ? 'text' : 'password'} required placeholder="Enter new password" className="input" style={{ borderRadius: '0.75rem', padding: '0.75rem 3rem 0.75rem 1rem' }} value={password} onChange={(e) => setPassword(e.target.value)} />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="password-toggle" aria-label={showPassword ? 'Hide password' : 'Show password'}>
                    {showPassword ? (
                      <svg style={{ width: '1.25rem', height: '1.25rem' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                      </svg>
                    ) : (
                      <svg style={{ width: '1.25rem', height: '1.25rem' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, color: 'var(--gray-700)', marginBottom: '0.375rem' }}>Confirm Password</label>
                <input type={showPassword ? 'text' : 'password'} required placeholder="Confirm new password" className="input" style={{ borderRadius: '0.75rem', padding: '0.75rem 1rem' }} value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
                {confirmPassword && password !== confirmPassword && (
                  <p style={{ color: 'var(--red-500)', fontSize: '0.75rem', marginTop: '0.375rem' }}>Passwords do not match</p>
                )}
              </div>
              <button type="submit" disabled={loading || (confirmPassword && password !== confirmPassword)} className="btn btn-primary" style={{ width: '100%', borderRadius: '0.75rem', fontSize: '0.875rem', opacity: (loading || (confirmPassword && password !== confirmPassword)) ? 0.5 : 1, cursor: loading ? 'not-allowed' : 'pointer' }}>
                {loading ? (
                  <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                    <svg className="animate-spin" style={{ height: '1rem', width: '1rem' }} viewBox="0 0 24 24">
                      <circle style={{ opacity: 0.25 }} cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path style={{ opacity: 0.75 }} fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Resetting...
                  </span>
                ) : 'Reset Password'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ResetPassword
