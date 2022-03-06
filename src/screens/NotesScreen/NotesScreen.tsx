import { doc, getDoc, setDoc, deleteDoc, updateDoc, DocumentReference } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { View, StyleSheet, useWindowDimensions, RefreshControl, ScrollView, Image, Text } from "react-native";
import Folder from "../../components/Folder";
import { collections, storage } from "../../firebase/config";
import { NotesScreenNavigationProps } from "../../navigation/NotesStack";
import { Ionicons } from "@expo/vector-icons";

import { FloatingAction, IActionProps } from "react-native-floating-action";
import NewFolderModal from "./components/NewFolderModal";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/rootReducer";

import { v4 as createUuid } from "uuid";
import SettingsBottomSheet from "./components/SettingsBottomSheet/SettingsBottomSheet";

import * as ImagePicker from "expo-image-picker";
import * as DocumentPicker from "expo-document-picker";
import { getDownloadURL, ref as storageRef, uploadBytesResumable } from "firebase/storage";
import axios, { AxiosRequestConfig, AxiosResponse } from "axios";

type NotesScreenProps = NotesScreenNavigationProps;

const NotesScreen = ({ navigation, route }: NotesScreenProps) => {
	const user = useSelector((state: RootState) => state.userReducer.user);

	const IS_ROOT_FOLDER = !route.params?.folderId;

	const { width } = useWindowDimensions();

	const [currentFolderData, setCurrentFolderData] = useState<RootFolder | Folder | undefined | null>(null);
	const [currentFolderRef, setCurrentFolderRef] = useState<DocumentReference<RootFolder | Folder> | null>(null);
	const [selectedFolder, setSelectedFolder] = useState<SubFolder | null>(null);

	const [loading, setLoading] = useState<boolean>(true);

	const [isSettingsBottomSheetVisible, setIsSettingsBottomSheetVisible] = useState<boolean>(false);
	const [isNewFolderModalVisible, setIsNewFolderModalVisible] = useState<boolean>(false);

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

	const addNewFolder = async (folder: NewFolder) => {
		if (!user) {
			console.log("User not signed in");
		} else {
			try {
				const id = createUuid();
				const folderRef = doc(collections.folders, id);
				const subFolder: SubFolder = {
					...folder,
					color: "rgba(0,0,0,.72)",
					id: folderRef.id,
					sharedWith: [],
				};
				const newFolder: Folder = {
					...folder,
					...subFolder,
					userId: user.uid,
					subFolders: [],
					notes: [],
				};
				if (currentFolderRef && currentFolderData) {
					await updateDoc(currentFolderRef, {
						...currentFolderData,
						subFolders: [...currentFolderData.subFolders, subFolder],
					});
					await setDoc(folderRef, newFolder);

					setCurrentFolderData({
						...currentFolderData,
						subFolders: [...currentFolderData.subFolders, subFolder],
					});
				}
			} catch (error) {
				console.log("Error adding new folder", error);
			}
		}
	};

	const deleteFolder = async (folderId: string): Promise<void> => {
		try {
			if (currentFolderRef && currentFolderData) {
				await updateDoc(currentFolderRef, {
					subFolders: [...currentFolderData.subFolders.filter((subFolder) => subFolder.id !== folderId)],
				});
				await deleteFolderRecursively(folderId);

				setCurrentFolderData({
					...currentFolderData,
					subFolders: [...currentFolderData.subFolders.filter((subFolder) => subFolder.id !== folderId)],
				});

				return;
			}
		} catch (error) {
			console.log("Error deleting folder", error);

			return;
		}
	};

	const deleteFolderRecursively = async (folderId: string) => {
		const folderRef = doc(collections.folders, folderId);
		const folderData = (await getDoc(folderRef)).data();

		if (folderData) {
			// TODO: Loop over notes and delete them.

			for (const folder of folderData.subFolders) {
				await deleteFolderRecursively(folder.id);
			}
		}

		await deleteDoc(folderRef);

		return;
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

	const uploadImage = async ({ url, name, onUploaded }: { url: string; name: string; onUploaded: (remoteUrl: string) => void }): Promise<void> => {
		const blob = await convertImageToBlob(url);

		const imageRef = storageRef(storage, `notes/${name}`);
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

		const onUploaded = async (imageUrl: string) => {
			const note: Note = {
				id: createUuid(),
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
			name: result.name,
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

	return (
		<View style={{ flex: 1 }}>
			<ScrollView refreshControl={<RefreshControl enabled={true} onRefresh={fetchItems} refreshing={loading} />}>
				<View style={{ ...styles.container }}>
					<NewFolderModal isVisible={isNewFolderModalVisible} onClose={() => setIsNewFolderModalVisible(false)} onAdd={addNewFolder} />

					{selectedFolder && (
						<SettingsBottomSheet
							folder={selectedFolder}
							onDeleteFolder={(folderId) => deleteFolder(folderId)}
							open={isSettingsBottomSheetVisible}
							onClose={() => setIsSettingsBottomSheetVisible(false)}
							onUpdateFolder={(folderId, data) => updateSubFolder(folderId, data)}
						/>
					)}

					{currentFolderData &&
						currentFolderData.subFolders?.map((folder, index) => (
							<Folder
								style={{
									...styles.folder,
									width: width / 2,
									height: width / 2,
								}}
								key={index}
								color={folder.color}
								name={folder.name}
								onPress={() => onFolderPress(folder.id, folder.name)}
								onLongPress={() => onFolderLongPress(folder)}
							/>
						))}
					{currentFolderData &&
						currentFolderData.notes?.map((note, index) => (
							<View
								key={index}
								style={{
									width: width / 2,
									height: width / 2,
									padding: 40,
									display: "flex",
									justifyContent: "center",
									alignItems: "center",
								}}
							>
								<Image
									source={{ uri: note.imageUrl }}
									style={{
										width: "100%",
										height: "100%",
										borderRadius: 15,
										marginBottom: 10,
									}}
								/>
								<Text>{note.name}</Text>
							</View>
						))}
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
	folder: {
		marginVertical: 0,
	},
});

export default NotesScreen;
