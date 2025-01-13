import { Avatar, Dropdown, MenuProps, Modal } from "antd";
import { ProfileImageUpload } from "./ProfileImageUpload";
import { Image } from "./Image";
import { useAccount } from "jazz-react";
import { useState } from "react";
import { LogoutOutlined, UserOutlined } from "@ant-design/icons";
import { useClerk } from "@clerk/clerk-react";

export function Header() {
  const { me } = useAccount();
  const { signOut } = useClerk();
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
    <div className="border-b p-4 flex flex-row justify-end items-center mx-2">
      <Dropdown menu={{ items }} placement="bottomRight" trigger={["click"]}>
        <Avatar
          onClick={(e) => e?.preventDefault()}
          // onClick={() => setProfileImageOpen(true)}
          size="large"
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
        title="Profile"
      >
        <ProfileImageUpload />
      </Modal>
    </div>
  );
}
