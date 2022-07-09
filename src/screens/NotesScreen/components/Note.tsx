import { Image, StyleSheet } from "react-native";
import FolderItem, { FolderItemBaseProps, FOLDER_ITEM_SIZE } from "./FolderItem";

interface NoteProps extends FolderItemBaseProps {
	imageUrl: string;
}

const Note = ({ imageUrl, ...props }: NoteProps) => {
	return (
		<FolderItem {...props}>
			<Image source={{ uri: imageUrl }} style={styles.image}/>
		</FolderItem>
	);
};

const styles = StyleSheet.create({
	image: {
		width: FOLDER_ITEM_SIZE,
		height: FOLDER_ITEM_SIZE,
		borderRadius: 10,
		marginBottom: 20,
		borderWidth: 1,
		borderColor: "#d8d8d8"
	},
});

export default Note;
