import { Link, useNavigate } from 'react-router-dom';
import { MessageSquare, LogIn, UserPlus, Shield } from 'lucide-react';

export default function Navbar({ isLoggedIn, isAdmin, onLogout }) {
  const user = JSON.parse(localStorage.getItem('user') || 'null');
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  return (
    <nav className="bg-gradient-to-r from-primary-900 to-secondary-800 px-6 py-4 shadow-xl">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold text-white">
          Campus Connect
        </Link>

        <div className="flex items-center space-x-6">
          {user ? (
            // Logged in user navigation
            <>
              <Link to="/" className="text-white hover:text-primary-200">
                Home
              </Link>
              
              {user.role === 'senior' ? (
                <Link 
                  to="/senior-messages" 
                  className="flex items-center space-x-2 text-white hover:text-primary-200"
                >
                  <MessageSquare size={20} />
                  <span>Messages from Juniors</span>
                </Link>
              ) : (
                <>
                  <Link to="/seniors" className="text-white hover:text-primary-200">
                    Connect with Seniors
                  </Link>
                  <Link to="/experiences" className="text-white hover:text-primary-200">
                    Experiences
                  </Link>
                </>
              )}
              
              <Link to="/group-chat" className="text-white hover:text-primary-200">
                Group Chat
              </Link>
              
              <button
                onClick={handleLogout}
                className="text-white hover:text-primary-200"
              >
                Logout
              </button>
            </>
          ) : isAdmin ? (
            // Admin navigation
            <button
              onClick={handleLogout}
              className="text-white hover:text-primary-200"
            >
              Logout from Admin
            </button>
          ) : (
            // Not logged in navigation
            <div className="flex items-center space-x-6">
              <Link 
                to="/login" 
                className="flex items-center space-x-2 text-white hover:text-primary-200"
              >
                <LogIn size={20} />
                <span>Login</span>
              </Link>
              
              <Link 
                to="/register" 
                className="flex items-center space-x-2 text-white hover:text-primary-200"
              >
                <UserPlus size={20} />
                <span>Sign Up</span>
              </Link>
              
              <Link 
                to="/admin-login" 
                className="flex items-center space-x-2 text-white hover:text-primary-200"
              >
                <Shield size={20} />
                <span>Admin</span>
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
