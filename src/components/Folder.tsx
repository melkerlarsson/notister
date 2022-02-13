import { View, Text, StyleSheet, ViewStyle, TouchableOpacity } from 'react-native';
import { Ionicons } from "@expo/vector-icons";


interface FolderProps {
  color?: string;
  style?: ViewStyle;
  name: string;
  onPress: () => void;
}

const Folder = ({color, style, name, onPress}: FolderProps) => {

  return (
    <TouchableOpacity style={[style, styles.container]} onPress={onPress} activeOpacity={0.6} >
      <Ionicons name="folder" size={100} color={color} />
      <Text>{name}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    justifyContent: "center",
    alignItems: "center"
  }
});

Folder.defaultProps = { color: "black" }

export default Folder;