import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput } from 'react-native';
import Modal from "./Modal";
import Button from './Button';


interface NewFolderModalProps {
  isVisible: boolean;
  onClose: () => void;
  onAdd: (folder: NewFolder) => void;
}

const NewFolderModal = ({ isVisible, onClose, onAdd }: NewFolderModalProps) => {

  const [newFolder, setNewFolder] = useState<NewFolder>({ name: "" });
  const [errorMessage, setErrorMessage] = useState<string>("");

  const beforeClose = () => {
    setNewFolder({ name: "" });
    onClose();
  }

  return (
    <Modal
      title="Create folder"
      onClose={beforeClose}
      onButtonPress={() => onAdd(newFolder)}
      isVisible={isVisible}
      validation={{ validate: () => newFolder.name ? true : false, errorMessage: "A folder must have a name" }}
      buttons={{ cancel: { text: "Cancel"}, confirm: { text: "Add" }}}
     
    >
      <View>
        <TextInput
          style={styles.textInput}
          onChangeText={(name) => setNewFolder({ ...newFolder, name: name })}
          value={newFolder.name}
          placeholder="Folder Name"
          textContentType="name"
        />

        {errorMessage ? (
          <Text style={{ fontWeight: "300", fontSize: 16, marginBottom: 10 }}>
            {errorMessage}
          </Text>
        ) : null}

      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  textInput: {
    width: 300,
    height: 50,
    borderRadius: 15,
    borderColor: "#269dff",
    borderWidth: 1,
    marginVertical: 10,
    paddingHorizontal: 15,
  },
});

export default NewFolderModal;