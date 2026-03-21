import { Link, useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { CalendarDays, LogOut, User, Menu, X } from 'lucide-react';
import { useState } from 'react';
import './Navbar.css';

const Navbar = () => {
  const { user, logout } = useAppContext();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsMobileMenuOpen(false);
  };

  const toggleMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <nav className="navbar">
      <div className="container navbar-container">
        <Link to="/" className="navbar-logo" onClick={closeMenu}>
          <CalendarDays className="logo-icon" />
          <span className="logo-text">TURF<span className="text-gradient">-X</span></span>
        </Link>
        
        <div className="mobile-toggle" onClick={toggleMenu}>
          {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </div>

        <ul className={`nav-links ${isMobileMenuOpen ? 'active' : ''}`}>
          <li><Link to="/" className="nav-link" onClick={closeMenu}>Home</Link></li>
          
          {user ? (
            <>
              <li><Link to="/book" className="nav-link" onClick={closeMenu}>Book Turf</Link></li>
              {user.role === 'admin' ? (
                <li><Link to="/admin" className="nav-link" onClick={closeMenu}>Admin Panel</Link></li>
              ) : (
                <li><Link to="/dashboard" className="nav-link" onClick={closeMenu}>My Bookings</Link></li>
              )}
              <li className="nav-user">
                <span className="user-greeting">
                  <User size={18} /> {user.name}
                </span>
                <button className="btn-logout" onClick={handleLogout}>
                  <LogOut size={18} />
                  <span className="logout-text">Logout</span>
                </button>
              </li>
            </>
          ) : (
            <li>
              <Link to="/login" className="btn-primary" onClick={closeMenu}>
                Login / Signup
              </Link>
            </li>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
