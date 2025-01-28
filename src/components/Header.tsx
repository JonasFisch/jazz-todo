import { ProfileImageUpload } from "./ProfileImageUpload";
import { Image } from "./Image";
import { useAccount } from "jazz-react";
import { useState } from "react";
import { useClerk } from "@clerk/clerk-react";
import { useDarkMode } from "../hooks/use-dark-mode";
import { useTheme } from "../hooks/use-theme";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { LogOut, User, UserCircle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "./ui/dialog";
import { TypographyHeading } from "./ui/typography/heading";
import { Avatar } from "./ui/avatar";
import { Separator } from "./ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Label } from "./ui/label";

export function Header() {
  const { me } = useAccount();
  const { theme, setTheme, availableThemes } = useTheme();
  const { darkMode, setDarkMode } = useDarkMode();

  const { signOut } = useClerk();
  const [profileModalOpen, setProfileImageOpen] = useState<boolean>(false);

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Avatar>
            <div className="cursor-pointer hover:opacity-85 h-10 w-10 flex flex-row justify-center items-center">
              {me.profile?.image ? (
                <Image image={me.profile?.image} />
              ) : (
                <UserCircle size={28} />
              )}
            </div>
          </Avatar>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56">
          {/* <DropdownMenuLabel>My Account</DropdownMenuLabel>
          <DropdownMenuSeparator /> */}
          <DropdownMenuGroup>
            <DropdownMenuItem onClick={() => setProfileImageOpen(true)}>
              <User />
              <span>Profile</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => signOut({ redirectUrl: "/" })}>
              <LogOut className="text-destructive" />
              <span>Logout</span>
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
      <>
        <Dialog
          open={profileModalOpen}
          onOpenChange={(open) => {
            setProfileImageOpen(open);
          }}
        >
          <DialogContent>
            <DialogTitle>Profile</DialogTitle>
            <DialogDescription>
              Change your profile settings here.
            </DialogDescription>
            <ProfileImageUpload />

            <Separator />
            <div>
              <TypographyHeading level={4}>Settings</TypographyHeading>

              <div className="mb-3">
                <Label htmlFor="dark-mode-select">Dark Mode</Label>
                <Select onValueChange={setDarkMode} value={darkMode}>
                  <SelectTrigger id="dark-mode-select" className="w-[180px]">
                    <SelectValue placeholder="Theme" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="light">Light</SelectItem>
                    <SelectItem value="dark">Dark</SelectItem>
                    <SelectItem value="auto">System</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="mb-3">
                <Label htmlFor="theme-select">Theme (coming soon)</Label>
                <Select onValueChange={setTheme} value={theme}>
                  <SelectTrigger id="theme-select" className="w-[180px]">
                    <SelectValue placeholder="Theme" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableThemes.map((value) => (
                      <SelectItem key={value} value={value}>
                        {value}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </>
    </>
  );
}
