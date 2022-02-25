import React, { useEffect, useState } from "react";
import { View, StyleSheet, useWindowDimensions, Text } from "react-native";
import Modal from "react-native-modal";
import { FOLDER_COLORS } from "../theme/colors";
import Button from "./Button";
import { Ionicons } from "@expo/vector-icons";
import {
  GestureHandlerRootView,
  TouchableOpacity,
} from "react-native-gesture-handler";

interface ColorPickerModalProps {
  isVisible: boolean;
  onClose: () => void;
  onColorSelected: (color: string) => Promise<void>;
  currentColor: string;
}

const ColorPickerModal = ({
  isVisible,
  onClose,
  onColorSelected,
  currentColor,
}: ColorPickerModalProps) => {
  const { height, width } = useWindowDimensions();
  const modalWidth = 0.85 * width;

  const [selectedColor, setSelectedColor] = useState("");

  useEffect(() => setSelectedColor(currentColor), [currentColor]);

  const onSaveButtonPressed = async () => {
    onColorSelected(selectedColor);
    onClose();
  }

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
      <GestureHandlerRootView>
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
            Pick a color
          </Text>

          <View style={styles.container}>
            {FOLDER_COLORS.map((color) => (
              <TouchableOpacity
                key={color.name}
                activeOpacity={0.6}
                onPress={() => setSelectedColor(color.color)}
              >
                <View style={[styles.color, { backgroundColor: color.color }]}>
                  {selectedColor === color.color ? (
                    <Ionicons name="checkmark" color="#fff" size={34} />
                  ) : null}
                </View>
              </TouchableOpacity>
            ))}
          </View>

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
              title="Save"
              onPress={onSaveButtonPressed}
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
      </GestureHandlerRootView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    justifyContent: "flex-start",
  },

  color: {
    width: 50,
    height: 50,
    borderRadius: 10,
    margin: 10,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
});

export default ColorPickerModal;
