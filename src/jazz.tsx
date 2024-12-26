import { createJazzReactApp, useDemoAuth, DemoAuthBasicUI } from "jazz-react";
import { ListManagerAccount } from "./schema.ts";

export const Jazz = createJazzReactApp<ListManagerAccount>({
  AccountSchema: ListManagerAccount,
});

export function JazzAndAuth({ children }: { children: React.ReactNode }) {
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
