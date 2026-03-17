import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { studentAPI } from '../../services/api'
import { useAuth } from '../../context/AuthContext'
import toast from 'react-hot-toast'
import Navbar from '../../components/Navbar'
import Sidebar from '../../components/Sidebar'

const Profile = () => {
  const { user } = useAuth()
  const [profile, setProfile] = useState(null)
  const [stats, setStats] = useState(null)
  const [editing, setEditing] = useState(false)
  const [formData, setFormData] = useState({ name: '', phone: '', studentId: '', department: '' })
  const [loading, setLoading] = useState(true)
  const [progress, setProgress] = useState(0)
  const [saving, setSaving] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    fetchProfile()
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      const { data } = await studentAPI.getDashboard()
      if (data.success) setStats(data.dashData)
    } catch (error) { console.error('Failed to fetch stats') }
  }

  const fetchProfile = async (showLoader = true) => {
    try {
      if (showLoader) {
        setLoading(true)
        setProgress(10)
        setTimeout(() => setProgress(40), 200)
        setTimeout(() => setProgress(70), 500)
      }
      const { data } = await studentAPI.getProfile()
      if (showLoader) setProgress(90)
      if (data.success) {
        setProfile(data.userData)
        setFormData({
          name: data.userData.name || '',
          phone: data.userData.phone || '',
          studentId: data.userData.studentId || '',
          department: data.userData.department || ''
        })
      }
    } catch (error) { toast.error('Failed to fetch profile') }
    finally {
      if (showLoader) {
        setProgress(100)
        setTimeout(() => setLoading(false), 300)
      }
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      const { data } = await studentAPI.updateProfile(formData)
      if (data.success) {
        toast.success('Profile updated successfully')
        setEditing(false)
        if (data.userData) {
          setProfile(data.userData)
          setFormData({ name: data.userData.name || '', phone: data.userData.phone || '', studentId: data.userData.studentId || '', department: data.userData.department || '' })
        } else { await fetchProfile(false) }
      } else { toast.error(data.message) }
    } catch (error) { toast.error('Failed to update profile') }
    finally { setSaving(false) }
  }

  const getInitials = (name) => {
    if (!name) return '?'
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
  }

  const formatDate = (dateStr) => {
    if (!dateStr) return 'N/A'
    return new Date(dateStr).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-main">
        <Navbar onMenuToggle={() => setSidebarOpen(!sidebarOpen)} />
        <div className="page-layout">
          <Sidebar mobileOpen={sidebarOpen} onMobileClose={() => setSidebarOpen(false)} />
          <main className="page-main">
            <div style={{ maxWidth: '24rem', margin: '4rem auto', textAlign: 'center' }}>
              <p style={{ marginBottom: '1rem', fontWeight: 600, color: 'var(--gray-600)' }}>Loading profile...</p>
              <div className="progress-bar-container">
                <div className="progress-bar-fill" style={{ width: `${progress}%` }} />
              </div>
              <p className="progress-text">{progress}%</p>
            </div>
          </main>
        </div>
      </div>
    )
  }

  if (!profile) return null

  return (
    <div className="min-h-screen bg-gradient-main mobile-overflow-fix">
      <Navbar onMenuToggle={() => setSidebarOpen(!sidebarOpen)} />
      <div className="page-layout">
        <Sidebar mobileOpen={sidebarOpen} onMobileClose={() => setSidebarOpen(false)} />
        <main className="page-main">
          <div style={{ maxWidth: '56rem' }}>
            {/* Header */}
            <button onClick={() => navigate(-1)} className="back-btn">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
              Back
            </button>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem' }}>
              <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--gray-900)' }}>My Profile</h1>
              {!editing && (
                <button onClick={() => setEditing(true)} className="btn btn-primary" style={{ fontSize: '0.875rem', display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.625rem 1.25rem', borderRadius: '0.5rem' }}>
                  <svg style={{ width: '1rem', height: '1rem' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                  </svg>
                  Edit Profile
                </button>
              )}
            </div>

            {/* Profile Card */}
            <div style={{ background: '#fff', borderRadius: '1rem', boxShadow: '0 1px 2px rgba(0,0,0,0.05)', border: '1px solid var(--gray-200)', overflow: 'hidden' }}>
              {/* Banner + Avatar */}
              <div className="relative">
                <div className="profile-banner" />
                <div className="profile-avatar-wrapper">
                  <div className="profile-avatar-outer">
                    <div className="profile-avatar-inner student">
                      <span>{getInitials(profile.name)}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Profile Info */}
              <div style={{ paddingTop: '4rem', padding: '4rem 2rem 2rem' }}>
                {!editing ? (
                  <>
                    {/* Name & Role Badge */}
                    <div style={{ marginBottom: '1.5rem' }}>
                      <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--gray-900)' }}>{profile.name}</h2>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginTop: '0.5rem' }}>
                        <span className="badge" style={{ background: 'var(--blue-100)', color: 'var(--blue-700)', display: 'inline-flex', alignItems: 'center', gap: '0.375rem' }}>
                          <svg style={{ width: '0.75rem', height: '0.75rem' }} fill="currentColor" viewBox="0 0 20 20">
                            <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838l-3.14 1.346 2.14.917a1 1 0 00.788 0l7-3a1 1 0 000-1.84l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" />
                          </svg>
                          Student
                        </span>
                        {profile.verified && (
                          <span className="badge" style={{ background: 'var(--green-100)', color: 'var(--green-700)', display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                            <svg style={{ width: '0.75rem', height: '0.75rem' }} fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            Verified
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Info Grid */}
                    <div className="grid md-grid-2" style={{ gap: '1.25rem' }}>
                      <div className="info-item">
                        <div className="info-icon" style={{ background: 'var(--blue-100)' }}>
                          <svg style={{ width: '1.25rem', height: '1.25rem', color: 'var(--blue-600)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                          </svg>
                        </div>
                        <div style={{ minWidth: 0 }}>
                          <p style={{ fontSize: '0.75rem', fontWeight: 500, color: 'var(--gray-500)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Email</p>
                          <p className="truncate" style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--gray-900)', marginTop: '2px' }}>{profile.email}</p>
                        </div>
                      </div>

                      <div className="info-item">
                        <div className="info-icon" style={{ background: 'var(--purple-100)' }}>
                          <svg style={{ width: '1.25rem', height: '1.25rem', color: 'var(--purple-600)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                          </svg>
                        </div>
                        <div>
                          <p style={{ fontSize: '0.75rem', fontWeight: 500, color: 'var(--gray-500)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Phone</p>
                          <p style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--gray-900)', marginTop: '2px' }}>{profile.phone || 'Not provided'}</p>
                        </div>
                      </div>

                      <div className="info-item">
                        <div className="info-icon" style={{ background: 'var(--amber-100)' }}>
                          <svg style={{ width: '1.25rem', height: '1.25rem', color: 'var(--amber-600)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" />
                          </svg>
                        </div>
                        <div>
                          <p style={{ fontSize: '0.75rem', fontWeight: 500, color: 'var(--gray-500)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Student ID</p>
                          <p style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--gray-900)', marginTop: '2px' }}>{profile.studentId || 'Not provided'}</p>
                        </div>
                      </div>

                      <div className="info-item">
                        <div className="info-icon" style={{ background: 'var(--green-100)' }}>
                          <svg style={{ width: '1.25rem', height: '1.25rem', color: 'var(--green-600)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                          </svg>
                        </div>
                        <div>
                          <p style={{ fontSize: '0.75rem', fontWeight: 500, color: 'var(--gray-500)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Department</p>
                          <p style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--gray-900)', marginTop: '2px' }}>{profile.department || 'Not provided'}</p>
                        </div>
                      </div>
                    </div>

                    {/* Member Since */}
                    <div style={{ marginTop: '1.5rem', paddingTop: '1.5rem', borderTop: '1px solid var(--gray-100)' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', color: 'var(--gray-500)' }}>
                        <svg style={{ width: '1rem', height: '1rem' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        Member since {formatDate(profile.createdAt)}
                      </div>
                    </div>
                  </>
                ) : (
                  /* Edit Form */
                  <form onSubmit={handleSubmit}>
                    <h2 style={{ fontSize: '1.125rem', fontWeight: 600, color: 'var(--gray-900)', marginBottom: '1.5rem' }}>Edit Profile</h2>
                    <div className="grid md-grid-2" style={{ gap: '1.25rem' }}>
                      <div>
                        <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, color: 'var(--gray-700)', marginBottom: '0.375rem' }}>Full Name</label>
                        <input type="text" required className="input" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} placeholder="Enter your full name" />
                      </div>
                      <div>
                        <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, color: 'var(--gray-700)', marginBottom: '0.375rem' }}>Phone Number</label>
                        <input type="tel" className="input" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} placeholder="Enter your phone number" />
                      </div>
                      <div>
                        <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, color: 'var(--gray-700)', marginBottom: '0.375rem' }}>Student ID</label>
                        <input type="text" className="input" value={formData.studentId} onChange={(e) => setFormData({ ...formData, studentId: e.target.value })} placeholder="Enter your student ID" />
                      </div>
                      <div>
                        <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, color: 'var(--gray-700)', marginBottom: '0.375rem' }}>Department</label>
                        <input type="text" className="input" value={formData.department} onChange={(e) => setFormData({ ...formData, department: e.target.value })} placeholder="e.g. Computer Science" />
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginTop: '2rem' }}>
                      <button type="submit" disabled={saving} className="btn btn-primary" style={{ fontSize: '0.875rem', display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.625rem 1.5rem', borderRadius: '0.5rem', opacity: saving ? 0.5 : 1, cursor: saving ? 'not-allowed' : 'pointer' }}>
                        {saving ? (
                          <>
                            <svg className="animate-spin" style={{ width: '1rem', height: '1rem' }} fill="none" viewBox="0 0 24 24">
                              <circle style={{ opacity: 0.25 }} cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                              <path style={{ opacity: 0.75 }} fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                            </svg>
                            Saving...
                          </>
                        ) : 'Save Changes'}
                      </button>
                      <button type="button" onClick={() => { setEditing(false); setFormData({ name: profile.name || '', phone: profile.phone || '', studentId: profile.studentId || '', department: profile.department || '' }) }} className="btn btn-secondary" style={{ fontSize: '0.875rem', padding: '0.625rem 1.5rem', borderRadius: '0.5rem' }}>
                        Cancel
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>

            {/* Activity Stats */}
            {stats && !editing && (
              <div className="grid md-grid-4" style={{ marginTop: '1.5rem', gap: '1rem' }}>
                <div style={{ background: '#fff', borderRadius: '0.75rem', border: '1px solid var(--gray-200)', padding: '1.25rem', textAlign: 'center' }}>
                  <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--blue-600)' }}>{stats.totalAppointments || 0}</div>
                  <p style={{ fontSize: '0.75rem', fontWeight: 500, color: 'var(--gray-500)', marginTop: '0.25rem' }}>Total Appointments</p>
                </div>
                <div style={{ background: '#fff', borderRadius: '0.75rem', border: '1px solid var(--gray-200)', padding: '1.25rem', textAlign: 'center' }}>
                  <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--amber-500)' }}>{stats.pendingAppointments || 0}</div>
                  <p style={{ fontSize: '0.75rem', fontWeight: 500, color: 'var(--gray-500)', marginTop: '0.25rem' }}>Pending</p>
                </div>
                <div style={{ background: '#fff', borderRadius: '0.75rem', border: '1px solid var(--gray-200)', padding: '1.25rem', textAlign: 'center' }}>
                  <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--green-600)' }}>{stats.approvedAppointments || 0}</div>
                  <p style={{ fontSize: '0.75rem', fontWeight: 500, color: 'var(--gray-500)', marginTop: '0.25rem' }}>Approved</p>
                </div>
                <div style={{ background: '#fff', borderRadius: '0.75rem', border: '1px solid var(--gray-200)', padding: '1.25rem', textAlign: 'center' }}>
                  <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--red-500)' }}>{stats.declinedAppointments || 0}</div>
                  <p style={{ fontSize: '0.75rem', fontWeight: 500, color: 'var(--gray-500)', marginTop: '0.25rem' }}>Declined</p>
                </div>
              </div>
            )}

          </div>
        </main>
      </div>
    </div>
  )
}

export default Profile
