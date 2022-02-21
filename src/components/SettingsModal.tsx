import { View, Text, StyleSheet, useWindowDimensions } from 'react-native';
import Modal from "react-native-modal";



interface SettingsModalProps {
  isVisible: boolean;
  folder: SubFolder;
  onClose: () => void;

}

const SettingsModal = ({ isVisible, folder, onClose }: SettingsModalProps) => {

  const { height, width } = useWindowDimensions();

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
          height: width * 0.5,
          borderRadius: 20,
        }}
      >
        <Text style={{ fontWeight: "bold", fontSize: 18 }}>{folder.name}</Text>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({

});

export default SettingsModal;