import { doc, getDoc, updateDoc, DocumentReference } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { View, StyleSheet, RefreshControl, ScrollView } from "react-native";
import Folder from "./components/Folder";
import { collections } from "../../firebase/config";
import { NotesScreenNavigationProps } from "../../navigation/NotesStack";
import { Ionicons } from "@expo/vector-icons";

import { FloatingAction, IActionProps } from "react-native-floating-action";
import NewFolderModal from "./components/NewFolderModal";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/rootReducer";

import { v4 as createUuid } from "uuid";
import SettingsBottomSheet from "./components/SettingsBottomSheet/SettingsBottomSheet";

import * as DocumentPicker from "expo-document-picker";
import Note from "./components/Note";
import ImageViewer from "./components/ImageViewer/ImageViewer";
import { folderAPI, noteAPI } from "../../firebase";
import Toast from "../../components/Toast";

type NotesScreenProps = NotesScreenNavigationProps;

const NotesScreen = ({ navigation, route }: NotesScreenProps) => {
	const user = useSelector((state: RootState) => state.userReducer.user);

	const IS_ROOT_FOLDER = !route.params?.folderId;

	const [currentFolderData, setCurrentFolderData] = useState<RootFolder | Folder | undefined | null>(null);
	const [currentFolderRef, setCurrentFolderRef] = useState<DocumentReference<RootFolder | Folder> | null>(null);
	const [selectedFolder, setSelectedFolder] = useState<SubFolder | null>(null);

	const [loading, setLoading] = useState<boolean>(true);

	const [isSettingsBottomSheetVisible, setIsSettingsBottomSheetVisible] = useState<boolean>(false);
	const [isNewFolderModalVisible, setIsNewFolderModalVisible] = useState<boolean>(false);

	const [isImageModalVisible, setIsImageModalVisible] = useState<boolean>(false);
	const [imageIndex, setImageIndex] = useState<number>(0);

	const fetchItems = async (): Promise<void> => {
		setLoading(true);
		try {
			if (IS_ROOT_FOLDER) {
				const rootFolderDoc = await getDoc(doc(collections.rootFolders, user?.uid));
				setCurrentFolderData(rootFolderDoc.data());
				setCurrentFolderRef(rootFolderDoc.ref);
				setLoading(false);
			} else {
				const folderDoc = await getDoc(doc(collections.folders, route.params.folderId));
				setCurrentFolderData(folderDoc.data());
				setCurrentFolderRef(folderDoc.ref);
				setLoading(false);
			}
		} catch (error) {
			Toast.show({ type: "error", title: "Error", description: "An error occurred while loading folder. Please try again." });
			setLoading(false);
		}
	};

	useEffect(() => {
		navigation.setOptions({
			title: IS_ROOT_FOLDER ? "Your notes" : route.params.folderName,
		});

		void fetchItems();
	}, [route.params]);

	const onFolderPress = (folderId: string, folderName: string) => {
		navigation.push("Notes", { folderId: folderId, folderName: folderName });
	};

	const onFolderLongPress = (folder: SubFolder) => {
		setSelectedFolder(folder);
		setIsSettingsBottomSheetVisible(true);
	};

	const onAddFolder = async (newFolder: NewFolder) => {
		if (user && currentFolderRef && currentFolderData) {
			try {
				const subFolder: SubFolder = await folderAPI.addFolder({ newFolder, userId: user.uid, parentFolderRef: currentFolderRef, parentSubFolders: currentFolderData.subFolders });
				setCurrentFolderData({ ...currentFolderData, subFolders: [...currentFolderData.subFolders, subFolder] });
			} catch (error) {
				Toast.show({ title: "Error", description: "An error occurred while adding folder. Please try again", type: "error" });
			}
		}
	};

	const onDeleteFolder = async (folderId: string): Promise<void> => {
		if (currentFolderRef && currentFolderData) {
			try {
				const newSubFolders: SubFolder[] = await folderAPI.deleteFolder({ folderId, parentFolderRef: currentFolderRef, parentSubFolders: currentFolderData.subFolders });
				setCurrentFolderData({ ...currentFolderData, subFolders: newSubFolders });
			} catch (error) {
				Toast.show({ title: "Error", description: "An error occurred while deleting folder. Please try again", type: "error" });
			}
		}
	};

	const onUpdateSubFolder = async (folderId: string, data: Partial<SubFolder>) => {
		if (currentFolderRef && currentFolderData && currentFolderData.subFolders) {
			const response = await folderAPI.updateSubFolder({ folderId, data, parentFolderRef: currentFolderRef, parentFolderData: currentFolderData });

			if (response.error) {
				Toast.show({ title: response.error.title, description: response.error.description, type: "error" });
			} else {
				setCurrentFolderData(response.data);
			}
		}
	};

	const onAddNote = async () => {
		if (!user || !currentFolderData || !currentFolderRef) return;

		try {
			const result = await DocumentPicker.getDocumentAsync({ type: "image/*" });

			if (result.type === "cancel") return;

			const noteId = createUuid();

			const onUploaded = async (imageUrl: string) => {
				const note: Note = {
					id: noteId,
					imageUrl: imageUrl,
					name: result.name,
					userId: user.uid,
					sharedWith: [],
				};

				setCurrentFolderData({ ...currentFolderData, notes: [...currentFolderData.notes, note] });
				await updateDoc(currentFolderRef, { notes: [...currentFolderData.notes, note] });
			};

			await noteAPI.uploadImage({
				url: result.uri,
				id: noteId,
				onUploaded: onUploaded,
				onError: () => Toast.show({ title: "Error", description: "Error uploading image. Please try again.", type: "error" }),
			});
		} catch (error) {
			Toast.show({ title: "Error", description: "Error adding note. Please try again.", type: "error" });
		}
	};

	const actions: IActionProps[] = [
		{
			name: "Folder",
			text: "New Folder",
			icon: <Ionicons name="folder" color="#fff" />,
		},
		{
			name: "Note",
			text: "New Note",
			icon: <Ionicons name="phone-portrait-outline" color="#fff" />,
		},
	];

	const showImageViewer = (imageIndex: number) => {
		setImageIndex(imageIndex);
		setIsImageModalVisible(true);
	};

	const FolderItems = () => {
		if (!currentFolderData) return null;

		return (
			<>
				{currentFolderData.subFolders?.map((folder, index) => (
					<Folder key={index} color={folder.color} name={folder.name} onPress={() => onFolderPress(folder.id, folder.name)} onLongPress={() => onFolderLongPress(folder)} />
				))}
				{currentFolderData &&
					currentFolderData.notes?.map((note, index) => <Note key={index} imageUrl={note.imageUrl} name={note.name} onPress={() => showImageViewer(index)} onLongPress={() => null} />)}
			</>
		);
	};

	return (
		<View style={{ flex: 1 }}>
			<ScrollView refreshControl={<RefreshControl enabled={true} onRefresh={fetchItems} refreshing={loading} />}>
				<View style={styles.container}>
					<FolderItems />
				</View>
			</ScrollView>
			<NewFolderModal isVisible={isNewFolderModalVisible} onClose={() => setIsNewFolderModalVisible(false)} onAdd={onAddFolder} />
			<FloatingAction
				actions={actions}
				overlayColor="rgba(226, 226, 226, 0.8)"
				onPressItem={(name) => {
					if (name === "Folder") {
						setIsNewFolderModalVisible(true);
					} else if (name === "Note") {
						void onAddNote();
					}
				}}
			/>
			{selectedFolder && (
				<SettingsBottomSheet
					folder={selectedFolder}
					onDeleteFolder={(folderId) => onDeleteFolder(folderId)}
					open={isSettingsBottomSheetVisible}
					onClose={() => setIsSettingsBottomSheetVisible(false)}
					onUpdateFolder={(folderId, data) => onUpdateSubFolder(folderId, data)}
				/>
			)}
			{currentFolderData?.notes && (
				<ImageViewer
					visible={isImageModalVisible}
					onClose={() => setIsImageModalVisible(false)}
					images={Array.from(currentFolderData.notes, (note) => ({ url: note.imageUrl }))}
					startIndex={imageIndex}
				/>
			)}
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		display: "flex",
		flex: 1,
		flexDirection: "row",
		flexWrap: "wrap",
		backgroundColor: "#fff",
	},
});

export default NotesScreen;
