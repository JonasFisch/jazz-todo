import { DemoAuthBasicUI, JazzProvider, useDemoAuth } from "jazz-react";
import { ListManagerAccount } from "./schema.ts";
import { useJazzClerkAuth } from "jazz-react-auth-clerk";
import { ClerkLoaded, ClerkLoading, useClerk } from "@clerk/clerk-react";
import { LandingPage } from "./pages/landing-page.tsx";
import { Spin } from "antd";

export function JazzAndAuth({ children }: { children: React.ReactNode }) {
  const clerk = useClerk();
  const [auth] = useJazzClerkAuth(clerk);

  return (
    <>
      <ClerkLoading>
        <div className="h-dvh w-full flex justify-center items-center">
          <Spin delay={0.5} />
        </div>
      </ClerkLoading>
      <ClerkLoaded>
        {auth && clerk.user ? (
          <JazzProvider
            auth={auth}
            AccountSchema={ListManagerAccount}
            peer={import.meta.env.VITE_JAZZ_PEER}
          >
            {children}
          </JazzProvider>
        ) : (
          <LandingPage />
        )}
      </ClerkLoaded>
    </>
  );
}

export function JazzAndAuthLocal({ children }: { children: React.ReactNode }) {
  const [auth, authState] = useDemoAuth();
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
