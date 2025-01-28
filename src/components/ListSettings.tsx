import { List, ListManagerAccount, TodoAccountProfile } from "../schema";
import { Group } from "jazz-tools";
import { Image } from "./Image";
import { createInviteLink, useAccount } from "jazz-react";
import { Button } from "./ui/button";
import { Separator } from "./ui/separator";
import { TypographyHeading } from "./ui/typography/heading";
import { TypographyText } from "./ui/typography/text";
import { Badge } from "./ui/badge";
import { Trash2, User, UserPlus } from "lucide-react";
import { Input } from "./ui/input";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { deleteList, removeAccountFromList } from "@/actions";

export function ListSettings({ list }: { list: List }) {
  const members = list._owner.castAs(Group).members ?? [];
  const { me } = useAccount();
  const navigate = useNavigate();
  const { toast } = useToast();

  const invite = (role: "reader" | "writer") => {
    if (list) {
      const inviteLink = createInviteLink(list, role, {
        valueHint: "list",
      });
      if (inviteLink) {
        navigator.clipboard.writeText(inviteLink);
        toast({ title: "Invite link copied to clipboard" });
      }
    }
  };

  return (
    <div>
      <section>
        <TypographyHeading level={4}>&nbsp;Title&nbsp;</TypographyHeading>
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
          <TypographyHeading level={4}>&nbsp;Members&nbsp;</TypographyHeading>
        </div>
        <div className="flex flex-col gap-4 pt-4">
          {members
            .filter((member) => member.role != "revoked")
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
                    {!member.account?.isMe &&
                      list._owner.myRole() == "admin" && (
                        <Trash2
                          size={20}
                          className="text-red-600 cursor-pointer"
                          onClick={() => {
                            if (member.account)
                              removeAccountFromList(
                                list,
                                member.account.castAs(ListManagerAccount)
                              );
                          }}
                        />
                      )}
                    <Badge>{member.role}</Badge>
                  </div>
                </div>
              );
            })}
        </div>
        {list._owner.myRole() === "admin" && (
          <>
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
            <div>
              <Button
                onClick={() => {
                  deleteList(list, me);
                  toast({
                    title: "List successfully deleted.",
                  });
                  navigate("/", {});
                }}
                variant={"destructive"}
              >
                Delete List
              </Button>
            </div>
          </>
        )}
      </section>
    </div>
  );
}
