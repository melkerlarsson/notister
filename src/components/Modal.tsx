import React from "react";
import { View, Text, StyleSheet, useWindowDimensions } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { default as RnModal } from "react-native-modal";
import Button from "./Button";

type Buttons = {
  confirm: {
    text: string;
  };
  cancel: {
    text: string;
  };
};

interface ModalProps {
  title: string;
  description?: string;
  children?: React.ReactElement;
  isVisible: boolean;

  buttons?: Buttons;

  onClose: () => void;
  onButtonPress: () => void | Promise<void>;
}

const Modal = ({
  title,
  description,
  children,
  buttons = { confirm: { text: "Confirm" }, cancel: { text: "Cancel" } },
  isVisible,
  onClose,
  onButtonPress,
}: ModalProps) => {
  const { width } = useWindowDimensions();
  const modalWidth = 0.85 * width;

  const onConfirmButtonPressed = async () => {
    await onButtonPress();
    onClose();
  };

  return (
    <RnModal
      style={styles.modal}
      isVisible={isVisible}
      animationIn="zoomIn"
      animationOut="zoomOut"
      onBackdropPress={onClose}
      onBackButtonPress={onClose}
      backdropOpacity={0.2}
      backdropTransitionOutTiming={0}
    >
      <GestureHandlerRootView>
        <View style={[styles.content, { width: modalWidth }]}>
          <Text style={styles.title}>{title}</Text>

          {description ? <Text>{description}</Text> : null}

          {children}

          <View style={styles.buttons}>
            <Button
              style={{ ...styles.button, width: 0.3 * modalWidth }}
              textStyle={styles.buttonTextStyle}
              onPress={onClose}
            >
              {buttons.cancel.text}
            </Button>
            <Button
              style={{ ...styles.button, width: 0.3 * modalWidth }}
              textStyle={styles.buttonTextStyle}
              onPress={onConfirmButtonPressed}
            >
              {buttons.confirm.text}
            </Button>
          </View>
        </View>
      </GestureHandlerRootView>
    </RnModal>
  );
};

const styles = StyleSheet.create({
  modal: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontWeight: "bold",
    fontSize: 18,
    marginBottom: 20,
  },
  description: {},
  content: {
    display: "flex",
    padding: 20,
    backgroundColor: "#fff",
    borderRadius: 20,
  },
  buttons: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  button: {
    shadowOpacity: 0,
    elevation: 0,
    backgroundColor: "#fff",
  },
  buttonTextStyle: {
    color: "#269dff",
  },
});

export default Modal;
