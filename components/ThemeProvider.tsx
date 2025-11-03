"use client";
import * as React from "react";
import { useEffect } from "react";

const ThemeContext = React.createContext({});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    document.body.classList.add("dark");
    return () => document.body.classList.remove("dark");
  }, []);
  return (
    <ThemeContext.Provider value={{}}>
      {children}
    </ThemeContext.Provider>
  );
} 