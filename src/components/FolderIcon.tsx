import { StyleSheet } from 'react-native';
import { Ionicons } from "@expo/vector-icons";


interface FolderIconProps {
  color: string;
  size: number;
}

const FolderIcon = ({ color , size}: FolderIconProps) => {

  return (
    <Ionicons name="folder" size={size} color={color} />

  );
}

const styles = StyleSheet.create({
  folderIcon: {

  }
});

export default FolderIcon;