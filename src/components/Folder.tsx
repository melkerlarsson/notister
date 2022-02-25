import { View, Text, StyleSheet, ViewStyle } from "react-native";
import { TouchableOpacity, TouchableWithoutFeedback } from "react-native-gesture-handler";
import { Ionicons } from "@expo/vector-icons";
import FolderIcon from "./FolderIcon";

interface FolderProps {
  color: string;
  style?: ViewStyle;
  name: string;
  onPress: () => void;
  onLongPress: () => void;
}

const Folder = ({ color, style, name, onPress, onLongPress }: FolderProps) => {
  return (
    <TouchableOpacity
      style={[style, styles.container]}
      delayLongPress={200}
      onPress={onPress}
      onLongPress={onLongPress}
      activeOpacity={0.6}
    >
      <FolderIcon size={120} color={color} />
      <View style={{ display: "flex", alignItems: "center", width: 120 }}>
        <Text>{name}</Text>
          {/* <Ionicons
            style={{ position: "absolute", right: 0 }}
            name="ellipsis-vertical"
            size={18}
          /> */}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
});

Folder.defaultProps = { color: "black" };

export default Folder;
