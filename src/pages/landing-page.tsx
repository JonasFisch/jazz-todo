import { SignInButton } from "@clerk/clerk-react";
import { Button, Tag, Typography } from "antd";
import { useJazzClerkAuth } from "jazz-react-auth-clerk";

export function LandingPage() {
  return (
    <div className="flex flex-col items-center sm:justify-center h-screen text-center ">
      <div className="flex flex-col items-center sm:border rounded-md sm:shadow-md py-10 px-4 max-w-md relative">
        <Typography.Title level={1}>Welcome to Jonas-Todos.</Typography.Title>
        <Typography.Paragraph className="text-left">
          I hope you enjoy this small App that I built. This app is still in
          alpha so if you encounter any errors or have suggestions feel free to
          create an issue here on{" "}
          <a href="https://github.com/JonasFisch/jazz-todo/issues">Github</a> or
          just write me a message.
        </Typography.Paragraph>
        <div className="absolute top-0 right-0 mt-2 mr-2">
          <Typography.Text type="secondary">
            <Tag color="orange">alpha</Tag>
          </Typography.Text>
        </div>
        <Typography.Text>
          And now enjoy this realtime synchronized todo app.
        </Typography.Text>
        <div className="mt-4 text-black">
          <SignInButton>
            <Button type="primary">Sign in</Button>
          </SignInButton>
        </div>
      </div>
    </div>
  );
}
