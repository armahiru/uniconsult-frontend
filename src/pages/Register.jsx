import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const DEPARTMENTS = [
  'Computer Science',
  'Information Technology',
  'Software Engineering',
  'Electrical Engineering',
  'Mechanical Engineering',
  'Civil Engineering',
  'Business Administration',
  'Accounting',
  'Mathematics',
  'Physics',
  'Chemistry',
  'Biology',
  'Education',
  'Law',
  'Medicine',
  'Nursing',
  'Psychology',
  'Economics',
  'Other'
]

const Register = () => {
  const [formData, setFormData] = useState({
    name: '', email: '', password: '', confirmPassword: '', role: 'STUDENT', department: '', specialization: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const { register } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match')
      return
    }
    setLoading(true)
    const result = await register(formData)
    setLoading(false)
    if (result.success) navigate('/login')
  }

  const inputStyle = { width: '100%', padding: '0.75rem 1rem', border: '1px solid #d1d5db', borderRadius: '0.5rem', fontSize: '0.875rem', outline: 'none', transition: 'border-color 0.2s', background: '#fff' }

  return (
    <div style={{ minHeight: '100vh', background: '#f5f5f5', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
      <div style={{ maxWidth: '400px', width: '100%', background: '#fff', borderRadius: '1.5rem', boxShadow: '0 4px 24px rgba(0,0,0,0.08)', padding: '2.5rem 2rem' }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '0.75rem' }}>
            <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
              <path d="M24 4L2 16l22 12 22-12L24 4z" fill="#2563eb"/>
              <path d="M6 22v12c0 0 6 8 18 8s18-8 18-8V22" stroke="#2563eb" strokeWidth="2.5" fill="none"/>
              <rect x="38" y="16" width="2.5" height="18" rx="1.25" fill="#2563eb"/>
              <circle cx="39.25" cy="36" r="2.5" fill="#2563eb"/>
            </svg>
          </div>
          <h1 style={{ fontSize: '1.125rem', fontWeight: 700, color: '#2563eb', marginBottom: '0.25rem' }}>UniConsult</h1>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#111827' }}>Create an Account</h2>
        </div>

        {error && (
          <div style={{ background: '#fee2e2', color: '#991b1b', padding: '0.75rem 1rem', borderRadius: '0.5rem', fontSize: '0.875rem', marginBottom: '1rem' }}>{error}</div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Full Name */}
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, color: '#374151', marginBottom: '0.375rem' }}>Full Name</label>
            <input type="text" required placeholder="Enter your full name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} style={inputStyle} onFocus={(e) => e.target.style.borderColor = '#2563eb'} onBlur={(e) => e.target.style.borderColor = '#d1d5db'} />
          </div>

          {/* Email */}
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, color: '#374151', marginBottom: '0.375rem' }}>Email Address</label>
            <input type="email" required placeholder="e.g. student@knust.edu.gh" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} style={inputStyle} onFocus={(e) => e.target.style.borderColor = '#2563eb'} onBlur={(e) => e.target.style.borderColor = '#d1d5db'} />
          </div>

          {/* Department */}
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, color: '#374151', marginBottom: '0.375rem' }}>Department</label>
            <select value={formData.department} onChange={(e) => setFormData({ ...formData, department: e.target.value })} style={{ ...inputStyle, appearance: 'auto', color: formData.department ? '#111827' : '#9ca3af' }}>
              <option value="" disabled>Select Department</option>
              {DEPARTMENTS.map(dept => (
                <option key={dept} value={dept} style={{ color: '#111827' }}>{dept}</option>
              ))}
            </select>
          </div>

          {/* Role - Radio buttons */}
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, color: '#374151', marginBottom: '0.5rem' }}>I am a</label>
            <div style={{ display: 'flex', gap: '1.5rem' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.875rem', color: '#374151' }}>
                <input type="radio" name="role" value="STUDENT" checked={formData.role === 'STUDENT'} onChange={(e) => setFormData({ ...formData, role: e.target.value })} style={{ accentColor: '#2563eb', width: '1rem', height: '1rem' }} />
                Student
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.875rem', color: '#374151' }}>
                <input type="radio" name="role" value="LECTURER" checked={formData.role === 'LECTURER'} onChange={(e) => setFormData({ ...formData, role: e.target.value })} style={{ accentColor: '#2563eb', width: '1rem', height: '1rem' }} />
                Lecturer
              </label>
            </div>
          </div>

          {/* Specialization (Lecturer only) */}
          {formData.role === 'LECTURER' && (
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, color: '#374151', marginBottom: '0.375rem' }}>Specialization</label>
              <input type="text" required placeholder="e.g. Artificial Intelligence" value={formData.specialization} onChange={(e) => setFormData({ ...formData, specialization: e.target.value })} style={inputStyle} onFocus={(e) => e.target.style.borderColor = '#2563eb'} onBlur={(e) => e.target.style.borderColor = '#d1d5db'} />
            </div>
          )}

          {/* Password */}
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, color: '#374151', marginBottom: '0.375rem' }}>Password</label>
            <div style={{ position: 'relative' }}>
              <input type={showPassword ? 'text' : 'password'} required placeholder="Create a password" value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} style={{ ...inputStyle, paddingRight: '3rem' }} onFocus={(e) => e.target.style.borderColor = '#2563eb'} onBlur={(e) => e.target.style.borderColor = '#d1d5db'} />
              <button type="button" onClick={() => setShowPassword(!showPassword)} aria-label={showPassword ? 'Hide password' : 'Show password'} style={{ position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                {showPassword ? (
                  <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" /></svg>
                ) : (
                  <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                )}
              </button>
            </div>
          </div>

          {/* Confirm Password */}
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, color: '#374151', marginBottom: '0.375rem' }}>Confirm Password</label>
            <input type="password" required placeholder="Re-enter password" value={formData.confirmPassword} onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })} style={inputStyle} onFocus={(e) => e.target.style.borderColor = '#2563eb'} onBlur={(e) => e.target.style.borderColor = '#d1d5db'} />
          </div>

          {/* Create Account Button */}
          <button type="submit" disabled={loading} style={{ width: '100%', padding: '0.875rem', background: '#2563eb', color: '#fff', borderRadius: '2rem', fontSize: '1rem', fontWeight: 600, border: 'none', cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', transition: 'background 0.2s' }}>
            {loading ? (
              <>
                <svg className="animate-spin" width="18" height="18" viewBox="0 0 24 24"><circle style={{ opacity: 0.25 }} cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" /><path style={{ opacity: 0.75 }} fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
                Creating account...
              </>
            ) : 'Create Account'}
          </button>
        </form>

        {/* Login link */}
        <p style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.875rem', color: '#6b7280' }}>
          Already have an account?{' '}
          <Link to="/login" style={{ color: '#2563eb', fontWeight: 600 }}>Login</Link>
        </p>
      </div>
    </div>
  )
}

export default Register
