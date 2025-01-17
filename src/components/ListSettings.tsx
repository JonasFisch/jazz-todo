import { Avatar, Button, Divider, Input, message, Tag, Typography } from "antd";
import { List, TodoAccountProfile } from "../schema";
import { Group } from "jazz-tools";
import { Image } from "./Image";
import {
  DeleteOutlined,
  UsergroupAddOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { createInviteLink } from "jazz-react";

export function ListSettings({ list }: { list: List }) {
  const members = list._owner.castAs(Group).members ?? [];

  const invite = (role: "reader" | "writer") => {
    if (list) {
      const inviteLink = createInviteLink(list, role, {
        valueHint: "list",
      });
      if (inviteLink) {
        navigator.clipboard.writeText(inviteLink);
        pushMessage();
      }
    }
  };

  const pushMessage = () => {
    message.config({ maxCount: 1 });
    message.success("Invite link copied to clipboard");
  };

  return (
    <div>
      <section>
        <Typography.Title level={5} className="bg-amber-200 inline">
          &nbsp;Title&nbsp;
        </Typography.Title>
        <Input
          value={list.name}
          className="bg-gray-200 text-center mt-4"
          onChange={(event) => (list.name = event.target.value)}
          placeholder="List Title"
        />
      </section>
      <Divider />
      <section>
        <div className="flex flex-row justify-between items-start">
          <Typography.Title level={5} className="bg-amber-200 inline">
            &nbsp;Members&nbsp;
          </Typography.Title>
        </div>
        <div className="flex flex-col gap-4 pt-4">
          {members
            .sort((member) => (member.account?.isMe ? -1 : 1))
            .map((member) => {
              const profile = member.account?.profile as TodoAccountProfile;
              return (
                <div
                  key={`avatar-${member.id}`}
                  className="flex flex-row justify-between items-center "
                >
                  <Avatar
                    size={"large"}
                    className="bg-gray-300 flex-shrink-0"
                    icon={
                      profile?.image ? (
                        <Image image={profile.image} />
                      ) : (
                        <UserOutlined />
                      )
                    }
                  />
                  <Typography.Paragraph ellipsis className="!mb-0 ml-4 mr-auto">
                    {member.account?.isMe
                      ? "You"
                      : member.account?.profile?.name}
                  </Typography.Paragraph>
                  <div className="flex flex-row gap-2">
                    <Tag color={member.role == "admin" ? "success" : "blue"}>
                      {member.role}
                    </Tag>
                    <DeleteOutlined
                      className="text-red-600 text-lg cursor-pointer"
                      onClick={() => {
                        alert("coming soon");
                      }}
                    />
                  </div>
                </div>
              );
            })}
        </div>
        <Divider />
        {list._owner.myRole() === "admin" && (
          <div className="flex flex-row justify-center mt-4">
            <Button
              type="primary"
              icon={<UsergroupAddOutlined />}
              onClick={() => {
                invite("writer");
              }}
            >
              Invite Member
            </Button>
          </div>
        )}
      </section>
    </div>
  );
}
