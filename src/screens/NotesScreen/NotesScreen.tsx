import { doc, getDoc, updateDoc, DocumentReference } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { View, StyleSheet, RefreshControl } from "react-native";
import { FlatList } from "react-native-gesture-handler";
import Folder from "./components/Folder";
import { collections } from "../../firebase/config";
import { NotesScreenNavigationProps } from "../../navigation/NotesStack";
import { Ionicons } from "@expo/vector-icons";

import { FloatingAction, IActionProps } from "react-native-floating-action";
import NewFolderModal from "./components/NewFolderModal";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/rootReducer";

import { v4 as createUuid } from "uuid";
import FolderSettings from "./components/SettingsBottomSheet/FolderSettings";

import * as DocumentPicker from "expo-document-picker";
import Note from "./components/Note";
import ImageViewer from "./components/ImageViewer/ImageViewer";
import { folderAPI, noteAPI } from "../../firebase";
import Toast from "../../components/Toast";
import NoteSettings from "./components/SettingsBottomSheet/NoteSettings";
import { MAX_NUMBER_OF_NOTES } from "../../constants";
import { isFolderItemNote } from "../../util";

type NotesScreenProps = NotesScreenNavigationProps;

const NotesScreen = ({ navigation, route }: NotesScreenProps) => {
	const user = useSelector((state: RootState) => state.userReducer.user);

	const IS_ROOT_FOLDER = !route.params?.folderId;

	const [currentFolderData, setCurrentFolderData] = useState<RootFolder | Folder | undefined | null>(null);
	const [currentFolderRef, setCurrentFolderRef] = useState<DocumentReference<RootFolder | Folder> | null>(null);
	const [selectedFolder, setSelectedFolder] = useState<SubFolder | null>(null);
	const [selectedNote, setSelectedNote] = useState<Note | null>(null);

	const [loading, setLoading] = useState<boolean>(true);

	const [isSettingsBottomSheetVisible, setIsSettingsBottomSheetVisible] = useState<boolean>(false);
	const [isNoteSettingsVisible, setIsNoteSettingsVisible] = useState<boolean>(false);
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

	const onNoteLongPress = (note: Note) => {
		setSelectedNote(note);
		setIsNoteSettingsVisible(true);
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
		if (currentFolderRef && currentFolderData && user !== null) {
			try {
				const newSubFolders: SubFolder[] = await folderAPI.deleteFolder({ userId: user.uid, folderId, parentFolderRef: currentFolderRef, parentSubFolders: currentFolderData.subFolders });
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
			const currentNumberOfNotes = await noteAPI.getNumberOfNotes(user.uid);

			if (currentNumberOfNotes >= MAX_NUMBER_OF_NOTES) {
				Toast.show({ title: "Could not add note", description: `You already have reached the maximum number of notes (${MAX_NUMBER_OF_NOTES})`, type: "error", duration: 2000 });
				return;
			}

			const result = await DocumentPicker.getDocumentAsync({ type: "image/*" });

			if (result.type === "cancel") return;

			const noteId = createUuid();

			const onUploaded = async (imageUrl: string) => {
				const studyDataId = await noteAPI.initializeStudyData({ imageUrl: imageUrl, userId: user.uid });

				const note: Note = {
					id: noteId,
					imageUrl: imageUrl,
					name: result.name,
					userId: user.uid,
					sharedWith: [],
					studyDataId,
				};

				setCurrentFolderData({ ...currentFolderData, notes: [...currentFolderData.notes, note] });
				await updateDoc(currentFolderRef, { notes: [...currentFolderData.notes, note] });

				setCurrentFolderData({ ...currentFolderData, notes: [...currentFolderData.notes, note] });
			};

			await noteAPI.uploadNote({
				url: result.uri,
				id: noteId,
				userId: user.uid,
				currentNumberOfNotes,
				onUploaded: onUploaded,
				onError: () => Toast.show({ title: "Error", description: "Error uploading image. Please try again.", type: "error" }),
			});
		} catch (error) {
			Toast.show({ title: "Error", description: "Error adding note. Please try again.", type: "error" });
		}
	};

	const onRenameNote = async (noteId: string, name: string) => {
		if (!currentFolderRef || !currentFolderData) return;

		const { error, data } = await noteAPI.renameNote({ id: noteId, name: name, parentFolderRef: currentFolderRef, notes: currentFolderData.notes });

		if (error) {
			Toast.show({ type: "error", title: error.title, description: error.description });
		} else {
			setCurrentFolderData({ ...currentFolderData, notes: data });
		}
	};

	const onDeleteNote = async (noteId: string, studyDataId: string) => {
		if (!currentFolderRef || !currentFolderData || user === null) return;
		const { error, data } = await noteAPI.deleteNoteAndRemoveFromFolder({ userId: user.uid, id: noteId, studyDataId, parentFolderRef: currentFolderRef, notes: currentFolderData.notes });

		if (error) {
			Toast.show({ type: "error", title: error.title, description: error.description });
		} else {
			setCurrentFolderData({ ...currentFolderData, notes: data });
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

	const renderFolderItem = (item: SubFolder | Note, index: number) => {
		if (isFolderItemNote(item)) {
			const indexOffset = currentFolderData ? currentFolderData.subFolders.length : 0;
			return <Note imageUrl={item.imageUrl} name={item.name} onPress={() => showImageViewer(index - indexOffset)} onLongPress={() => onNoteLongPress(item)} />;
		} else {
			return <Folder color={item.color} name={item.name} onPress={() => onFolderPress(item.id, item.name)} onLongPress={() => onFolderLongPress(item)} />;
		}
	};

	return (
		<View style={{ flex: 1 }}>
			<FlatList
				refreshControl={<RefreshControl enabled={true} onRefresh={fetchItems} refreshing={loading} />}
				numColumns={2}
				columnWrapperStyle={{ justifyContent: "space-between", paddingTop: 20 }}
				contentContainerStyle={{ paddingHorizontal: 40 }}
				scrollEventThrottle={3000}
				data={currentFolderData ? [...currentFolderData.subFolders, ...currentFolderData.notes] : null}
				keyExtractor={(item) => item.id}
				renderItem={({ item, index }) => renderFolderItem(item, index)}
			></FlatList>
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
				<FolderSettings
					folder={selectedFolder}
					onDeleteFolder={(folderId) => onDeleteFolder(folderId)}
					open={isSettingsBottomSheetVisible}
					onClose={() => setIsSettingsBottomSheetVisible(false)}
					onUpdateFolder={(folderId, data) => onUpdateSubFolder(folderId, data)}
					onShareFolder={(email) => Promise.resolve(console.log(email))}
				/>
			)}
			{selectedNote && <NoteSettings note={selectedNote} onDeleteNote={onDeleteNote} open={isNoteSettingsVisible} onClose={() => setIsNoteSettingsVisible(false)} onRenameNote={onRenameNote} />}
			{currentFolderData?.notes && (
				<ImageViewer
					visible={isImageModalVisible}
					onClose={() => setIsImageModalVisible(false)}
					images={Array.from(currentFolderData.notes, (note) => ({ url: note.imageUrl, name: note.name }))}
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
