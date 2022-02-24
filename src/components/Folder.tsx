import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler'
import FolderIcon from './FolderIcon';


interface FolderProps {
  color: string;
  style?: ViewStyle;
  name: string;
  onPress: () => void;
  onLongPress: () => void;
}

const Folder = ({ color, style, name, onPress, onLongPress}: FolderProps) => {

  return (
    <TouchableOpacity style={[style, styles.container]} delayLongPress={200} onPress={onPress} onLongPress={onLongPress} activeOpacity={0.6} >
      <FolderIcon size={120} color={color} />
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