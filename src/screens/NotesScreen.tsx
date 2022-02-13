import { doc, getDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
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

import Modal from "react-native-modal";
import { FloatingAction, IActionProps } from "react-native-floating-action";

interface NotesScreenProps extends NotesScreenNavigationProps {}

const NotesScreen = ({ navigation, route }: NotesScreenProps) => {
  const IS_ROOT_FOLDER = !route.params?.folderId;

  const { height, width } = useWindowDimensions();

  const [folders, setFolders] = useState<SubFolder[] | undefined | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
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
      } catch (error) {}
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
    setIsModalVisible(true);
  };

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
      <Modal
        isVisible={isModalVisible}
        onBackdropPress={() => setIsModalVisible(false)}
        animationIn="zoomIn"
        animationOut="zoomOut"
        backdropOpacity={0.2}
        backdropTransitionOutTiming={0}
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <View
          style={{
            display: "flex",
            padding: 20,
            backgroundColor: "#fff",
            width: width * 0.8,
            height: width * 0.5,
            borderRadius: 20,
          }}
        >
          <Text style={{ fontWeight: "bold", fontSize: 18 }}>
            {selectedFolder?.name}
          </Text>
        </View>
      </Modal>
      <FloatingAction
        actions={actions}
        overlayColor="rgba(226, 226, 226, 0.8)"
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
