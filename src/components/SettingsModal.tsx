import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, useWindowDimensions, ActivityIndicator } from 'react-native';
import Modal from "react-native-modal";

import Button from './Button';



interface SettingsModalProps {
  isVisible: boolean;
  folder: SubFolder;
  onClose: () => void;
  onDeleteFolder: (folderId: string) => Promise<void>

}

const SettingsModal = ({ isVisible, folder, onClose, onDeleteFolder }: SettingsModalProps) => {

  const { height, width } = useWindowDimensions();

  const [isLoading, setIsLoading] = useState(false);

  const deleteFolder = async () => {
    setIsLoading(true);
    console.log("Before delete")
    await onDeleteFolder(folder.id);
    console.log("After delete")
    onClose();
  }

  useEffect(()=> console.log(isLoading), [isLoading])

  return (
    <Modal
      isVisible={isVisible}
      onBackdropPress={onClose}
      animationIn="zoomIn"
      animationOut="zoomOut"
      onBackButtonPress={onClose}
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
          width: width * 0.8,
          //height: width * 0.5,
          borderRadius: 20,
        }}
      >
        <Text style={{ fontWeight: "bold", fontSize: 18, marginBottom: 20 }}>{folder.name}</Text>
        <Button onPress={deleteFolder} style={{ backgroundColor: "#ff3434", shadowColor: "#ff3434", width: 100 }} >
          { isLoading ? <ActivityIndicator color="#fff" size="small" /> : "Delete"}
        </Button>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({

});

export default SettingsModal;