import { List, TodoAccountProfile } from "../schema";
import { Group } from "jazz-tools";
import { Image } from "./Image";
import { createInviteLink } from "jazz-react";
import { Button } from "./ui/button";
import { Separator } from "./ui/separator";
import { toast } from "sonner";
import { TypographyHeading } from "./ui/typography/heading";
import { TypographyText } from "./ui/typography/text";
import { Badge } from "./ui/badge";
import { Trash2, User, UserPlus } from "lucide-react";
import { Input } from "./ui/input";

export function ListSettings({ list }: { list: List }) {
  const members = list._owner.castAs(Group).members ?? [];

  const invite = (role: "reader" | "writer") => {
    if (list) {
      const inviteLink = createInviteLink(list, role, {
        valueHint: "list",
      });
      if (inviteLink) {
        navigator.clipboard.writeText(inviteLink);
        toast("Invite link copied to clipboard", { dismissible: true });
      }
    }
  };

  return (
    <div>
      <section>
        <TypographyHeading level={4} className="bg-amber-200 inline">
          &nbsp;Title&nbsp;
        </TypographyHeading>
        <Input
          value={list.name}
          className="text-center mt-4"
          onChange={(event) => (list.name = event.target.value)}
          placeholder="List Title"
        />
      </section>
      <Separator className="my-6" />
      <section>
        <div className="flex flex-row justify-between items-start">
          <TypographyHeading level={4} className="bg-amber-200 inline">
            &nbsp;Members&nbsp;
          </TypographyHeading>
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
                  <div className="w-8 h-8 rounded-full overflow-hidden">
                    {profile?.image ? (
                      <Image image={profile.image} />
                    ) : (
                      <User />
                    )}
                  </div>
                  <TypographyText className="!mb-0 ml-4 mr-auto text-ellipsis">
                    {member.account?.isMe
                      ? "You"
                      : member.account?.profile?.name}
                  </TypographyText>
                  <div className="flex flex-row gap-2">
                    <Badge>{member.role}</Badge>
                    <Trash2
                      size={20}
                      className="text-red-600 cursor-pointer"
                      onClick={() => {
                        alert("coming soon");
                      }}
                    />
                  </div>
                </div>
              );
            })}
        </div>
        {list._owner.myRole() === "admin" && (
          <div className="flex flex-row justify-center mt-4">
            <Button
              onClick={() => {
                invite("writer");
              }}
            >
              <UserPlus />
              Invite Member
            </Button>
          </div>
        )}
      </section>
    </div>
  );
}
