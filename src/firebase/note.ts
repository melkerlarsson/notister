import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import { uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { notesStorageRef } from "./config";

const convertImageToBlob = async (url: string): Promise<Blob> => {
	const config: AxiosRequestConfig = { url: url, method: "GET", responseType: "blob" };
	const response: AxiosResponse<Blob> = await axios.request(config);

	return response.data;
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

