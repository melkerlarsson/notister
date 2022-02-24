import React, { useState } from 'react';
import { View, Text, StyleSheet, useWindowDimensions, TextInput } from 'react-native';
import Modal from "react-native-modal";
import Button from './Button';


interface ConfirmationModal {
  title: string;
  description: string;
  isVisible: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const ConfirmationModal = ({ title, description, isVisible, onClose, onConfirm }: ConfirmationModal) => {

  const { height, width } = useWindowDimensions();

  const modalWidth = 0.85 * width

  return (
    <Modal
      isVisible={isVisible}
      onBackdropPress={onClose}
      onBackButtonPress={onClose}
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
        <Text style={{ fontWeight: "bold", fontSize: 18, marginBottom: 20 }}>{ title }</Text>

        <Text style={{ fontSize: 16, marginBottom: 20 }}>{ description }</Text>


        <View
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "flex-end",
          }}
        >
          <Button
            title="Cancel"
            onPress={onClose}
            style={{
              width: modalWidth * 0.3,
              shadowOpacity: 0,
              elevation: 0,
              backgroundColor: "#fff",
            }}
            textStyle={{ color: "#269dff" }}
          />
          <Button
            title="Confirm"
            onPress={onConfirm}
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

export default ConfirmationModal;