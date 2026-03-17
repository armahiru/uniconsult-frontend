import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Navbar from '../components/Navbar'

const Home = () => {
  const { isAuthenticated, user } = useAuth()
  const dashboardPath = user?.role === 'STUDENT' ? '/student/dashboard' : '/lecturer/dashboard'

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      <Navbar />
      
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Connect with Your
            <span className="text-blue-600"> Lecturers</span>
          </h1>
          <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto">
            Schedule consultations, manage appointments, and get academic support seamlessly
          </p>
          <div className="flex justify-center space-x-4">
            {isAuthenticated ? (
              <Link to={dashboardPath} className="btn btn-primary px-8 py-3 text-lg">
                Go to Dashboard
              </Link>
            ) : (
              <>
                <Link to="/register" className="btn btn-primary px-8 py-3 text-lg">
                  Get Started Free
                </Link>
                <Link to="/login" className="btn btn-secondary px-8 py-3 text-lg">
                  Sign In
                </Link>
              </>
            )}
          </div>
        </div>
        
        {/* Features */}
        <div className="mt-24 grid md:grid-cols-3 gap-8">
          <div className="card text-center hover:shadow-lg transition-shadow">
            <div className="text-5xl mb-4">📅</div>
            <h3 className="text-xl font-semibold mb-3">Easy Scheduling</h3>
            <p className="text-gray-600">
              Book appointments with lecturers in just a few clicks. No more email back-and-forth.
            </p>
          </div>
          
          <div className="card text-center hover:shadow-lg transition-shadow">
            <div className="text-5xl mb-4">🔔</div>
            <h3 className="text-xl font-semibold mb-3">Real-time Updates</h3>
            <p className="text-gray-600">
              Get instant notifications when your appointment is approved or needs attention.
            </p>
          </div>
          
          <div className="card text-center hover:shadow-lg transition-shadow">
            <div className="text-5xl mb-4">👨‍🏫</div>
            <h3 className="text-xl font-semibold mb-3">Find Experts</h3>
            <p className="text-gray-600">
              Browse lecturers by department and specialization to find the right help.
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="mt-20 grid md:grid-cols-3 gap-8 text-center">
          <div>
            <div className="text-4xl font-bold text-blue-600">500+</div>
            <div className="text-gray-600 mt-2">Active Students</div>
          </div>
          <div>
            <div className="text-4xl font-bold text-blue-600">50+</div>
            <div className="text-gray-600 mt-2">Lecturers</div>
          </div>
          <div>
            <div className="text-4xl font-bold text-blue-600">1000+</div>
            <div className="text-gray-600 mt-2">Consultations</div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home
