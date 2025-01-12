import { ProgressiveImg } from "jazz-react";
import { ImageDefinition } from "jazz-tools";

export function Image({ image }: { image: ImageDefinition }) {
  return (
    <ProgressiveImg image={image}>
      {({ src }) => <img src={src} />}
    </ProgressiveImg>
  );
}
