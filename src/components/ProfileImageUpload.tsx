import { co, ImageDefinition } from "jazz-tools";
import { createImage } from "jazz-browser-media-images";
import { Image } from "./Image";
import { useAccount } from "jazz-react";
import { useClerk } from "@clerk/clerk-react";
import { Input } from "./ui/input";
import { TypographyHeading } from "./ui/typography/heading";

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

  // const deleteImage = () => {
  //   if (!me?.profile) return;

  //   me.profile.image = null;
  // };

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
          {me.profile?.image ? (
            <div className="m-4 w-32 h-32 rounded-full overflow-hidden">
              <Image image={me.profile.image} />
            </div>
          ) : (
            <button style={{ border: 0, background: "none" }} type="button">
              <div style={{ marginTop: 8 }}>Upload</div>
            </button>
          )}
        </label>
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
