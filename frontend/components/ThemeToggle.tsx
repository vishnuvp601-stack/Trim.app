'use client';

import { Moon, Sun } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function ThemeToggle() {
  const [mounted, setMounted] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Check localStorage
    const savedTheme = localStorage.getItem('isDarkMode');
    const darkMode = savedTheme ? JSON.parse(savedTheme) : false;
    setIsDarkMode(darkMode);
    applyTheme(darkMode);
  }, []);

  const applyTheme = (darkMode: boolean) => {
    const htmlElement = document.documentElement;
    if (darkMode) {
      htmlElement.classList.add('light');
    } else {
      htmlElement.classList.remove('light');
    }
  };

  const toggleTheme = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    localStorage.setItem('isDarkMode', JSON.stringify(newMode));
    applyTheme(newMode);
  };

  if (!mounted) {
    return null;
  }

  return (
    <button
      onClick={toggleTheme}
      className="fixed bottom-8 right-8 z-50 glass-button p-3 transition-all duration-300"
      aria-label="Toggle theme"
      title={`Switch to ${isDarkMode ? 'light' : 'dark'} mode`}
    >
      {isDarkMode ? (
        <Sun className="w-5 h-5 text-white" strokeWidth={1.5} />
      ) : (
        <Moon className="w-5 h-5" strokeWidth={1.5} />
      )}
    </button>
  );
}
