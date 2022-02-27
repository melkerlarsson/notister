import React, { useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import Modal, { BaseModalProps } from "../../../components/Modal";
import TextInput from "../../../components/TextInput";

interface NewFolderModalProps extends BaseModalProps {
  onAdd: (folder: NewFolder) => void;
}

const NewFolderModal = ({ isVisible, onClose, onAdd }: NewFolderModalProps) => {
	const [newFolder, setNewFolder] = useState<NewFolder>({ name: "" });

	const beforeClose = () => {
		setNewFolder({ name: "" });
		onClose();
	};

	return (
		<Modal
			title="Create folder"
			onClose={beforeClose}
			onButtonPress={() => onAdd(newFolder)}
			isVisible={isVisible}
			validation={{ validate: () => (newFolder.name ? true : false), errorMessage: "A folder must have a name" }}
			buttons={{ cancel: { text: "Cancel" }, confirm: { text: "Add" } }}
		>
			<View>
				<TextInput style={styles.textInput} onChangeText={(name) => setNewFolder({ ...newFolder, name: name })} value={newFolder.name} placeholder="Folder Name" textContentType="name" />
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
