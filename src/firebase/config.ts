import { initializeApp } from 'firebase/app';
import { collection, getDoc, getDocs, getFirestore, QueryDocumentSnapshot } from 'firebase/firestore';
import { getReactNativePersistence } from 'firebase/auth/react-native';
import { initializeAuth, getAuth } from 'firebase/auth';

import AsyncStorage from '@react-native-async-storage/async-storage';


const firebaseConfig = {
  apiKey: "AIzaSyAiXUCqTfR4me4IXhz1jVZtxmOWOLVJOR0",
  authDomain: "notister-17a05.firebaseapp.com",
  projectId: "notister-17a05",
  storageBucket: "notister-17a05.appspot.com",
  messagingSenderId: "739028523935",
  appId: "1:739028523935:web:1309c6e8c8f1a3766dbbaa",
  measurementId: "G-N62SX2DF01"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);

initializeAuth(app, { persistence: getReactNativePersistence(AsyncStorage) });
export const auth = getAuth();

const converter = <T>() => ({
  toFirestore: (data: T) => data,
  fromFirestore: (snap: QueryDocumentSnapshot) =>  snap.data() as T
});

const DataPoint = <T>(collectionPath: string) => collection(db, collectionPath).withConverter(converter<T>())

export const collections = { 
  folders: DataPoint<Folder>("folders"),
  rootFolders: DataPoint<RootFolder>("rootFolders"),
}





// type PathImpl<T, K extends keyof T> =
//   K extends string
//   ? T[K] extends Record<string, any>
//   ? T[K] extends ArrayLike<any>
//   ? K | `${K}.${PathImpl<T[K], Exclude<keyof T[K], keyof any[]>>}`
//   : K | `${K}.${PathImpl<T[K], keyof T[K]>}`
//   : K
//   : never
// type Path<T> = PathImpl<T, keyof T> | keyof T
// type PathValue<T, P extends Path<T>> =
//   P extends `${infer K}.${infer Rest}`
//   ? K extends keyof T
//   ? Rest extends Path<T[K]>
//   ? PathValue<T[K], Rest>
//   : never
//   : never
//   : P extends keyof T
//   ? T[P]
//   : never
// export type UpdateData<T extends object> = Partial<{
//   [TKey in Path<T>]: PathValue<T, TKey>
// }>
