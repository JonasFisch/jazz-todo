import { createContext, useEffect, useState } from "react";

type Theme = "orange" | "black" | "blue";
const DEFAULT_THEME: Theme = "black";

const ThemeContext = createContext({
  theme: "",
  availableThemes: [] as Theme[],
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  setTheme: (theme: Theme) => {},
});

function ThemeProvider(props: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>(
    (localStorage.getItem("color-theme") as Theme) || DEFAULT_THEME
  );

  const applyTheme = (theme: Theme) => {
    setTheme(theme);
    localStorage.setItem("color-theme", theme);
  };

  useEffect(() => {}, []);

  return (
    <ThemeContext.Provider
      value={{
        theme,
        setTheme: applyTheme,
        availableThemes: ["orange", "black", "blue"],
      }}
    >
      {props.children}
    </ThemeContext.Provider>
  );
}

export { ThemeContext, ThemeProvider };
