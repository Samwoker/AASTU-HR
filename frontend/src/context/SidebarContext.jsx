import React, { createContext, useContext, useState, useEffect } from "react";

const SidebarContext = createContext();

export function SidebarProvider({ children }) {
  // check if screen is tablet or smaller
  const getInitialState = () => {
    if (typeof window !== 'undefined') {
      return window.innerWidth >= 1024;
    }
    return true;
  };

  const [isOpen, setIsOpen] = useState(getInitialState);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  // handle window resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        // desktop: keep user preference
      } else if (window.innerWidth >= 768) {
        // tablet: collapse sidebar
        setIsOpen(false);
      } else {
        // mobile: close sidebar completely
        setIsOpen(false);
        setIsMobileOpen(false);
      }
    };

    // set initial state
    handleResize();

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggle = () => setIsOpen(prev => !prev);
  const toggleMobile = () => setIsMobileOpen(prev => !prev);
  const closeMobile = () => setIsMobileOpen(false);

  return (
    <SidebarContext.Provider value={{ isOpen, setIsOpen, toggle, isMobileOpen, toggleMobile, closeMobile }}>
      {children}
    </SidebarContext.Provider>
  );
}

export function useSidebar() {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider");
  }
  return context;
}
