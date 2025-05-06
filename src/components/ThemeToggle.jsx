import { Moon, Sun } from 'lucide-react';
import { useTheme } from '../theme/ThemeContext';

export default function ThemeToggle() {
  const { isDarkMode, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className={`p-2 rounded-full transition-all duration-300 focus:outline-none focus:ring-2 ${
        isDarkMode
          ? 'bg-gray-800 hover:bg-gray-700 focus:ring-indigo-500'
          : 'bg-indigo-100 hover:bg-indigo-200 focus:ring-indigo-500'
      }`}
      aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
    >
      {isDarkMode ? (
        <Sun size={20} className="text-yellow-300 hover:text-yellow-200 transition-colors duration-300" />
      ) : (
        <Moon size={20} className="text-indigo-600 hover:text-indigo-700 transition-colors duration-300" />
      )}
    </button>
  );
}
