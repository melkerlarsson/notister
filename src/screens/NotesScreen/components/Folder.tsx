import FolderIcon from "../../../components/FolderIcon";
import FolderItem, { FolderItemBaseProps, FOLDER_ITEM_SIZE } from "./FolderItem";

interface FolderProps extends FolderItemBaseProps {
	color: string;
}

const Folder = ({ color, ...props }: FolderProps) => {
	return (
		<FolderItem {...props}>
			<FolderIcon size={FOLDER_ITEM_SIZE} color={color} />
		</FolderItem>
	);
};

export default Folder;
