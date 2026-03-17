import { useEffect, useState } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { authAPI } from '../services/api'
import Navbar from '../components/Navbar'

const VerifyEmail = () => {
  const [searchParams] = useSearchParams()
  const [status, setStatus] = useState('verifying')
  const [message, setMessage] = useState('')
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const token = searchParams.get('token')
    if (token) {
      verifyEmail(token)
    } else {
      setStatus('error')
      setMessage('Invalid verification link')
    }
  }, [searchParams])

  const verifyEmail = async (token) => {
    setProgress(30)
    const timer = setTimeout(() => setProgress(60), 300)
    try {
      const { data } = await authAPI.verifyEmail(token)
      setProgress(90)
      if (data.success) {
        setStatus('success')
        setMessage('Email verified successfully!')
      } else {
        setStatus('error')
        setMessage(data.message)
      }
    } catch (error) {
      setStatus('error')
      setMessage('Verification failed')
    }
    clearTimeout(timer)
    setProgress(100)
  }

  return (
    <div className="min-h-screen bg-gradient-main">
      <Navbar />
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '5rem 1rem' }}>
        <div className="card" style={{ maxWidth: '28rem', width: '100%', textAlign: 'center', borderRadius: '1rem', padding: '2rem' }}>
          {status === 'verifying' && (
            <div>
              <p style={{ marginBottom: '1rem', fontWeight: 600, color: 'var(--gray-600)' }}>Verifying your email...</p>
              <div className="progress-bar-container">
                <div className="progress-bar-fill" style={{ width: `${progress}%` }} />
              </div>
              <p className="progress-text">{progress}%</p>
            </div>
          )}
          {status === 'success' && (
            <>
              <div style={{ fontSize: '3.75rem', marginBottom: '1rem' }}>✅</div>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1rem' }}>{message}</h2>
              <Link to="/login" className="btn btn-primary">Go to Login</Link>
            </>
          )}
          {status === 'error' && (
            <>
              <div style={{ fontSize: '3.75rem', marginBottom: '1rem' }}>❌</div>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1rem' }}>{message}</h2>
              <Link to="/register" className="btn btn-primary">Back to Register</Link>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default VerifyEmail
