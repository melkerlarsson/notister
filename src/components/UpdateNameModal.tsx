import { useEffect, useState } from "react";
import { View, StyleSheet } from "react-native";
import Modal, { BaseModalProps } from "./Modal";
import TextInput from "./TextInput";

interface UpdateNameModalProps extends BaseModalProps {
  onSave: (name: string) => Promise<void>;
  currentName: string;
}

const UpdateNameModal = ({
  isVisible,
  onClose,
  onSave,
  currentName,
}: UpdateNameModalProps) => {
  const [name, setName] = useState(currentName);

  useEffect(() => setName(currentName), [currentName]);

  const close = () => {
    onClose();
    setName(currentName);
  }

  return (
    <Modal
      title="Update folder name"
      isVisible={isVisible}
      onClose={close}
      buttons={{ cancel: { text: "Cancel" }, confirm: { text: "Save" } }}
      onButtonPress={async () => await onSave(name)}
      validation={{
        errorMessage: "Please enter a folder name",
        validate: () => (name ? true : false),
      }}
    >
      <TextInput
        onChangeText={(name) => setName(name)}
        value={name}
        placeholder="Folder name"
        textContentType="name"
        autoFocus
        selectTextOnFocus
      />
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default UpdateNameModal;
