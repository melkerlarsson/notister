type RootFolder = {
  id: string, 
  name: string,
  subFolders: SubFolder[] | null
  notes: Note[] | null
  userId: string,
}

type Folder = {
  id: string, 
  name: string,
  color: string,
  subFolders: SubFolder[] | null
  notes: Note[] | null
  userId: string,
  sharedWith: SharedUser[] | null
}

type Note = {
  id: string
  imageUrl: string,
  userId: string,
  sharedWith: SharedUser[] | null
}

type SubFolder = {
  color: string,
  name: string, 
  id: string,
  sharedWith: SharedUser[] | null
}

type SharedUser = {
  id: string,
  name: string
}