import React from 'react';
import { useTheme } from '../context/ThemeContext';

const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      style={{
        position: 'fixed',
        top: 20,
        right: 20,
        zIndex: 1000,
        background: 'var(--button-bg)',
        color: 'var(--button-text)',
        border: '1px solid var(--border-color)',
        borderRadius: 999,
        padding: '8px 16px',
        fontSize: 13,
        fontWeight: 500,
        cursor: 'pointer',
        boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
      }}
      aria-label="Toggle theme"
    >
      {theme === 'light' ? 'Switch to Dark' : 'Switch to Light'}
    </button>
  );
};

export default ThemeToggle;

