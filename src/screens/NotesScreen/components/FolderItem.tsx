import { StyleSheet, Text, } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
export interface FolderItemBaseProps {
	name: string;
	onPress: () => void;
	onLongPress: () => void;
}

export const FOLDER_ITEM_SIZE = 120;

interface FolderItemProps extends FolderItemBaseProps {
	children: React.ReactElement;
}

const FolderItem = ({ name, onPress, onLongPress, children }: FolderItemProps) => {

	return (
		<TouchableOpacity style={styles.container} delayLongPress={200} onPress={onPress} onLongPress={onLongPress} activeOpacity={0.6}>
			{children}
			<Text style={styles.name}>{name}</Text>

			{/* <Ionicons
            style={{ position: "absolute", right: 0 }}
            name="ellipsis-vertical"
            size={18}
          /> */}
		</TouchableOpacity>
	);
};

const styles = StyleSheet.create({
	container: {
		display: "flex",
		justifyContent: "center",
		alignItems: "center",
		paddingBottom: 50,
	},
	name: {},
});

export default FolderItem;
