// import React from "react";
// import { View, Text, StyleSheet } from "react-native";
// import MenuOption from "../../../../components/MenuOption";
// import SettingsBottomSheet, { SettingsBottomSheetBaseProps } from "./SettingsBottomSheet";

// interface NoteSettingsBottomSheetProps extends SettingsBottomSheetBaseProps {
// 	noteName: string;
// }

// const NoteSettingsBottomSheet = ({ noteName, ...props }: NoteSettingsBottomSheetProps) => {
// 	return (
// 		<SettingsBottomSheet headerText={noteName} headerIcon={<Ionicons name="document-text-outline" size={24} color="black" {...props} />}>
// 			<MenuOption disabled text="Share" icon={<Ionicons name="person-add-outline" size={24} />} onPress={() => null} />
// 			<MenuOption text="Update Name" icon={<Ionicons name="pencil-sharp" size={24} />} onPress={onUpdateNameButtonPressed} />
// 			<MenuOption text="Color" icon={<Ionicons name="md-color-palette-outline" size={24} />} onPress={onColorButtonPressed} />
// 			<MenuOption text="Delete" icon={<Ionicons name="trash-outline" size={24} />} onPress={onDeleteButtonPressed} />
// 		</SettingsBottomSheet>
// 	);
// };

// const styles = StyleSheet.create({});

// export default NoteSettingsBottomSheet;
