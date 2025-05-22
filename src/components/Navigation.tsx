
import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Home, Calendar, FileText, User, LogIn, LogOut, Menu, X } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { Button } from "@/components/ui/button";

const Navigation = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleAuthClick = () => {
    if (user) {
      signOut();
    } else {
      navigate('/auth');
    }
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(prev => !prev);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-10">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <NavLink to="/" className="flex items-center gap-2">
              <div className="bg-primary text-white p-1 rounded">
                <Calendar size={18} />
              </div>
              <span className="font-semibold text-slate-700 text-lg">Mediminder</span>
            </NavLink>
          </div>
          
          <div className="hidden md:flex items-center space-x-2">
            <NavLink to="/dashboard" className={({ isActive }) => 
              isActive ? "nav-link-active" : "nav-link"
            }>
              <Home size={18} />
              <span>Home</span>
            </NavLink>
            
            <NavLink to="/medicines" className={({ isActive }) => 
              isActive ? "nav-link-active" : "nav-link"
            }>
              <Calendar size={18} />
              <span>Medicines</span>
            </NavLink>
            
            <NavLink to="/history" className={({ isActive }) => 
              isActive ? "nav-link-active" : "nav-link"
            }>
              <FileText size={18} />
              <span>Medical History</span>
            </NavLink>
            
            {user && (
              <NavLink to="/profile" className={({ isActive }) => 
                isActive ? "nav-link-active" : "nav-link"
              }>
                <User size={18} />
                <span>Profile</span>
              </NavLink>
            )}
            
            <Button 
              variant="ghost" 
              className="nav-link"
              onClick={handleAuthClick}
            >
              {user ? (
                <>
                  <LogOut size={18} />
                  <span>Logout</span>
                </>
              ) : (
                <>
                  <LogIn size={18} />
                  <span>Login</span>
                </>
              )}
            </Button>
          </div>
          
          <div className="md:hidden">
            <button 
              className="p-2 rounded-md text-slate-600 hover:text-primary hover:bg-primary/5"
              onClick={toggleMobileMenu}
              aria-label="Toggle mobile menu"
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden pt-2 pb-4 border-t border-gray-100">
            <div className="flex flex-col space-y-1">
              <NavLink 
                to="/dashboard" 
                className={({ isActive }) => isActive ? "nav-link-active" : "nav-link"}
                onClick={closeMobileMenu}
              >
                <Home size={18} />
                <span>Home</span>
              </NavLink>
              
              <NavLink 
                to="/medicines" 
                className={({ isActive }) => isActive ? "nav-link-active" : "nav-link"}
                onClick={closeMobileMenu}
              >
                <Calendar size={18} />
                <span>Medicines</span>
              </NavLink>
              
              <NavLink 
                to="/history" 
                className={({ isActive }) => isActive ? "nav-link-active" : "nav-link"}
                onClick={closeMobileMenu}
              >
                <FileText size={18} />
                <span>Medical History</span>
              </NavLink>
              
              {user && (
                <NavLink 
                  to="/profile" 
                  className={({ isActive }) => isActive ? "nav-link-active" : "nav-link"}
                  onClick={closeMobileMenu}
                >
                  <User size={18} />
                  <span>Profile</span>
                </NavLink>
              )}
              
              <Button 
                variant="ghost" 
                className="nav-link justify-start"
                onClick={() => {
                  handleAuthClick();
                  closeMobileMenu();
                }}
              >
                {user ? (
                  <>
                    <LogOut size={18} />
                    <span>Logout</span>
                  </>
                ) : (
                  <>
                    <LogIn size={18} />
                    <span>Login</span>
                  </>
                )}
              </Button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;
