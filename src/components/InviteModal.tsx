import { Input, Modal, ModalProps } from "antd";
import { useState } from "react";

export function InviteModal(
  props: ModalProps & { onInvitePressed: (userID: string) => void }
) {
  const [value, setValue] = useState<string>("");

  return (
    <Modal
      {...props}
      title="Invite Person"
      onOk={() => props.onInvitePressed(value)}
    >
      <label htmlFor="">ID of Person</label>
      <Input
        placeholder="ck_01094JIWDWIJWOK939"
        value={value}
        onChange={(newValue) => setValue(newValue.target.value)}
      />
    </Modal>
  );
}
