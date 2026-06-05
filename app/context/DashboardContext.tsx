'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface DashboardContextType {
  transparencyMode: boolean;
  setTransparencyMode: (mode: boolean) => void;
  toggleTransparency: () => void;
  sidebarCollapsed: boolean;
  setSidebarCollapsed: (collapsed: boolean) => void;
  hardwareIDProtection: boolean;
  setHardwareIDProtection: (protected_mode: boolean) => void;
  toggleHardwareIDProtection: () => void;
}

const DashboardContext = createContext<DashboardContextType | undefined>(undefined);

export function DashboardProvider({ children }: { children: ReactNode }) {
  const [transparencyMode, setTransparencyMode] = useState(true);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [hardwareIDProtection, setHardwareIDProtection] = useState(true);
  const [mounted, setMounted] = useState(false);

  // Initialize from localStorage
  useEffect(() => {
    const savedTransparency = localStorage.getItem('dashboard_transparency');
    if (savedTransparency !== null) {
      setTransparencyMode(savedTransparency === 'true');
    }

    const savedSidebar = localStorage.getItem('dashboard_sidebar_collapsed');
    if (savedSidebar !== null) {
      setSidebarCollapsed(savedSidebar === 'true');
    }

    const savedHID = localStorage.getItem('dashboard_hid_protection');
    if (savedHID !== null) {
      setHardwareIDProtection(savedHID === 'true');
    }
    
    setMounted(true);
  }, []);

  const handleSetTransparency = (mode: boolean) => {
    setTransparencyMode(mode);
    localStorage.setItem('dashboard_transparency', String(mode));
  };

  const handleToggleTransparency = () => {
    const newVal = !transparencyMode;
    setTransparencyMode(newVal);
    localStorage.setItem('dashboard_transparency', String(newVal));
  };

  const handleSetSidebarCollapsed = (collapsed: boolean) => {
    setSidebarCollapsed(collapsed);
    localStorage.setItem('dashboard_sidebar_collapsed', String(collapsed));
  };

  const handleSetHardwareIDProtection = (protected_mode: boolean) => {
    setHardwareIDProtection(protected_mode);
    localStorage.setItem('dashboard_hid_protection', String(protected_mode));
  };

  const handleToggleHardwareID = () => {
    const newVal = !hardwareIDProtection;
    setHardwareIDProtection(newVal);
    localStorage.setItem('dashboard_hid_protection', String(newVal));
  };

  return (
    <DashboardContext.Provider
      value={{
        transparencyMode,
        setTransparencyMode: handleSetTransparency,
        toggleTransparency: handleToggleTransparency,
        sidebarCollapsed,
        setSidebarCollapsed: handleSetSidebarCollapsed,
        hardwareIDProtection,
        setHardwareIDProtection: handleSetHardwareIDProtection,
        toggleHardwareIDProtection: handleToggleHardwareID,
      }}
    >
      {children}
    </DashboardContext.Provider>
  );
}


export function useDashboard() {
  const context = useContext(DashboardContext);
  if (context === undefined) {
    throw new Error('useDashboard must be used within a DashboardProvider');
  }
  return context;
}
