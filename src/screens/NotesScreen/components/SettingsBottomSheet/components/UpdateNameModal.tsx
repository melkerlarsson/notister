import { useEffect, useState } from "react";
import Modal, { BaseModalProps } from "../../../../../components/Modal";
import TextInput from "../../../../../components/TextInput";

interface UpdateNameModalProps extends BaseModalProps {
	onSave: (name: string) => Promise<void>;
	currentName: string;
	title: string;
}

const UpdateNameModal = ({ isVisible, onClose, onSave, currentName, title }: UpdateNameModalProps) => {
	const [name, setName] = useState(currentName);

	useEffect(() => setName(currentName), [currentName]);

	useEffect(() => {
		if (isVisible === true) return;
		
		setTimeout(() => setName(currentName), 200);
	}, [isVisible]);

	return (
		<Modal
			title={title}
			isVisible={isVisible}
			onClose={onClose}
			buttons={{ cancel: { text: "Cancel" }, confirm: { text: "Save" } }}
			onButtonPress={async () => await onSave(name)}
			validations={[{
				errorMessage: "Please enter a folder name",
				validate: () => (name ? true : false),
			}]}
		>
			<TextInput onChangeText={(name) => setName(name)} value={name} placeholder="Folder name" textContentType="name" autoFocus selectTextOnFocus />
		</Modal>
	);
};

export default UpdateNameModal;
