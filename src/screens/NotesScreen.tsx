import { doc, getDoc, addDoc, setDoc, deleteDoc, updateDoc, DocumentReference } from "firebase/firestore";
import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  useWindowDimensions,
  ActivityIndicator,
} from "react-native";
import Folder from "../components/Folder";
import { collections } from "../firebase/config";
import { NotesScreenNavigationProps } from "../navigation/NotesStack";
import { Ionicons } from "@expo/vector-icons";

import { FloatingAction, IActionProps } from "react-native-floating-action";
import NewFolderModal from "../components/NewFolderModal";
import { useSelector } from "react-redux";
import { RootState } from "../redux/rootReducer";

import { v4 as createUuid } from 'uuid';
import SettingsBottomSheet from "../components/SettingsBottomSheet";
import { Portal, PortalHost } from "@gorhom/portal";

interface NotesScreenProps extends NotesScreenNavigationProps {}

const NotesScreen = ({ navigation, route }: NotesScreenProps) => {
  const user = useSelector((state: RootState) => state.userReducer.user);

  const IS_ROOT_FOLDER = !route.params?.folderId;

  const { height, width } = useWindowDimensions();

  const [currentFolderData, setCurrentFolderData] = useState<RootFolder | Folder | undefined | null>(null);
  const [currentFolderRef, setCurrentFolderRef] = useState<DocumentReference<RootFolder | Folder> | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const [isSettingsBottomSheetVisible, setIsSettingsBottomSheetVisible] =
    useState<boolean>(false);
  const [isNewFolderModalVisible, setIsNewFolderModalVisible] =
    useState<boolean>(false);
  

  const [selectedFolder, setSelectedFolder] = useState<SubFolder | null>(null);

  const fetchItems = async () => {
    if (IS_ROOT_FOLDER) {
      try {
        const rootFolderDoc = await getDoc(
          doc(collections.rootFolders, user?.uid)
        );
        setCurrentFolderData(rootFolderDoc.data());
        setCurrentFolderRef(rootFolderDoc.ref);
        setLoading(false);
      } catch (error) {
        console.log(error);
      }
    } else {
      try {
        const folderDoc = await getDoc(
          doc(collections.folders, route.params.folderId)
        );
        setCurrentFolderData(folderDoc.data());
        setCurrentFolderRef(folderDoc.ref);
        setLoading(false);
      } catch (error) {
        console.log(error);
      }
    }
  };

  useEffect(() => {
    navigation.setOptions({
      title: IS_ROOT_FOLDER ? "Your notes" : route.params.folderName,
    });

    fetchItems();
  }, [route.params]);

  const onFolderPress = async (folderId: string, folderName: string) => {
    navigation.push("Notes", { folderId: folderId, folderName: folderName });
  };

  const onFolderLongPress = (folder: SubFolder) => {
    setSelectedFolder(folder);
    setIsSettingsBottomSheetVisible(true);
  };

  const addNewFolder = async (folder: NewFolder) => {
    if (!user) {
      console.log("User not signed in");
    } else {
      try {
        const id = createUuid();
        const folderRef = doc(collections.folders, id);
        const subFolder: SubFolder = {
          ...folder,
          color: "rgba(0,0,0,.72)",
          id: folderRef.id,
          sharedWith: [],
        };
        const newFolder: Folder = {
          ...folder,
          ...subFolder,
          userId: user.uid,
          subFolders: [],
          notes: [],
        };
        if (currentFolderRef && currentFolderData) {
          await updateDoc(currentFolderRef, {...currentFolderData, subFolders: [ ...currentFolderData.subFolders, subFolder ]})
          await setDoc(folderRef, newFolder);

          setCurrentFolderData({ ...currentFolderData, subFolders: [ ...currentFolderData.subFolders, subFolder ]})
        }

      } catch (error) {
        console.log("Error adding new folder", error)
      }
    }
  };

  const deleteFolder = async (folderId: string): Promise<void> => {
    try {
      if (currentFolderRef && currentFolderData) {
        await updateDoc(currentFolderRef, { ...currentFolderData, subFolders: [ ...currentFolderData.subFolders.filter(subFolder => subFolder.id !== folderId) ]})
        await deleteFolderRecursively(folderId);

        setCurrentFolderData({ ...currentFolderData, subFolders: [ ...currentFolderData.subFolders.filter(subFolder => subFolder.id !== folderId) ]});

        return;
      }
    } catch (error) {
      console.log("Error deleting folder", error);

      return;
    }
  }

  const deleteFolderRecursively = async (folderId: string) => {
    try {
      const folderRef = doc(collections.folders, folderId);
      const folderData = (await getDoc(folderRef)).data();

      console.log(folderData?.name)

      folderData?.notes.forEach(note => {
        // TODO: remove note
      });

      folderData?.subFolders.forEach(async (folder) => {
        await deleteFolderRecursively(folder.id);
      });

      await deleteDoc(folderRef);

      return;


    } catch (error) {
      throw error;
    }
  }

  const actions: IActionProps[] = [
    {
      name: "Folder",
      text: "New Folder",
      icon: <Ionicons name="folder" color="#fff" />,
    },
    {
      name: "Note",
      text: "New Note",
      icon: <Ionicons name="phone-portrait-outline" color="#fff" />,
    },
  ];

  return (
    <View style={{ ...styles.container, width: width }}>
      <NewFolderModal
        isVisible={isNewFolderModalVisible}
        onClose={() => setIsNewFolderModalVisible(false)}
        onAdd={addNewFolder}
      />
      <FloatingAction
        actions={actions}
        overlayColor="rgba(226, 226, 226, 0.8)"
        onPressItem={(name) => {
          if (name === "Folder") {
            setIsNewFolderModalVisible(true);
          }
        }}
      />
     
      { selectedFolder && <SettingsBottomSheet folder={selectedFolder} onDeleteFolder={folderId => deleteFolder(folderId)}
open={isSettingsBottomSheetVisible} onClose={() => setIsSettingsBottomSheetVisible(false)}/> }


      {loading && (
        <ActivityIndicator
          style={{ flex: 1, justifyContent: "center" }}
          size="large"
          color="#979797"
        />
      )}
      {currentFolderData &&
        currentFolderData.subFolders?.map((folder, index) => (
          <Folder
            style={{ ...styles.folder, width: width / 2, height: width / 2 }}
            key={index}
            color={folder.color}
            name={folder.name}
            onPress={() => onFolderPress(folder.id, folder.name)}
            onLongPress={() => onFolderLongPress(folder)}
          />
        ))}

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    display: "flex",
    flex: 1,
    flexDirection: "row",
    flexWrap: "wrap",
    backgroundColor: "white",
    position: "relative",
  },
  folder: {
    marginVertical: 20,
  },
});

export default NotesScreen;

// setDoc(doc(db, "rootFolders", "wV8xZhPLvjR6I3kopzuygio5Z2V2"), {
//   subFolders: [
//     {
//       name: "My First Folder",
//       color: "rgb(123, 209, 72)",
//     }
//   ],
//   notes: null,
//   userId: "wV8xZhPLvjR6I3kopzuygio5Z2V2",
// });

// addDoc(collections.rootFolders, {
//   name: "Folder 2",
//   color: "rgb(205, 116, 230)",
//   subFolders: null,
//   notes: null,
//   userId: "wV8xZhPLvjR6I3kopzuygio5Z2V2",
//   sharedWith: null,
//   id: "some id"
// });
