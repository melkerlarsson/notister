import React, { useEffect, useState } from "react";
import { View, StyleSheet } from "react-native";
import { FOLDER_COLORS } from "../../../../../theme/colors";

import Modal from "../../../../../components/Modal";

import { Ionicons } from "@expo/vector-icons";
import { TouchableOpacity } from "react-native-gesture-handler";

interface ColorPickerModalProps {
	isVisible: boolean;
	onClose: () => void;
	onSave: (color: string) => Promise<void>;
	currentColor: string;
}

const ColorPickerModal = ({ isVisible, onClose, onSave, currentColor }: ColorPickerModalProps) => {
	const [selectedColor, setSelectedColor] = useState("");

	useEffect(() => setSelectedColor(currentColor), [currentColor]);

	useEffect(() => {
		if (isVisible === true) return;

		setTimeout(() => setSelectedColor(currentColor), 200);
	}, [isVisible]);

	const onSaveButtonPressed = async () => {
		await onSave(selectedColor);
		onClose();
	};

	return (
		<Modal title="Pick a color" isVisible={isVisible} onClose={onClose} onButtonPress={onSaveButtonPressed} buttons={{ confirm: { text: "Save" }, cancel: { text: "Cancel" } }}>
			<View style={styles.container}>
				{FOLDER_COLORS.map((color) => (
					<TouchableOpacity key={color.name} activeOpacity={0.6} onPress={() => setSelectedColor(color.color)}>
						<View style={[styles.color, { backgroundColor: color.color }]}>{selectedColor === color.color ? <Ionicons name="checkmark" color="#fff" size={34} /> : null}</View>
					</TouchableOpacity>
				))}
			</View>
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
