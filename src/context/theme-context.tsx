import { createContext, useState } from "react";

type Theme = "orange" | "black" | "blue";

const ThemeContext = createContext({
  theme: "",
  availableThemes: [] as Theme[],
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  setTheme: (theme: Theme) => {},
});

function ThemeProvider(props: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>("orange");

  return (
    <ThemeContext.Provider
      value={{ theme, setTheme, availableThemes: ["orange", "black", "blue"] }}
    >
      {props.children}
    </ThemeContext.Provider>
  );
}

export { ThemeContext, ThemeProvider };
