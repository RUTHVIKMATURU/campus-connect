// Theme color palette
export const lightTheme = {
  // Base colors
  background: {
    primary: '#ffffff',
    secondary: '#f8f9fa',
    tertiary: '#f1f3f5',
    accent: '#f0f4ff'
  },
  foreground: {
    primary: '#1a1a1a',
    secondary: '#4a4a4a',
    tertiary: '#717171',
    accent: '#6366f1'
  },
  border: {
    light: '#e5e7eb',
    medium: '#d1d5db',
    dark: '#9ca3af'
  },
  // Semantic colors
  primary: {
    50: '#f0f4ff',
    100: '#e0e8ff',
    200: '#c7d2fe',
    300: '#a5b4fc',
    400: '#818cf8',
    500: '#6366f1',
    600: '#4f46e5',
    700: '#4338ca',
    800: '#3730a3',
    900: '#312e81'
  },
  success: {
    light: '#d1fae5',
    main: '#10b981',
    dark: '#065f46'
  },
  warning: {
    light: '#fef3c7',
    main: '#f59e0b',
    dark: '#b45309'
  },
  error: {
    light: '#fee2e2',
    main: '#ef4444',
    dark: '#b91c1c'
  },
  info: {
    light: '#dbeafe',
    main: '#3b82f6',
    dark: '#1e40af'
  }
};

export const darkTheme = {
  // Base colors
  background: {
    primary: '#121212',
    secondary: '#1e1e1e',
    tertiary: '#2a2a2a',
    accent: '#1a1c2a'
  },
  foreground: {
    primary: '#f8f9fa',
    secondary: '#e9ecef',
    tertiary: '#dee2e6',
    accent: '#818cf8'
  },
  border: {
    light: '#2a2a2a',
    medium: '#3a3a3a',
    dark: '#4a4a4a'
  },
  // Semantic colors
  primary: {
    50: '#1a1c2a',
    100: '#222436',
    200: '#2a2c42',
    300: '#3a3d5a',
    400: '#4c4f6a',
    500: '#6366f1', // Keep primary accent color similar
    600: '#7679f2',
    700: '#898bf3',
    800: '#a5a7f6',
    900: '#c7c8f9'
  },
  success: {
    light: '#064e3b',
    main: '#10b981',
    dark: '#d1fae5'
  },
  warning: {
    light: '#78350f',
    main: '#f59e0b',
    dark: '#fef3c7'
  },
  error: {
    light: '#7f1d1d',
    main: '#ef4444',
    dark: '#fee2e2'
  },
  info: {
    light: '#1e3a8a',
    main: '#3b82f6',
    dark: '#dbeafe'
  }
};

// Common shadow styles
export const shadows = {
  light: {
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
  },
  dark: {
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.4)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.5), 0 2px 4px -1px rgba(0, 0, 0, 0.4)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.6), 0 4px 6px -2px rgba(0, 0, 0, 0.5)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.6), 0 10px 10px -5px rgba(0, 0, 0, 0.5)'
  }
};
