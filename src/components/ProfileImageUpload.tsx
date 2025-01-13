import { Avatar, Typography, Upload, UploadProps } from "antd";
import { co, ImageDefinition } from "jazz-tools";
import { createImage } from "jazz-browser-media-images";
import { useState } from "react";
import { LoadingOutlined, PlusOutlined } from "@ant-design/icons";
import { Image } from "./Image";
import { useAccount } from "jazz-react";
import { useClerk } from "@clerk/clerk-react";

export function ProfileImageUpload() {
  const { me } = useAccount();
  const [loading, setLoading] = useState(false);

  const handleChange: UploadProps["onChange"] = (info) => {
    if (info.file.status === "uploading") setLoading(true);
    if (info.file.status === "done") setLoading(false);
  };

  // const deleteImage = () => {
  //   if (!me?.profile) return;

  //   me.profile.image = null;
  // };

  const clerk = useClerk();

  return (
    <>
      <div className="flex flex-col items-center">
        <Typography.Title>{clerk.user?.username}</Typography.Title>
        <Upload
          name="avatar"
          listType="picture-circle"
          className="avatar-uploader"
          showUploadList={false}
          action={(file) => {
            if (me.profile) {
              createImage(file, {
                owner: me.profile._owner,
              }).then((image) => {
                if (me.profile)
                  me.profile.image = image as unknown as co<ImageDefinition>;
                setLoading(false);
              });
            }
            return "";
          }}
          onChange={handleChange}
        >
          {me.profile?.image ? (
            <Avatar
              className="h-[80%] w-[80%]"
              icon={<Image image={me.profile.image} />}
            ></Avatar>
          ) : (
            <button style={{ border: 0, background: "none" }} type="button">
              {loading ? <LoadingOutlined /> : <PlusOutlined />}
              <div style={{ marginTop: 8 }}>Upload</div>
            </button>
          )}
        </Upload>
      </div>
    </>
  );
}
