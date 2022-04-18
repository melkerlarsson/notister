/* eslint-disable @typescript-eslint/no-unused-vars */
type RootFolder = {
  id: string;
  subFolders: SubFolder[];
  notes: Note[];
  userId: string;
};

type Folder = {
  id: string;
  name: string;
  color: string;
  subFolders: SubFolder[];
  notes: Note[];
  userId: string;
  sharedWith: SharedUser[];
};

type SubFolder = {
  color: string;
  name: string;
  id: string;
  sharedWith: SharedUser[];
};

type NewFolder = {
  name: string;
};

type Note = {
  id: string;
  imageUrl: string;
  userId: string;
  sharedWith: SharedUser[];
  name: string;
};

type SharedUser = {
  id: string;
  name: string;
};

type StudyData = {
  id: string;
  imageUrl: string;
  reviewDate: Date;
  lastReivewInterval: number;
  reviewDates: Date[];
};

type Only<T, U> = {
	[P in keyof T]: T[P];
} & {
	[P in keyof U]?: never;
};

type Either<T, U> = Only<T, U> | Only<U, T>;