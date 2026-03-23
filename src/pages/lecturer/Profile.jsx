import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { lecturerAPI } from '../../services/api'
import toast from 'react-hot-toast'
import Navbar from '../../components/Navbar'
import Sidebar from '../../components/Sidebar'
import LoadingSpinner from '../../components/LoadingSpinner'

const Profile = () => {
  const [profile, setProfile] = useState(null)
  const [stats, setStats] = useState(null)
  const [editing, setEditing] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    department: '',
    specialization: ''
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    fetchProfile()
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      const { data } = await lecturerAPI.getDashboard()
      if (data.success) setStats(data.dashData)
    } catch (error) {
      console.error('Failed to fetch stats')
    }
  }

  const fetchProfile = async (showLoader = true) => {
    try {
      if (showLoader) setLoading(true)
      const { data } = await lecturerAPI.getProfile()
      if (data.success) {
        setProfile(data.lecturer)
        setFormData({
          name: data.lecturer.userId?.name || '',
          department: data.lecturer.department || '',
          specialization: data.lecturer.specialization || ''
        })
      } else {
        toast.error(data.message || 'Failed to fetch profile')
      }
    } catch (error) {
      toast.error('Failed to fetch profile')
    } finally {
      if (showLoader) setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      const { data } = await lecturerAPI.updateProfile(formData)
      if (data.success) {
        toast.success('Profile updated successfully')
        setEditing(false)
        if (data.lecturer) {
          setProfile(data.lecturer)
          setFormData({
            name: data.lecturer.userId?.name || '',
            department: data.lecturer.department || '',
            specialization: data.lecturer.specialization || ''
          })
        } else {
          await fetchProfile(false)
        }
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error('Failed to update profile')
    } finally {
      setSaving(false)
    }
  }

  const getInitials = (name) => {
    if (!name) return '?'
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
  }

  const formatDate = (dateStr) => {
    if (!dateStr) return 'N/A'
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric', month: 'long', day: 'numeric'
    })
  }

  const handlePhotoUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return
    if (!file.type.startsWith('image/')) { toast.error('Please select an image file'); return }
    if (file.size > 5 * 1024 * 1024) { toast.error('Image must be less than 5MB'); return }
    setUploading(true)
    try {
      const fd = new FormData()
      fd.append('image', file)
      const { data } = await lecturerAPI.uploadPhoto(fd)
      if (data.success) { toast.success('Photo uploaded successfully'); await fetchProfile(false) }
      else { toast.error(data.message) }
    } catch (error) { toast.error('Failed to upload photo') }
    setUploading(false)
  }

  if (loading) {
    return <LoadingSpinner sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
  }

  if (!profile) return null

  const userName = profile.userId?.name || 'Unknown'
  const userEmail = profile.userId?.email || ''
  const isVerified = profile.userId?.verified
  const createdAt = profile.userId?.createdAt || profile.createdAt

  return (
    <div className="min-h-screen bg-gradient-main mobile-overflow-fix">
      <Navbar onMenuToggle={() => setSidebarOpen(!sidebarOpen)} />
      <div className="page-layout">
        <Sidebar mobileOpen={sidebarOpen} onMobileClose={() => setSidebarOpen(false)} />
        <main className="page-main">
          <div style={{ maxWidth: '56rem' }}>
            <button onClick={() => navigate(-1)} className="back-btn">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
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
              <div className="relative">
                <div className="profile-banner lecturer" />
                <div className="profile-avatar-wrapper">
                  <div className="relative" style={{ display: 'inline-block' }}>
                    <div className="profile-avatar-outer">
                      {profile.userId?.image ? (
                        <div className="profile-avatar-inner">
                          <img src={profile.userId.image} alt="Profile" />
                        </div>
                      ) : (
                        <div className="profile-avatar-inner lecturer">
                          <span>{getInitials(userName)}</span>
                        </div>
                      )}
                    </div>
                    <label className="photo-upload-overlay" style={{ borderRadius: '9999px' }}>
                      {uploading ? (
                        <svg className="animate-spin" style={{ width: '1.5rem', height: '1.5rem', color: '#fff' }} viewBox="0 0 24 24">
                          <circle style={{ opacity: 0.25 }} cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                          <path style={{ opacity: 0.75 }} fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                        </svg>
                      ) : (
                        <svg style={{ width: '1.5rem', height: '1.5rem', color: '#fff' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                      )}
                      <input type="file" accept="image/*" style={{ display: 'none' }} onChange={handlePhotoUpload} disabled={uploading} />
                    </label>
                  </div>
                </div>
              </div>

              <div style={{ paddingTop: '4rem', padding: '4rem 2rem 2rem' }}>
                {!editing ? (
                  <>
                    <div style={{ marginBottom: '1.5rem' }}>
                      <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--gray-900)' }}>{userName}</h2>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginTop: '0.5rem' }}>
                        <span className="badge" style={{ background: 'var(--purple-100)', color: 'var(--purple-700)', display: 'inline-flex', alignItems: 'center', gap: '0.375rem' }}>
                          <svg style={{ width: '0.75rem', height: '0.75rem' }} fill="currentColor" viewBox="0 0 20 20">
                            <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838l-3.14 1.346 2.14.917a1 1 0 00.788 0l7-3a1 1 0 000-1.84l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" />
                          </svg>
                          Lecturer
                        </span>
                        {isVerified && (
                          <span className="badge" style={{ background: 'var(--green-100)', color: 'var(--green-700)', display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                            <svg style={{ width: '0.75rem', height: '0.75rem' }} fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            Verified
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="grid md-grid-2" style={{ gap: '1.25rem' }}>
                      <div className="info-item">
                        <div className="info-icon" style={{ background: 'var(--blue-100)' }}>
                          <svg style={{ width: '1.25rem', height: '1.25rem', color: 'var(--blue-600)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                          </svg>
                        </div>
                        <div style={{ minWidth: 0 }}>
                          <p style={{ fontSize: '0.75rem', fontWeight: 500, color: 'var(--gray-500)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Email</p>
                          <p className="truncate" style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--gray-900)', marginTop: '2px' }}>{userEmail}</p>
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
                      <div className="info-item md-col-span-2">
                        <div className="info-icon" style={{ background: 'var(--amber-100)' }}>
                          <svg style={{ width: '1.25rem', height: '1.25rem', color: 'var(--amber-600)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                          </svg>
                        </div>
                        <div>
                          <p style={{ fontSize: '0.75rem', fontWeight: 500, color: 'var(--gray-500)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Specialization</p>
                          <p style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--gray-900)', marginTop: '2px' }}>{profile.specialization || 'Not provided'}</p>
                        </div>
                      </div>
                    </div>

                    <div style={{ marginTop: '1.5rem', paddingTop: '1.5rem', borderTop: '1px solid var(--gray-100)' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', color: 'var(--gray-500)' }}>
                        <svg style={{ width: '1rem', height: '1rem' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        Member since {formatDate(createdAt)}
                      </div>
                    </div>
                  </>
                ) : (
                  <form onSubmit={handleSubmit}>
                    <h2 style={{ fontSize: '1.125rem', fontWeight: 600, color: 'var(--gray-900)', marginBottom: '1.5rem' }}>Edit Profile</h2>
                    <div className="grid md-grid-2" style={{ gap: '1.25rem' }}>
                      <div className="md-col-span-2">
                        <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, color: 'var(--gray-700)', marginBottom: '0.375rem' }}>Full Name</label>
                        <input type="text" required className="input" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} placeholder="Enter your full name" />
                      </div>
                      <div>
                        <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, color: 'var(--gray-700)', marginBottom: '0.375rem' }}>Department</label>
                        <input type="text" required className="input" value={formData.department} onChange={(e) => setFormData({ ...formData, department: e.target.value })} placeholder="e.g. Computer Science" />
                      </div>
                      <div>
                        <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, color: 'var(--gray-700)', marginBottom: '0.375rem' }}>Specialization</label>
                        <input type="text" required className="input" value={formData.specialization} onChange={(e) => setFormData({ ...formData, specialization: e.target.value })} placeholder="e.g. Machine Learning" />
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
                      <button type="button" onClick={() => { setEditing(false); setFormData({ name: profile.userId?.name || '', department: profile.department || '', specialization: profile.specialization || '' }) }} className="btn btn-secondary" style={{ fontSize: '0.875rem', padding: '0.625rem 1.5rem', borderRadius: '0.5rem' }}>
                        Cancel
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>

            {stats && !editing && (
              <div className="grid md-grid-4" style={{ marginTop: '1.5rem', gap: '1rem' }}>
                <div style={{ background: '#fff', borderRadius: '0.75rem', border: '1px solid var(--gray-200)', padding: '1.25rem', textAlign: 'center' }}>
                  <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--indigo-600)' }}>{stats.totalAppointments || 0}</div>
                  <p style={{ fontSize: '0.75rem', fontWeight: 500, color: 'var(--gray-500)', marginTop: '0.25rem' }}>Total Appointments</p>
                </div>
                <div style={{ background: '#fff', borderRadius: '0.75rem', border: '1px solid var(--gray-200)', padding: '1.25rem', textAlign: 'center' }}>
                  <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--amber-500)' }}>{stats.pendingRequests || 0}</div>
                  <p style={{ fontSize: '0.75rem', fontWeight: 500, color: 'var(--gray-500)', marginTop: '0.25rem' }}>Pending Requests</p>
                </div>
                <div style={{ background: '#fff', borderRadius: '0.75rem', border: '1px solid var(--gray-200)', padding: '1.25rem', textAlign: 'center' }}>
                  <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--green-600)' }}>{stats.approvedAppointments || 0}</div>
                  <p style={{ fontSize: '0.75rem', fontWeight: 500, color: 'var(--gray-500)', marginTop: '0.25rem' }}>Approved</p>
                </div>
                <div style={{ background: '#fff', borderRadius: '0.75rem', border: '1px solid var(--gray-200)', padding: '1.25rem', textAlign: 'center' }}>
                  <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--purple-600)' }}>{stats.todayConsultations || 0}</div>
                  <p style={{ fontSize: '0.75rem', fontWeight: 500, color: 'var(--gray-500)', marginTop: '0.25rem' }}>Today's Sessions</p>
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
