import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import { DocumentReference, updateDoc, doc, setDoc, deleteDoc, getDoc } from "firebase/firestore";
import { uploadBytesResumable, getDownloadURL, deleteObject } from "firebase/storage";
import { collections, db, notesStorageRef } from "./config";
import { ApiResponse } from "./types";
import { v4 as createId } from "uuid";
import { ReviewDifficulty } from "../types/review";
import { calculateNewReviewInterval, newDateDaysInFuture } from "../util";

const convertImageToBlob = async (url: string): Promise<Blob> => {
	const config: AxiosRequestConfig = { url: url, method: "GET", responseType: "blob" };
	const response: AxiosResponse<Blob> = await axios.request(config);

	return response.data;
};

type UpdateNumberOfNotesProps = { 
	userId: string;
	currentNumberOfNotes: number;
	delta: "increment" | "decrement";
};

const updateNumberOfNotes = async ({ userId, currentNumberOfNotes, delta }: UpdateNumberOfNotesProps) => {
	await updateDoc(doc(collections.userData, userId), { numberOfNotes: currentNumberOfNotes + (delta === "increment" ? 1 : -1) });
};

export const getNumberOfNotes = async (userId: string) => {
	const userData = (await getDoc(doc(collections.userData, userId))).data();
	if (userData === undefined) {
		return 0; 
	}

	return userData.numberOfNotes;
};

type SaveReviewProps = {
	studyData: StudyData;
	userId: string;
	difficulty: ReviewDifficulty;
};

export const saveReview = async ({ studyData, userId, difficulty }: SaveReviewProps): Promise<ApiResponse<null>> => {
	const reviewDate = new Date(Date.now());
	const newInterval = calculateNewReviewInterval(studyData.lastReivewInterval, difficulty);

	// TODO: 	Save to global statististics

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

export const initializeStudyData = async ({ imageUrl, userId }: InitializeStudyDataProps): Promise<string> => {
	const id = createId();
	const studyData: StudyData = {
		id,
		imageUrl,
		reviewDate: new Date(Date.now()),
		lastReivewInterval: 0,
		reviewDates: [],
	};

	await setDoc(doc(db, `studyData/${userId}/normal/${id}`), studyData);
	return id;
};

type UploadNoteProps = {
	url: string;
	id: string;
	userId: string;
	currentNumberOfNotes: number;
	onUploaded: (remoteUrl: string) => void;
	onProgressChanged?: (progress: number) => void;
	onError: (message: string) => void;
};
export const uploadNote = async ({ url, id, userId, onUploaded, currentNumberOfNotes, onProgressChanged, onError }: UploadNoteProps): Promise<void> => {
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
				await updateNumberOfNotes({userId, currentNumberOfNotes, delta: "increment"} );
				onUploaded(remoteUrl);
			};

			void getUrl();
		}
	);
};

type DelteNoteProps = {
	userId: string;
	id: string;
	studyDataId: string;
	parentFolderRef: DocumentReference<RootFolder | Folder>;
	notes: Note[];
};

export const deleteNoteAndRemoveFromFolder = async ({ userId, id, studyDataId, parentFolderRef, notes }: DelteNoteProps): Promise<ApiResponse<Note[]>> => {
	try {
		await deleteNote(id);
		await deleteNoteReviewData(userId, studyDataId);

		const newNotes = notes.filter((note) => note.id !== id);
		await updateDoc(parentFolderRef, { notes: newNotes });

		await updateNumberOfNotes({ userId, currentNumberOfNotes: await getNumberOfNotes(userId), delta: "decrement"});

		return { data: newNotes, error: null };
	} catch (error) {
		return { error: { title: "Error", description: "Error deleting note. Please try again" }, data: null };
	}
};

export const deleteNoteReviewData = async (userId: string, studyDataId: string) => {
	const ref = doc(collections.studyData(userId), studyDataId);
	await deleteDoc(ref);
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
