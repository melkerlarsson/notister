import { setDoc, doc } from "firebase/firestore";
import { collections } from "./config";

export const initializeUserData = async (userId: string) => {
	await setDoc(doc(collections.userData, userId), { numberOfNotes: 0 });
};
