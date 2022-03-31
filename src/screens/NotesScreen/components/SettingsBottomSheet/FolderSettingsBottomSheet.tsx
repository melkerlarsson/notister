import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Button } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import MenuOption from "../../../../components/MenuOption";
import SettingsBottomSheet, {
	SettingsBottomSheetBaseProps,
} from "./SettingsBottomSheet2";
import ConfirmationModal from "../../../../components/ConfirmationModal";
import ColorPickerModal from "./components/ColorPickerModal";
import UpdateNameModal from "./components/UpdateNameModal";
import FolderIcon from "../../../../components/FolderIcon";

interface FolderSettingsBottomSheetProps extends SettingsBottomSheetBaseProps {
	folder: SubFolder;
	onDeleteFolder: (folderId: string) => Promise<void>;
	onUpdateFolder: (folderId: string, data: Partial<Folder>) => Promise<void>;
}

const FolderSettingsBottomSheet = ({
	onDeleteFolder,
	onUpdateFolder,
	folder,
	open,
	onClose,
}: FolderSettingsBottomSheetProps) => {
	const [isConfimationModalVisible, setIsConfimationModalVisible] =
		useState(false);
	const [isColorPickerModalVisible, setIsColorPickerModalVisible] =
		useState(false);
	const [isUpdateNameModalVisible, setIsUpdateNameModalVisible] =
		useState(false);

	const deleteFolder = async () => {
		await onDeleteFolder(folder.id);
		setIsConfimationModalVisible(false);
	};

	const onDeleteButtonPressed = () => {
		onClose();
		setIsConfimationModalVisible(true);
	};

	const onColorButtonPressed = () => {
		onClose();
		setIsColorPickerModalVisible(true);
	};

	const onUpdateNameButtonPressed = () => {
		onClose();
		setIsUpdateNameModalVisible(true);
	};

	const confirmationModal = (
		<ConfirmationModal
			title="Delete folder"
			description="Are you sure that you want to delete this folder and all of its content? This action is irreversible"
			isVisible={isConfimationModalVisible}
			onClose={() => setIsConfimationModalVisible(false)}
			onConfirm={deleteFolder}
		/>
	);

	const colorPickerModal = (
		<ColorPickerModal
			isVisible={isColorPickerModalVisible}
			onClose={() => setIsColorPickerModalVisible(false)}
			currentColor={folder.color}
			onSave={async (color) =>
				await onUpdateFolder(folder.id, { color: color })
			}
		/>
	);
	const updateNamemModal = (
		<UpdateNameModal
			isVisible={isUpdateNameModalVisible}
			onClose={() => setIsUpdateNameModalVisible(false)}
			currentName={folder.name}
			onSave={async (name) => await onUpdateFolder(folder.id, { name: name })}
		/>
	);

	return (
		<SettingsBottomSheet
			headerText={folder.name}
			headerIcon={<FolderIcon color={folder.color} size={24} />}
			open={open}
			onClose={onClose}
			modals={[confirmationModal, colorPickerModal, updateNamemModal]}
		>
			<MenuOption
				disabled
				text="Share"
				icon={<Ionicons name="person-add-outline" size={24} />}
				onPress={() => null}
			/>
			<MenuOption
				text="Update Name"
				icon={<Ionicons name="pencil-sharp" size={24} />}
				onPress={onUpdateNameButtonPressed}
			/>
			<MenuOption
				text="Color"
				icon={<Ionicons name="md-color-palette-outline" size={24} />}
				onPress={onColorButtonPressed}
			/>
			<MenuOption
				text="Delete"
				icon={<Ionicons name="trash-outline" size={24} />}
				onPress={() => onClose()}
			/>
			<Button title={"Close"} onPress={onClose}></Button>
		</SettingsBottomSheet>
	);
};

const styles = StyleSheet.create({});

export default FolderSettingsBottomSheet;
