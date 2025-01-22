import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { TypographyText } from "@/components/ui/typography/text";
import { SignInButton } from "@clerk/clerk-react";

export function LandingPage() {
  return (
    <div className="flex flex-col items-center sm:justify-center h-screen ">
      <Card className="max-w-md relative">
        <CardHeader>
          <CardTitle>Welcome to Jonas-Todos.</CardTitle>
          <CardDescription>
            The realtime todo app with offline first approach.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <TypographyText className="text-left">
            I hope you enjoy this small App that I built. This app is still in
            alpha so if you encounter any errors or have suggestions feel free
            to create an issue here on{" "}
            <a href="https://github.com/JonasFisch/jazz-todo/issues">Github</a>{" "}
            or just write me a message.
          </TypographyText>
          <div className="absolute top-0 right-0 mt-2 mr-2">
            <Badge color="#ff0">alpha</Badge>
          </div>
          <TypographyText>
            And now enjoy this realtime synchronized todo app.
          </TypographyText>
          <div className="mt-4 text-black self-center">
            <SignInButton>
              <Button>Sign in</Button>
            </SignInButton>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
