
import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Header: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };
  
  const activeLinkStyle = {
      color: '#4f46e5',
      fontWeight: '600',
  };

  return (
    <header className="bg-surface shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 md:px-6 py-3 flex justify-between items-center">
        <NavLink to="/" className="text-2xl font-bold text-primary">
          StudySync
        </NavLink>
        <nav className="flex items-center space-x-4 md:space-x-6">
          {user ? (
            <>
              <NavLink to="/" className="text-gray-600 hover:text-primary transition-colors" style={({ isActive }) => isActive ? activeLinkStyle : {}}>Dashboard</NavLink>
              <NavLink to="/find" className="text-gray-600 hover:text-primary transition-colors" style={({ isActive }) => isActive ? activeLinkStyle : {}}>Find Partners</NavLink>
              <NavLink to="/profile" className="text-gray-600 hover:text-primary transition-colors" style={({ isActive }) => isActive ? activeLinkStyle : {}}>Profile</NavLink>
              <button
                onClick={handleLogout}
                className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary/90 transition-colors text-sm font-medium"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <NavLink to="/login" className="text-gray-600 hover:text-primary transition-colors">Login</NavLink>
              <NavLink to="/register" className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary/90 transition-colors text-sm font-medium">Register</NavLink>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;
