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

	const close = () => {
		onClose();
		setName(currentName);
	};

	return (
		<Modal
			title={title}
			isVisible={isVisible}
			onClose={close}
			buttons={{ cancel: { text: "Cancel" }, confirm: { text: "Save" } }}
			onButtonPress={async () => await onSave(name)}
			validation={{
				errorMessage: "Please enter a folder name",
				validate: () => (name ? true : false),
			}}
		>
			<TextInput onChangeText={(name) => setName(name)} value={name} placeholder="Folder name" textContentType="name" autoFocus selectTextOnFocus />
		</Modal>
	);
};

export default UpdateNameModal;
