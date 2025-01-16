import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { JazzAndAuth } from "./jazz.tsx";
import { ClerkProvider } from "@clerk/clerk-react";
import App from "./App.tsx";
import { BrowserRouter, Route, Routes } from "react-router-dom";

// Import your Publishable Key
const PUBLISHABLE_KEY = import.meta.env.VITE_PUBLIC_CLERK_PUBLISHABLE_KEY;

if (!PUBLISHABLE_KEY) {
  throw new Error("Missing Publishable Key");
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      {/* {import.meta.env.MODE === "development" ? (
        <JazzAndAuthLocal>
          <Routes>
            <Route path="/" element={<App />}></Route>
          </Routes>
        </JazzAndAuthLocal>
      ) : ( */}
      <ClerkProvider publishableKey={PUBLISHABLE_KEY} afterSignOutUrl="/">
        <JazzAndAuth>
          <Routes>
            <Route path="/" element={<App />}></Route>
          </Routes>
        </JazzAndAuth>
      </ClerkProvider>
      {/* )} */}
    </BrowserRouter>
  </StrictMode>
);
