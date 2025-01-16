import { DemoAuthBasicUI, JazzProvider, useDemoAuth } from "jazz-react";
import { ListManagerAccount } from "./schema.ts";
import { useJazzClerkAuth } from "jazz-react-auth-clerk";
import { SignInButton, useClerk } from "@clerk/clerk-react";

export function JazzAndAuth({ children }: { children: React.ReactNode }) {
  const clerk = useClerk();
  const [auth] = useJazzClerkAuth(clerk);

  return (
    <>
      {clerk.user && auth ? (
        <JazzProvider
          auth={auth}
          AccountSchema={ListManagerAccount}
          peer={import.meta.env.VITE_JAZZ_PEER}
        >
          {children}
        </JazzProvider>
      ) : (
        <SignInButton />
      )}
    </>
  );
}

export function JazzAndAuthLocal({ children }: { children: React.ReactNode }) {
  const [auth, authState] = useDemoAuth();
  console.log("in local jazz auth");

  return (
    <>
      {auth && (
        <>
          <JazzProvider
            auth={auth}
            AccountSchema={ListManagerAccount}
            peer={import.meta.env.VITE_JAZZ_PEER}
          >
            {children}
          </JazzProvider>
          <DemoAuthBasicUI appName="Circular" state={authState} />
        </>
      )}
    </>
  );
}

declare module "jazz-react" {
  interface Register {
    Account: ListManagerAccount;
  }
}
