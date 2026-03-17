import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Navbar from '../components/Navbar'

const Home = () => {
  const { isAuthenticated, user } = useAuth()
  const dashboardPath = user?.role === 'STUDENT' ? '/student/dashboard' : '/lecturer/dashboard'

  return (
    <div className="min-h-screen bg-gradient-hero">
      <Navbar />
      <div style={{ maxWidth: '80rem', margin: '0 auto', padding: '5rem 1rem' }}>
        <div style={{ textAlign: 'center' }}>
          <h1 style={{ fontSize: 'clamp(2.5rem, 5vw, 3.75rem)', fontWeight: 700, color: 'var(--gray-900)', marginBottom: '1.5rem', lineHeight: 1.1 }}>
            Connect with Your <span style={{ color: 'var(--blue-600)' }}>Lecturers</span>
          </h1>
          <p style={{ fontSize: '1.25rem', color: 'var(--gray-600)', marginBottom: '2.5rem', maxWidth: '42rem', margin: '0 auto 2.5rem' }}>
            Schedule consultations, manage appointments, and get academic support seamlessly
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            {isAuthenticated ? (
              <Link to={dashboardPath} className="btn btn-primary" style={{ padding: '0.75rem 2rem', fontSize: '1.125rem' }}>Go to Dashboard</Link>
            ) : (
              <>
                <Link to="/register" className="btn btn-primary" style={{ padding: '0.75rem 2rem', fontSize: '1.125rem' }}>Get Started Free</Link>
                <Link to="/login" className="btn btn-secondary" style={{ padding: '0.75rem 2rem', fontSize: '1.125rem' }}>Sign In</Link>
              </>
            )}
          </div>
        </div>

        <div className="grid md-grid-3" style={{ marginTop: '6rem', gap: '2rem' }}>
          {[
            { icon: '📅', title: 'Easy Scheduling', desc: 'Book appointments with lecturers in just a few clicks. No more email back-and-forth.' },
            { icon: '🔔', title: 'Real-time Updates', desc: 'Get instant notifications when your appointment is approved or needs attention.' },
            { icon: '👨‍🏫', title: 'Find Experts', desc: 'Browse lecturers by department and specialization to find the right help.' }
          ].map((f) => (
            <div key={f.title} className="card" style={{ textAlign: 'center', transition: 'box-shadow 0.2s', cursor: 'default' }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>{f.icon}</div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '0.75rem' }}>{f.title}</h3>
              <p style={{ color: 'var(--gray-600)' }}>{f.desc}</p>
            </div>
          ))}
        </div>

        <div className="grid md-grid-3" style={{ marginTop: '5rem', gap: '2rem', textAlign: 'center' }}>
          {[['500+', 'Active Students'], ['50+', 'Lecturers'], ['1000+', 'Consultations']].map(([num, label]) => (
            <div key={label}>
              <div style={{ fontSize: '2.25rem', fontWeight: 700, color: 'var(--blue-600)' }}>{num}</div>
              <div style={{ color: 'var(--gray-600)', marginTop: '0.5rem' }}>{label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Home
