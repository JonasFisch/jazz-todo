import { JazzProvider } from "jazz-react";
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
          peer="wss://cloud.jazz.tools/?key=minimal-auth-clerk-example@garden.co"
        >
          {children}
        </JazzProvider>
      ) : (
        <SignInButton />
      )}
    </>
  );
}

declare module "jazz-react" {
  interface Register {
    Account: ListManagerAccount;
  }
}
