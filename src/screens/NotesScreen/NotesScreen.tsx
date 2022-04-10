import { doc, getDoc, setDoc, deleteDoc, updateDoc, DocumentReference } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { View, StyleSheet, RefreshControl, ScrollView } from "react-native";
import Folder from "./components/Folder";
import { collections, notesStorageRef } from "../../firebase/config";
import { NotesScreenNavigationProps } from "../../navigation/NotesStack";
import { Ionicons } from "@expo/vector-icons";

import { FloatingAction, IActionProps } from "react-native-floating-action";
import NewFolderModal from "./components/NewFolderModal";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/rootReducer";

import { v4 as createUuid } from "uuid";
import SettingsBottomSheet from "./components/SettingsBottomSheet/SettingsBottomSheet";

import * as DocumentPicker from "expo-document-picker";
import { getDownloadURL, uploadBytesResumable, deleteObject } from "firebase/storage";
import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import Note from "./components/Note";
import FolderSettingsBottomSheet from "./components/SettingsBottomSheet/FolderSettingsBottomSheet";
import ImageViewer from "./components/ImageViewer/ImageViewer";
import { addFolder, deleteFolder } from "../../firebase";
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
		if (IS_ROOT_FOLDER) {
			try {
				const rootFolderDoc = await getDoc(doc(collections.rootFolders, user?.uid));
				setCurrentFolderData(rootFolderDoc.data());
				setCurrentFolderRef(rootFolderDoc.ref);
				setLoading(false);
			} catch (error) {
				console.log(error);
			}
		} else {
			try {
				const folderDoc = await getDoc(doc(collections.folders, route.params.folderId));
				setCurrentFolderData(folderDoc.data());
				setCurrentFolderRef(folderDoc.ref);
				setLoading(false);
			} catch (error) {
				console.log(error);
				setLoading(false);
			}
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
				const subFolder: SubFolder = await addFolder({ newFolder, userId: user.uid, parentFolderRef: currentFolderRef, parentSubFolders: currentFolderData.subFolders });
				setCurrentFolderData({ ...currentFolderData, subFolders: [...currentFolderData.subFolders, subFolder] });
			} catch (error) {
				Toast.show({ title: "Error", description: "An error occurred while adding folder. Please try again", type: "error" });
			}
		}
	};

	const onDeleteFolder = async (folderId: string): Promise<void> => {
		if (currentFolderRef && currentFolderData) {
			try {
				const newSubFolders: SubFolder[] = await deleteFolder({ folderId, parentFolderRef: currentFolderRef, parentSubFolders: currentFolderData.subFolders });
				setCurrentFolderData({ ...currentFolderData, subFolders: newSubFolders });
			} catch (error) {
				Toast.show({ title: "Error", description: "An error occurred while deleting folder. Please try again", type: "error" });
			}
		}
	};

	const updateSubFolder = async (folderId: string, data: Partial<SubFolder>) => {
		try {
			if (currentFolderRef && currentFolderData && currentFolderData.subFolders) {
				const foundSubFolder = currentFolderData.subFolders.find((folder) => folder.id === folderId);

				if (!foundSubFolder) return;

				const foundSubFolderIndex = currentFolderData.subFolders.indexOf(foundSubFolder);
				const subFoldersBefore = currentFolderData.subFolders.slice(0, foundSubFolderIndex);
				const subFoldersAfter = currentFolderData.subFolders.slice(foundSubFolderIndex + 1, currentFolderData.subFolders.length);

				const newSubFolder: SubFolder = { ...foundSubFolder, ...data };
				const subFolderRef = doc(collections.folders, folderId);

				const updatedSubFolders = [...subFoldersBefore, newSubFolder, ...subFoldersAfter];

				await Promise.all([updateDoc(subFolderRef, { ...data }), updateDoc(currentFolderRef, { subFolders: updatedSubFolders })]);

				setCurrentFolderData({
					...currentFolderData,
					subFolders: updatedSubFolders,
				});

				return;
			}
		} catch (error) {
			console.log("Error updating folder", error);
		}
	};

	const convertImageToBlob = async (url: string): Promise<Blob> => {
		const config: AxiosRequestConfig = { url: url, method: "GET", responseType: "blob" };
		const response: AxiosResponse<Blob> = await axios.request(config);

		return response.data;
	};

	const uploadImage = async ({ url, id, onUploaded }: { url: string; id: string; onUploaded: (remoteUrl: string) => void }): Promise<void> => {
		const blob = await convertImageToBlob(url);

		const imageRef = notesStorageRef(id);
		const uploadTask = uploadBytesResumable(imageRef, blob);

		uploadTask.on(
			"state_changed",
			(snapshot) => {
				const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
				console.log(`Upload is ${progress}% done`);
			},
			(error) => {
				// TODO: Show error to the user
				console.log(error.message);
			},
			() => {
				const getUrl = async () => {
					const remoteUrl = await getDownloadURL(uploadTask.snapshot.ref);
					onUploaded(remoteUrl);
				};

				void getUrl();
			}
		);
	};

	const addNote = async () => {
		if (!user || !currentFolderData || !currentFolderRef) return;
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

		await uploadImage({
			url: result.uri,
			id: noteId,
			onUploaded: onUploaded,
		});
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

	const showImageViewer = (index: number) => {
		setImageIndex(index);
		setIsImageModalVisible(true);
	};

	return (
		<View style={{ flex: 1 }}>
			<ScrollView refreshControl={<RefreshControl enabled={true} onRefresh={fetchItems} refreshing={loading} />}>
				<View style={{ ...styles.container }}>
					<NewFolderModal isVisible={isNewFolderModalVisible} onClose={() => setIsNewFolderModalVisible(false)} onAdd={onAddFolder} />

					{selectedFolder && (
						<SettingsBottomSheet
							folder={selectedFolder}
							onDeleteFolder={(folderId) => onDeleteFolder(folderId)}
							open={isSettingsBottomSheetVisible}
							onClose={() => setIsSettingsBottomSheetVisible(false)}
							onUpdateFolder={(folderId, data) => updateSubFolder(folderId, data)}
						/>
					)}

					{currentFolderData &&
						currentFolderData.subFolders?.map((folder, index) => (
							<Folder key={index} color={folder.color} name={folder.name} onPress={() => onFolderPress(folder.id, folder.name)} onLongPress={() => onFolderLongPress(folder)} />
						))}
					{currentFolderData &&
						currentFolderData.notes?.map((note, index) => <Note key={index} imageUrl={note.imageUrl} name={note.name} onPress={() => showImageViewer(index)} onLongPress={() => null} />)}
				</View>
			</ScrollView>
			<FloatingAction
				actions={actions}
				overlayColor="rgba(226, 226, 226, 0.8)"
				onPressItem={(name) => {
					if (name === "Folder") {
						setIsNewFolderModalVisible(true);
					} else if (name === "Note") {
						void addNote();
					}
				}}
			/>
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
