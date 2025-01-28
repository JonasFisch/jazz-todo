import { co, ImageDefinition } from "jazz-tools";
import { createImage } from "jazz-browser-media-images";
import { Image } from "./Image";
import { useAccount } from "jazz-react";
import { useClerk } from "@clerk/clerk-react";
import { Input } from "./ui/input";
import { TypographyHeading } from "./ui/typography/heading";
import { TypographyText } from "./ui/typography/text";
import { Button } from "./ui/button";

export function ProfileImageUpload() {
  const { me } = useAccount();

  const handleUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      if (me.profile) {
        createImage(file, {
          owner: me.profile._owner,
        }).then((image) => {
          if (me.profile)
            me.profile.image = image as unknown as co<ImageDefinition>;
        });
      }
      return "";
    }
  };

  const deleteImage = () => {
    if (!me?.profile) return;

    me.profile.image = null;
  };

  const clerk = useClerk();

  return (
    <>
      <div className="flex flex-col items-center">
        <TypographyHeading level={3} className="mb-4">
          {clerk.user?.username}
        </TypographyHeading>
        <label
          htmlFor="image-upload"
          className="cursor-pointer avatar-uploader transition-colors border-2 rounded-full border-dashed border-accent hover:border-primary"
        >
          <div className="m-4 w-32 h-32 rounded-full overflow-hidden">
            {me.profile?.image ? (
              <Image image={me.profile.image} />
            ) : (
              <div className="h-full w-full p-3 flex flex-row justify-center items-center">
                <TypographyText className="text-center text-gray-500">
                  click to add profile image
                </TypographyText>
              </div>
            )}
          </div>
        </label>
        {me.profile?.image && (
          <div className="flex flex-row gap-3 mt-4">
            <label htmlFor="image-upload" className="cursor-pointer">
              <Button variant={"default"} className="pointer-events-none">
                Change picture
              </Button>
            </label>
            <Button variant={"secondary"} onClick={deleteImage}>
              Delete picture
            </Button>
          </div>
        )}
        <Input
          id="image-upload"
          type="file"
          className="hidden"
          onChange={handleUpload}
        />
      </div>
    </>
  );
}
