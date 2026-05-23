import { createContext, useContext, useMemo, useState } from "react";

const ThemeContext = createContext();

const lightTheme = {
  isDark: false,
  background: "#F6F8F7",
  card: "#FFFFFF",
  text: "#1F2933",
  textMuted: "#7A7A7A",
  border: "#E5E7EB",
  primary: "#00924B",
  primaryLight: "#E8F7EF",
  danger: "#DC2626",
  dangerSoft: "#FDE2E2",
  tabBar: "#FFFFFF",
};

const darkTheme = {
  isDark: true,
  background: "#101418",
  card: "#1A2026",
  text: "#F3F4F6",
  textMuted: "#A0A7B0",
  border: "#2D3742",
  primary: "#22C55E",
  primaryLight: "#163B26",
  danger: "#F87171",
  dangerSoft: "#3A1E1E",
  tabBar: "#151A20",
};

export function AppThemeProvider({ children }) {
  const [isDarkMode, setIsDarkMode] = useState(false);

  const theme = useMemo(() => {
    return isDarkMode ? darkTheme : lightTheme;
  }, [isDarkMode]);

  const toggleDarkMode = () => {
    setIsDarkMode((current) => !current);
  };

  return (
    <ThemeContext.Provider
      value={{
        theme,
        isDarkMode,
        toggleDarkMode,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useAppTheme() {
  return useContext(ThemeContext);
}