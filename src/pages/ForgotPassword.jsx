import { useState } from 'react'
import { Link } from 'react-router-dom'
import { authAPI } from '../services/api'
import toast from 'react-hot-toast'
import Navbar from '../components/Navbar'

const ForgotPassword = () => {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const { data } = await authAPI.forgotPassword(email)
      if (data.success) {
        setSent(true)
        toast.success('Password reset link sent to your email')
      } else { toast.error(data.message) }
    } catch (error) { toast.error('Failed to send reset link') }
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
              <div style={{ width: '4rem', height: '4rem', background: 'var(--blue-100)', borderRadius: '9999px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg style={{ width: '2rem', height: '2rem', color: 'var(--blue-600)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
            </div>

            <h2 style={{ fontSize: '1.5rem', fontWeight: 700, textAlign: 'center', color: 'var(--gray-900)', marginBottom: '0.5rem' }}>Reset Password</h2>
            <p style={{ textAlign: 'center', color: 'var(--gray-500)', fontSize: '0.875rem', marginBottom: '2rem' }}>
              {!sent ? "Enter your email and we'll send you a reset link" : "Check your inbox for the reset link"}
            </p>

            {!sent ? (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, color: 'var(--gray-700)', marginBottom: '0.375rem' }}>Email Address</label>
                  <input type="email" required placeholder="you@example.com" className="input" style={{ borderRadius: '0.75rem', padding: '0.75rem 1rem' }} value={email} onChange={(e) => setEmail(e.target.value)} />
                </div>
                <button type="submit" disabled={loading} className="btn btn-primary" style={{ width: '100%', borderRadius: '0.75rem', fontSize: '0.875rem', opacity: loading ? 0.5 : 1, cursor: loading ? 'not-allowed' : 'pointer' }}>
                  {loading ? (
                    <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                      <svg className="animate-spin" style={{ height: '1rem', width: '1rem' }} viewBox="0 0 24 24">
                        <circle style={{ opacity: 0.25 }} cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path style={{ opacity: 0.75 }} fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      Sending...
                    </span>
                  ) : 'Send Reset Link'}
                </button>
                <Link to="/login" style={{ display: 'block', textAlign: 'center', fontSize: '0.875rem', color: 'var(--gray-500)', marginTop: '1rem', transition: 'color 0.2s' }}>
                  ← Back to Login
                </Link>
              </form>
            ) : (
              <div style={{ textAlign: 'center' }} className="space-y-6">
                <div style={{ width: '5rem', height: '5rem', background: 'var(--green-100)', borderRadius: '9999px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto' }}>
                  <svg style={{ width: '2.5rem', height: '2.5rem', color: 'var(--green-600)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <p style={{ color: 'var(--gray-600)', fontSize: '0.875rem', marginBottom: '0.25rem' }}>We sent a reset link to</p>
                  <p style={{ fontWeight: 600, color: 'var(--gray-900)' }}>{email}</p>
                </div>
                <div className="space-y-3">
                  <button onClick={() => { setSent(false); setEmail('') }} className="btn btn-secondary" style={{ width: '100%', borderRadius: '0.75rem', fontSize: '0.875rem' }}>
                    Try a different email
                  </button>
                  <Link to="/login" className="btn btn-primary" style={{ display: 'block', width: '100%', borderRadius: '0.75rem', fontSize: '0.875rem' }}>
                    Back to Login
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ForgotPassword
