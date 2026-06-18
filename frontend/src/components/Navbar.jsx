import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { BookOpen, PenSquare, LogOut, LogIn, User } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/auth');
  };

  return (
    <nav className="navbar">
      <div className="container nav-container">
        <Link to="/" className="nav-logo">
          <BookOpen size={24} className="logo-icon" />
          <span>The<span className="logo-accent">Blogger</span></span>
        </Link>
        
        <div className="nav-links">
          <Link to="/" className="nav-link">Home</Link>
          {user ? (
            <>
              <Link to="/write" className="btn btn-primary btn-sm btn-write">
                <PenSquare size={16} />
                <span>Write</span>
              </Link>
              <div className="nav-user">
                <User size={16} className="user-icon" />
                <span className="username">{user.username}</span>
              </div>
              <button onClick={handleLogout} className="btn btn-secondary btn-sm btn-logout" title="Log Out">
                <LogOut size={16} />
              </button>
            </>
          ) : (
            <Link to="/auth" className="btn btn-primary btn-sm">
              <LogIn size={16} />
              <span>Login</span>
            </Link>
          )}
        </div>
      </div>
      
      {/* Styles local to the navbar for fine-tuning */}
      <style dangerouslySetInnerHTML={{ __html: `
        .navbar {
          position: sticky;
          top: 0;
          z-index: 100;
          background: rgba(13, 17, 23, 0.95);
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
          border-bottom: 1px solid #21262d;
          height: 70px;
          display: flex;
          align-items: center;
        }
        .nav-container {
          display: flex;
          justify-content: space-between;
          align-items: center;
          width: 100%;
        }
        .nav-logo {
          display: flex;
          align-items: center;
          gap: 0.6rem;
          font-family: var(--font-heading);
          font-size: 1.4rem;
          font-weight: 800;
          color: var(--text-primary);
          text-decoration: none;
        }
        .logo-icon {
          color: var(--accent-primary);
        }
        .logo-accent {
          background: var(--accent-gradient);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        .nav-links {
          display: flex;
          align-items: center;
          gap: 1.5rem;
        }
        .nav-link {
          color: var(--text-secondary);
          text-decoration: none;
          font-size: 0.95rem;
          font-weight: 500;
          transition: color var(--transition-fast);
        }
        .nav-link:hover {
          color: var(--text-primary);
        }
        .btn-write {
          gap: 0.4rem;
        }
        .nav-user {
          display: flex;
          align-items: center;
          gap: 0.4rem;
          color: var(--text-secondary);
          font-size: 0.9rem;
          padding: 0.3rem 0.6rem;
          background: #21262d;
          border: 1px solid #30363d;
          border-radius: 20px;
        }
        .user-icon {
          color: var(--accent-secondary);
        }
        .username {
          max-width: 120px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        .btn-logout {
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          width: 34px;
          height: 34px;
          padding: 0;
        }
      `}} />
    </nav>
  );
};

export default Navbar;
