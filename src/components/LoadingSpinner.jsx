import Navbar from './Navbar'
import Sidebar from './Sidebar'

const LoadingSpinner = ({ sidebarOpen, setSidebarOpen }) => (
  <div style={{ minHeight: '100vh', background: '#f8fafc' }}>
    <Navbar onMenuToggle={() => setSidebarOpen(!sidebarOpen)} />
    <div style={{ display: 'flex' }}>
      <Sidebar mobileOpen={sidebarOpen} onMobileClose={() => setSidebarOpen(false)} />
      <main style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
          <svg className="animate-spin" style={{ width: '2.5rem', height: '2.5rem', color: '#2563eb' }} fill="none" viewBox="0 0 24 24">
            <circle style={{ opacity: 0.25 }} cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path style={{ opacity: 0.75 }} fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          <p style={{ color: '#6b7280', fontSize: '0.875rem', fontWeight: 500 }}>Loading...</p>
        </div>
      </main>
    </div>
  </div>
)

export default LoadingSpinner
