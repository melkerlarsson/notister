import { useEffect, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import Modal, { BaseModalProps } from "../../../../../components/Modal";
import TextInput from "../../../../../components/TextInput";

interface ShareModalProps extends BaseModalProps {
	onSave: (email: string) => Promise<void>;
}

const ShareModal = ({ onSave, onClose, isVisible }: ShareModalProps) => {
	const [email, setEmail] = useState("");

	const close = () => {
		onClose();
		setEmail("");
	};

	useEffect(() => {
		if (isVisible === true) return;

		setTimeout(() => setEmail(""), 200);
	}, [isVisible]);

	return (
		<Modal
			title="Share folder"
			isVisible={isVisible}
			onClose={close}
			buttons={{ cancel: { text: "Cancel" }, confirm: { text: "Save" } }}
			onButtonPress={async () => await onSave(email)}
			validations={[{
				errorMessage: "Please enter an email",
				validate: () => (email ? true : false),
			}]}
		>
			<TextInput onChangeText={(name) => setEmail(name)} value={email} placeholder="Email" textContentType="emailAddress" autoFocus selectTextOnFocus />
		</Modal>
	);
};

const styles = StyleSheet.create({});

export default ShareModal;
