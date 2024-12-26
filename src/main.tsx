import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { JazzAndAuth } from "./jazz.tsx";
import { BrowserRouter } from "react-router";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <JazzAndAuth>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </JazzAndAuth>
  </StrictMode>
);
