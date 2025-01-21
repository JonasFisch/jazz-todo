import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TypographyHeading } from "@/components/ui/typography/heading";
import { TypographyText } from "@/components/ui/typography/text";
import { SignInButton } from "@clerk/clerk-react";

export function LandingPage() {
  return (
    <div className="flex flex-col items-center sm:justify-center h-screen text-center ">
      <div className="flex flex-col items-center sm:border rounded-md sm:shadow-md py-10 px-4 max-w-md relative">
        <TypographyHeading level={1}>Welcome to Jonas-Todos.</TypographyHeading>
        <TypographyText className="text-left">
          I hope you enjoy this small App that I built. This app is still in
          alpha so if you encounter any errors or have suggestions feel free to
          create an issue here on{" "}
          <a href="https://github.com/JonasFisch/jazz-todo/issues">Github</a> or
          just write me a message.
        </TypographyText>
        <div className="absolute top-0 right-0 mt-2 mr-2">
          <Badge color="#ff0">alpha</Badge>
        </div>
        <TypographyText>
          And now enjoy this realtime synchronized todo app.
        </TypographyText>
        <div className="mt-4 text-black">
          <SignInButton>
            <Button>Sign in</Button>
          </SignInButton>
        </div>
      </div>
    </div>
  );
}
