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
