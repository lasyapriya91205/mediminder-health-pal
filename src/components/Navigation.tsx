
import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Home, Calendar, FileText, Settings, User, LogIn, LogOut } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { Button } from "@/components/ui/button";

const Navigation = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleAuthClick = () => {
    if (user) {
      signOut();
    } else {
      navigate('/auth');
    }
  };

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-10">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <NavLink to="/" className="flex items-center gap-2">
              <div className="bg-teal-400 text-white p-1 rounded">
                <Calendar size={18} />
              </div>
              <span className="font-semibold text-slate-700 text-lg">MyMeds Companion</span>
            </NavLink>
          </div>
          
          <div className="hidden md:flex items-center space-x-2">
            <NavLink to="/" className={({ isActive }) => 
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
            
            <NavLink to="/settings" className={({ isActive }) => 
              isActive ? "nav-link-active" : "nav-link"
            }>
              <Settings size={18} />
              <span>Settings</span>
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
            {/* Mobile menu button - could be expanded with a proper mobile menu */}
            <button className="p-2 rounded-md text-slate-600 hover:text-teal-500 hover:bg-teal-50">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
