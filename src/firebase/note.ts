import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import { DocumentReference, updateDoc, doc, setDoc, collection, addDoc } from "firebase/firestore";
import { uploadBytesResumable, getDownloadURL, deleteObject } from "firebase/storage";
import { collections, db, notesStorageRef } from "./config";
import { ApiResponse } from "./types";
import { v4 as createId } from "uuid";
import { ReviewDifficulty } from "../types/review";
import { newDateDaysInFuture } from "../util";

const convertImageToBlob = async (url: string): Promise<Blob> => {
	const config: AxiosRequestConfig = { url: url, method: "GET", responseType: "blob" };
	const response: AxiosResponse<Blob> = await axios.request(config);

	return response.data;
};

const calculateNewReviewInterval = (lastInterval: number, difficulty: ReviewDifficulty): number => {
	if (lastInterval === 0) {
		lastInterval = 1;
	}
	return lastInterval * difficulty;
}

type SaveReviewProps = {
	studyData: StudyData;
	userId: string;
	difficulty: ReviewDifficulty;
};

export const saveReview = async ({ studyData, userId, difficulty }: SaveReviewProps): Promise<ApiResponse<null>> => {
	const reviewDate = new Date(Date.now());
	const newInterval = calculateNewReviewInterval(studyData.lastReivewInterval, difficulty);

	// TODO: 	Save to global statististics
	// TODO: Save date at 00:00

	const newStudyData: StudyData = {
		...studyData,
		lastReivewInterval: newInterval,
		reviewDates: [...studyData.reviewDates, reviewDate],
		reviewDate: newDateDaysInFuture(newInterval),
	};

	try {
		await updateDoc(doc(collections.studyData(userId), studyData.id), newStudyData);
		return { error: null, data: null };
	} catch (error) {
		return { error: { title: "Error", description: "Error saving review. Please try again." }, data: null };
	}
};

type InitializeStudyDataProps = {
	imageUrl: string;
	userId: string;
};

export const initializeStudyData = async ({ imageUrl, userId }: InitializeStudyDataProps): Promise<ApiResponse<null>> => {
	const id = createId();
	const studyData: StudyData = {
		id,
		imageUrl,
		reviewDate: new Date(Date.now()),
		lastReivewInterval: 0,
		reviewDates: [],
	};

	try {
		await setDoc(doc(db, `studyData/${userId}/normal/${id}`), studyData);
		return { data: null, error: null };
	} catch (error) {
		return { data: null, error: { title: "Error", description: "Error initializing review data. Please try again." } };
	}
};

type UploadImageProps = {
	url: string;
	id: string;
	onUploaded: (remoteUrl: string) => void;
	onProgressChanged?: (progress: number) => void;
	onError: (message: string) => void;
};
export const uploadImage = async ({ url, id, onUploaded, onProgressChanged, onError }: UploadImageProps): Promise<void> => {
	const blob = await convertImageToBlob(url);

	const imageRef = notesStorageRef(id);
	const uploadTask = uploadBytesResumable(imageRef, blob);

	uploadTask.on(
		"state_changed",
		(snapshot) => {
			if (!onProgressChanged) return;
			const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
			onProgressChanged(progress);
		},
		(error) => {
			onError(error.message);
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

type DelteNoteProps = {
	id: string;
	parentFolderRef: DocumentReference<RootFolder | Folder>;
	notes: Note[];
};

export const deleteNoteAndRemoveFromFolder = async ({ id, parentFolderRef, notes }: DelteNoteProps): Promise<ApiResponse<Note[]>> => {
	// TODO: Delete learning data?

	try {
		await deleteNote(id);

		const newNotes = notes.filter((note) => note.id !== id);
		await updateDoc(parentFolderRef, { notes: newNotes });

		return { data: newNotes, error: null };
	} catch (error) {
		return { error: { title: "Error", description: "Error deleting note. Please try again" }, data: null };
	}
};

const deleteNote = async (id: string): Promise<void> => {
	const ref = notesStorageRef(id);
	await deleteObject(ref);
};

type RenameNoteProps = {
	id: string;
	name: string;
	parentFolderRef: DocumentReference<RootFolder | Folder>;
	notes: Note[];
};

export const renameNote = async ({ id, name, parentFolderRef, notes }: RenameNoteProps): Promise<ApiResponse<Note[]>> => {
	const noteToRenameIndex = notes.findIndex((note) => note.id === id);
	try {
		notes[noteToRenameIndex].name = name;
		await updateDoc(parentFolderRef, { notes: notes });

		return { data: notes, error: null };
	} catch (error) {
		return { error: { title: "Error", description: "Error renaming note. Please try again" }, data: null };
	}
};
