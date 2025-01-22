import { useContext } from "react";
import { DarkModeContext } from "../context/dark-mode-context";

export const useDarkMode = () => useContext(DarkModeContext);
