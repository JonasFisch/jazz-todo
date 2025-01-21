import { createContext, useEffect, useState } from "react";

type Mode = "light" | "dark" | "auto";

const DarkModeContext = createContext({
  darkMode: "auto",
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  setDarkMode: (mode: Mode) => {},
});

function DarkModeProvider(props: { children: React.ReactNode }) {
  const [darkMode, setDarkMode] = useState<Mode>(
    (localStorage.getItem("theme") as Mode) || "auto"
  );

  // handle manual theme switch
  useEffect(() => {
    if (darkMode === "auto") localStorage.removeItem("theme");
    else localStorage.setItem("theme", darkMode);

    // apply the theme
    document.documentElement.classList.toggle(
      "dark",
      localStorage.theme === "dark" ||
        (!("theme" in localStorage) &&
          window.matchMedia("(prefers-color-scheme: dark)").matches)
    );
  }, [darkMode]);

  // watch for changes in the system color scheme
  useEffect(() => {
    window
      .matchMedia("(prefers-color-scheme: dark)")
      .addEventListener("change", (event) => {
        if (localStorage.getItem("theme") === null) {
          const newColorScheme = event.matches ? "dark" : "light";
          document.documentElement.classList.toggle(
            "dark",
            newColorScheme === "dark"
          );
        }
      });
  }, []);

  return (
    <DarkModeContext.Provider value={{ darkMode, setDarkMode }}>
      {props.children}
    </DarkModeContext.Provider>
  );
}

export { DarkModeContext, DarkModeProvider };
