import { useEffect, useState } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { authAPI } from '../services/api'
import Navbar from '../components/Navbar'

const VerifyEmail = () => {
  const [searchParams] = useSearchParams()
  const [status, setStatus] = useState('verifying')
  const [message, setMessage] = useState('')

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
    try {
      const { data } = await authAPI.verifyEmail(token)
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
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="flex items-center justify-center py-20">
        <div className="card max-w-md w-full text-center">
          {status === 'verifying' && <p>Verifying your email...</p>}
          {status === 'success' && (
            <>
              <div className="text-6xl mb-4">✅</div>
              <h2 className="text-2xl font-bold mb-4">{message}</h2>
              <Link to="/login" className="btn-primary">Go to Login</Link>
            </>
          )}
          {status === 'error' && (
            <>
              <div className="text-6xl mb-4">❌</div>
              <h2 className="text-2xl font-bold mb-4">{message}</h2>
              <Link to="/register" className="btn-primary">Back to Register</Link>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default VerifyEmail
