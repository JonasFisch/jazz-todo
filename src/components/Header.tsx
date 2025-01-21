import {
  Avatar,
  Divider,
  Dropdown,
  MenuProps,
  Modal,
  Radio,
  Typography,
} from "antd";
import { ProfileImageUpload } from "./ProfileImageUpload";
import { Image } from "./Image";
import { useAccount } from "jazz-react";
import { useState } from "react";
import { LogoutOutlined, UserOutlined } from "@ant-design/icons";
import { useClerk } from "@clerk/clerk-react";
import { useDarkMode } from "../hooks/use-dark-mode";
import { useTheme } from "../hooks/use-theme";

export function AccountSettings() {
  const { me } = useAccount();
  // TODO: put this into seperate context
  // className={`theme-${theme}`} then apply with this
  const { theme, setTheme } = useTheme();
  const themes = ["blue", "orange", "classic"];
  const { darkMode, setDarkMode } = useDarkMode();

  const { signOut } = useClerk();
  // const signOut = (obj: { redirectUrl: string }) => {};
  const [profileModalOpen, setProfileImageOpen] = useState<boolean>(false);
  const items: MenuProps["items"] = [
    {
      key: "header-dropdown-1",
      label: (
        <a
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => setProfileImageOpen(true)}
        >
          Profile
        </a>
      ),
      icon: <UserOutlined />,
    },
    {
      key: "header-dropdown-2",
      danger: true,
      label: <a onClick={() => signOut({ redirectUrl: "/" })}>Logout</a>,
      icon: <LogoutOutlined />,
    },
  ];

  return (
    <>
      <Dropdown menu={{ items }} placement="bottomRight" trigger={["click"]}>
        <Avatar
          onClick={(e) => e?.preventDefault()}
          size="default"
          icon={
            me.profile?.image ? (
              <Image image={me.profile.image}></Image>
            ) : (
              <UserOutlined />
            )
          }
          className="cursor-pointer hover:opacity-85"
        />
      </Dropdown>
      <Modal
        open={profileModalOpen}
        onCancel={() => setProfileImageOpen(false)}
        onOk={() => setProfileImageOpen(false)}
      >
        <Typography.Title level={3}>Profile</Typography.Title>
        <ProfileImageUpload />

        <Divider />
        <div>
          <Typography.Title level={3}>Settings</Typography.Title>

          <div className="mb-3">
            <label>Dark Mode</label>
            <div className="flex gap-2">
              <Radio.Group
                value={darkMode}
                onChange={(event) => setDarkMode(event.target.value)}
              >
                {["light", "dark", "auto"].map((value) => (
                  <Radio.Button key={value} value={value}>
                    {value}
                  </Radio.Button>
                ))}
              </Radio.Group>
            </div>
          </div>

          <div className="mb-3">
            <label>Theme</label>
            <div className="flex gap-2">
              <Radio.Group
                value={theme}
                onChange={(event) => setTheme(event.target.value)}
              >
                {themes.map((value) => (
                  <Radio.Button key={value} value={value}>
                    {value}
                  </Radio.Button>
                ))}
              </Radio.Group>
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
}
