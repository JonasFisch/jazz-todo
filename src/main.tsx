import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";

import { createJazzReactApp, useDemoAuth, DemoAuthBasicUI } from "jazz-react";
import { ListManagerAccount } from "./schema.ts";

const Jazz = createJazzReactApp<ListManagerAccount>({
  AccountSchema: ListManagerAccount,
});
export const { useAccount, useCoState } = Jazz;

function JazzAndAuth({ children }: { children: React.ReactNode }) {
  const [auth, authState] = useDemoAuth();

  return (
    <>
      <Jazz.Provider auth={auth} peer="ws://localhost:4200">
        {children}
      </Jazz.Provider>
      <DemoAuthBasicUI appName="JazzTodo" state={authState} />
    </>
  );
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <JazzAndAuth>
      <App />
    </JazzAndAuth>
  </StrictMode>
);
