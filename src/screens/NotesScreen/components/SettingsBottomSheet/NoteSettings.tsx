import { View, Text, StyleSheet } from "react-native";
import BottomSheet, { BottomSheetBackdrop, useBottomSheetSpringConfigs } from "@gorhom/bottom-sheet";
import { Portal, PortalHost } from "@gorhom/portal";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Divider from "../../../../components/Divider";

import { Ionicons } from "@expo/vector-icons";
import ConfirmationModal from "../../../../components/ConfirmationModal";
import MenuOption from "../../../../components/MenuOption";
import UpdateNameModal from "./components/UpdateNameModal";
import { TouchableOpacity } from "react-native-gesture-handler";
import { COLORS } from "../../../../theme/colors";

interface NoteSettingsProps {
	open: boolean;
	onClose: () => void;
	note: Note;
	onDeleteNote: (noteId: string, studyDataId: string) => Promise<void>;
	onRenameNote: (noteId: string, name: string) => Promise<void>;
}

const NoteSettings = ({ open, onClose, note, onDeleteNote, onRenameNote }: NoteSettingsProps) => {
	const bottomSheetRef = useRef<BottomSheet>(null);

	const [isConfimationModalVisible, setIsConfimationModalVisible] = useState(false);
	const [isUpdateNameModalVisible, setIsUpdateNameModalVisible] = useState(false);

	useEffect(() => {
		if (open) {
			bottomSheetRef.current?.close();
			onClose();
		} else {
			bottomSheetRef.current?.expand();
		}
	}, [open]);

	const snapPoints = useMemo(() => ["50%"], []);

	const animationConfigs = useBottomSheetSpringConfigs({
		damping: 80,
		overshootClamping: true,
		restDisplacementThreshold: 0.1,
		restSpeedThreshold: 0.1,
		stiffness: 400,
	});

	const renderBackdrop = useCallback((props) => <BottomSheetBackdrop {...props} disappearsOnIndex={-1} appearsOnIndex={0} opacity={0.2} />, []);

	const deleteNote = async () => {
		console.log("Deleting note");
		await onDeleteNote(note.id, note.studyDataId);
		setIsConfimationModalVisible(false);
	};

	const onDeleteButtonPressed = () => {
		bottomSheetRef.current?.close();
		setIsConfimationModalVisible(true);
	};

	const onUpdateNameButtonPressed = () => {
		bottomSheetRef.current?.close();
		setIsUpdateNameModalVisible(true);
	};

	return (
		<>
			<Portal>
				<BottomSheet ref={bottomSheetRef} index={-1} snapPoints={snapPoints} enablePanDownToClose backdropComponent={renderBackdrop} animationConfigs={animationConfigs}>
					<View style={styles.content}>
						<View style={styles.heading}>
							<Ionicons color="#000" size={24} name="clipboard-outline" />
							<TouchableOpacity onPress={onUpdateNameButtonPressed}>
								<Text style={styles.title}>{note.name}</Text>
							</TouchableOpacity>
						</View>
						<Divider />

						<MenuOption disabled text="Share" icon={<Ionicons name="person-add-outline" size={24} />} onPress={() => null} />
						<MenuOption text="Update Name" icon={<Ionicons name="pencil-sharp" size={24} />} onPress={onUpdateNameButtonPressed} />
						<MenuOption text="Delete" textColor={COLORS.error} icon={<Ionicons name="trash-outline" size={24} color={COLORS.error} />} onPress={onDeleteButtonPressed} />
					</View>
				</BottomSheet>
			</Portal>
			<UpdateNameModal
				title="Update note name"
				isVisible={isUpdateNameModalVisible}
				onClose={() => setIsUpdateNameModalVisible(false)}
				currentName={note.name}
				onSave={async (name) => await onRenameNote(note.id, name)}
			/>
			<ConfirmationModal
				title="Delete note"
				description="Are you sure that you want to delete this note? This action is irreversible"
				isVisible={isConfimationModalVisible}
				onClose={() => setIsConfimationModalVisible(false)}
				onConfirm={deleteNote}
			/>
			<PortalHost name="settingsBottomSheet" />
		</>
	);
};

const styles = StyleSheet.create({
	content: {},
	heading: {
		display: "flex",
		flexDirection: "row",
		alignItems: "center",
		marginTop: -10,
		paddingVertical: 15,
		paddingHorizontal: 20,
	},
	title: {
		fontSize: 18,
		fontWeight: "bold",
		marginLeft: 10,
	},
});

export default NoteSettings;
