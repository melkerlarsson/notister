import { DocumentReference, doc, updateDoc, setDoc, getDoc, deleteDoc } from "firebase/firestore";
import { deleteObject } from "firebase/storage";
import { v4 as createId } from "uuid";
import { deleteNoteReviewData } from "./note";
import { DEFAULT_FOLDER_COLOR } from "../theme/colors";
import { collections, notesStorageRef } from "./config";
import { ApiResponse, ErrorMessage } from "./types";

export const createRootFolder = async (userId: string): Promise<ErrorMessage | null> => {
	const rootFolder: RootFolder = {
		id: userId,
		subFolders: [],
		notes: [],
		userId,
	};
	try {
		await setDoc(doc(collections.rootFolders, userId), rootFolder);
		return null;
	} catch (error) {
		return { title: "Error", description: "Error creating root folder. Please try again."};
	}
};

type AddFolderProps = {
	newFolder: NewFolder;
	parentFolderRef: DocumentReference<RootFolder | Folder>;
	parentSubFolders: SubFolder[];
	userId: string;
};

export const addFolder = async ({ newFolder, userId, parentFolderRef, parentSubFolders }: AddFolderProps): Promise<SubFolder> => {
	const id = createId();
	const folderRef = doc(collections.folders, id);

	const subFolder: SubFolder = {
		...newFolder,
		color: DEFAULT_FOLDER_COLOR,
		id: folderRef.id,
		sharedWith: [],
	};

	const folder: Folder = {
		...newFolder,
		...subFolder,
		userId: userId,
		subFolders: [],
		notes: [],
	};

	await Promise.all([
		updateDoc(parentFolderRef, {
			subFolders: [...parentSubFolders, subFolder],
		}),
		setDoc(folderRef, folder),
	]);

	return subFolder;
};

type DeleteFolderProps = {
	folderId: string;
	parentFolderRef: DocumentReference<RootFolder | Folder>;
	parentSubFolders: SubFolder[];
	userId: string;
};

export const deleteFolder = async ({ userId, folderId, parentFolderRef, parentSubFolders }: DeleteFolderProps): Promise<SubFolder[]> => {
	const newSubFolders = [...parentSubFolders.filter((subFolder) => subFolder.id !== folderId)];

	await Promise.all([updateDoc(parentFolderRef, { subFolders: newSubFolders }), deleteFolderDataRecursively(folderId, userId)]);

	return newSubFolders;
};

const deleteFolderDataRecursively = async (folderId: string, userId: string) => {
	const folderRef = doc(collections.folders, folderId);
	const folderData = (await getDoc(folderRef)).data();

	if (folderData) {
		for (const note of folderData.notes) {
			await deleteNoteReviewData(userId, note.studyDataId);
			const imageRef = notesStorageRef(note.id);
			await deleteObject(imageRef);
		}

		for (const folder of folderData.subFolders) {
			await deleteFolderDataRecursively(folder.id, userId);
		}
	}

	await deleteDoc(folderRef);
};

type UpdateSubFolderProps = {
	folderId: string;
	data: Partial<SubFolder>;
	parentFolderRef: DocumentReference<RootFolder | Folder>;
	parentFolderData: RootFolder | Folder;
};

export const updateSubFolder = async ({ folderId, data, parentFolderRef, parentFolderData }: UpdateSubFolderProps): Promise<ApiResponse<RootFolder | Folder>> => {
	const subFolderToUpdate = parentFolderData.subFolders.find((folder) => folder.id === folderId);

	if (!subFolderToUpdate) return { error: { title: "Error", description: "Error updating folder. Please try again." }, data: null };

	try {
		const foundSubFolderIndex = parentFolderData.subFolders.indexOf(subFolderToUpdate);
		const subFoldersBefore = parentFolderData.subFolders.slice(0, foundSubFolderIndex);
		const subFoldersAfter = parentFolderData.subFolders.slice(foundSubFolderIndex + 1, parentFolderData.subFolders.length);

		const newSubFolder: SubFolder = { ...subFolderToUpdate, ...data };
		const subFolderRef = doc(collections.folders, folderId);

		const updatedSubFolders = [...subFoldersBefore, newSubFolder, ...subFoldersAfter];

		await Promise.all([updateDoc(subFolderRef, { ...data }), updateDoc(parentFolderRef, { subFolders: updatedSubFolders })]);

		return { data: { ...parentFolderData, subFolders: updatedSubFolders }, error: null };
	} catch (error) {
		return { error: { title: "Error", description: "Error updating folder. Please try again." }, data: null };
	}
};
