import { doc, getDoc, getDocFromCache } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  useWindowDimensions,
  ActivityIndicator,
} from "react-native";
import Folder from "../components/Folder";
import { auth, collections, db } from "../firebase/config";
import { NotesTabScreenProps } from "../navigation/HomeStack";
import { NotesScreenNavigationProps } from "../navigation/NotesStack";
import { Ionicons } from "@expo/vector-icons";

import { FloatingAction, IActionProps } from "react-native-floating-action";
import SettingsModal from "../components/SettingsModal";
import NewFolderModal from "../components/NewFolderModal";

interface NotesScreenProps extends NotesScreenNavigationProps {}

const NotesScreen = ({ navigation, route }: NotesScreenProps) => {
  const IS_ROOT_FOLDER = !route.params?.folderId;

  const { height, width } = useWindowDimensions();

  const [folders, setFolders] = useState<SubFolder[] | undefined | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const [isSettingsModalVisible, setIsSettingsModalVisible] = useState<boolean>(false);
  const [isNewFolderModalVisible, setIsNewFolderModalVisible] = useState<boolean>(false);

  const [selectedFolder, setSelectedFolder] = useState<SubFolder | null>(null);

  const fetchItems = async () => {
    if (IS_ROOT_FOLDER) {
      try {
        const rootFolderDoc = await getDoc(
          doc(collections.rootFolders, auth.currentUser?.uid)
        );
        setFolders(rootFolderDoc.data()?.subFolders);
        setLoading(false);
      } catch (error) {
        console.log(error);
      }
    } else {
      try {
        const folderDoc = await getDoc(
          doc(collections.folders, route.params.folderId)
        );
        setFolders(folderDoc.data()?.subFolders);
        setLoading(false);
      } catch (error) {
        console.log(error)
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
    setIsSettingsModalVisible(true);
  };

  const addNewFolder = (folder: NewFolder) => {
    console.log(folder.name)
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
      { selectedFolder && <SettingsModal isVisible={isSettingsModalVisible} folder={selectedFolder} onClose={() => setIsSettingsModalVisible(false)} /> }

      <NewFolderModal isVisible={isNewFolderModalVisible}  onClose={() => setIsNewFolderModalVisible(false)} onAdd={addNewFolder} />

      <FloatingAction
        actions={actions}
        overlayColor="rgba(226, 226, 226, 0.8)"
        onPressItem={(name) => {
          if (name === "Folder") {
            setIsNewFolderModalVisible(true);
          }
        }}
      />
      {loading && (
        <ActivityIndicator
          style={{ flex: 1, justifyContent: "center" }}
          size="large"
          color="#979797"
        />
      )}
      {folders &&
        folders.map((folder, index) => (
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
