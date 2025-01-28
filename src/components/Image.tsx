import { ProgressiveImg } from "jazz-react";
import { ImageDefinition } from "jazz-tools";

export function Image({ image }: { image: ImageDefinition }) {
  return (
    <ProgressiveImg image={image}>
      {({ src }) => (
        <img
          style={{ height: "100%", width: "100%", objectFit: "cover" }}
          src={src}
        />
      )}
    </ProgressiveImg>
  );
}
