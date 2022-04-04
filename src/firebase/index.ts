import { doc, updateDoc, setDoc, DocumentReference, getDoc, deleteDoc } from "firebase/firestore";
import { deleteObject } from "firebase/storage";
import { v4 as createId } from "uuid";
import { DEFAULT_FOLDER_COLOR } from "../theme/colors";
import { collections, notesStorageRef } from "./config";

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
};

export const deleteFolder = async ({ folderId, parentFolderRef, parentSubFolders }: DeleteFolderProps): Promise<SubFolder[]> => {
	const newSubFolders = [...parentSubFolders.filter((subFolder) => subFolder.id !== folderId)];
	
	await Promise.all([
		updateDoc(parentFolderRef, { subFolders: newSubFolders }),
		deleteFolderDataRecursively(folderId)
	]); 

	return newSubFolders;
};

const deleteFolderDataRecursively = async (folderId: string) => {
	const folderRef = doc(collections.folders, folderId);
	const folderData = (await getDoc(folderRef)).data();

	if (folderData) {
		for (const note of folderData.notes) {
			// TODO: Remove study data from note
			const imageRef = notesStorageRef(note.id);
			await deleteObject(imageRef);
		}

		for (const folder of folderData.subFolders) {
			await deleteFolderDataRecursively(folder.id);
		}
	}

	await deleteDoc(folderRef);
};
