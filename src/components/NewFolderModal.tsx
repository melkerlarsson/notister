import React, { useState } from 'react';
import { View, Text, StyleSheet, useWindowDimensions, TextInput } from 'react-native';
import Modal from "react-native-modal";
import Button from './Button';


interface NewFolderModalProps {
  isVisible: boolean;
  onClose: () => void;
  onAdd: (folder: NewFolder) => void;
}

const NewFolderModal = ({ isVisible, onClose, onAdd }: NewFolderModalProps) => {

  const { height, width } = useWindowDimensions();

  const modalWidth = 0.85 * width

  const [newFolder, setNewFolder] = useState<NewFolder>({ name: "" });
  const [errorMessage, setErrorMessage] = useState<string>("");

  const onAddButtonPress = () => {
    if (newFolder.name) {
      close();
      onAdd(newFolder);
    } else {
      setErrorMessage("Please provide a name");
    }
    
  }

  const close = () => {
    setErrorMessage("");
    setNewFolder({ name: "" });
    onClose();
  }

  return (
    <Modal
      isVisible={isVisible}
      onBackdropPress={close}
      onBackButtonPress={close}
      animationIn="zoomIn"
      animationOut="zoomOut"
      backdropOpacity={0.2}
      backdropTransitionOutTiming={0}
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <View
        style={{
          display: "flex",
          padding: 20,
          backgroundColor: "#fff",
          width: modalWidth,
          // height: width * 0.5,
          borderRadius: 20,
        }}
      >
        <Text style={{ fontWeight: "bold", fontSize: 18, marginBottom: 20 }}>
          Create folder
        </Text>
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

        <View
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "flex-end",
          }}
        >
          <Button
            title="Cancel"
            onPress={close}
            style={{
              width: modalWidth * 0.3,
              shadowOpacity: 0,
              elevation: 0,
              backgroundColor: "#fff",
            }}
            textStyle={{ color: "#269dff" }}
          />
          <Button
            title="Add"
            onPress={onAddButtonPress}
            style={{
              width: modalWidth * 0.3,
              shadowOpacity: 0,
              elevation: 0,
              backgroundColor: "#fff",
            }}
            textStyle={{ color: "#269dff" }}
          />
        </View>
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