import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, useWindowDimensions, ActivityIndicator } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { default as RnModal } from "react-native-modal";
import { COLORS } from "../theme/colors";
import Button from "./Button";

export interface BaseModalProps {
	isVisible: boolean;
	onClose: () => void;
}

type Buttons = {
	confirm: {
		text: string;
	};
	cancel: {
		text: string;
	};
};

type Validation = {
	errorMessage: string;
	validate: () => boolean;
};

interface ModalProps {
	title: string;
	description?: string;
	children?: React.ReactElement;
	isVisible: boolean;

	withLoadingIndicator?: boolean;
	buttons?: Buttons;

	onClose: () => void;
	onButtonPress: () => void | Promise<void>;
	validations?: Validation[];
}

const Modal = ({
	title,
	description,
	children,
	buttons = { confirm: { text: "Confirm" }, cancel: { text: "Cancel" } },
	isVisible,
	withLoadingIndicator = true,
	onClose,
	validations = [],
	onButtonPress,
}: ModalProps) => {
	const { width } = useWindowDimensions();
	const modalWidth = 0.85 * width;

	const [loading, setLoading] = useState(false);
	const [errorMessage, setErrorMessage] = useState("");

	const onConfirmButtonPressed = async () => {
		if (validations.length === 0) {
			setErrorMessage("");
			setLoading(true);
			await onButtonPress();
			onClose();
			setLoading(false);
		} else {
			for (const validation of validations) {
				if (validation.validate()) {
					setErrorMessage("");
					setLoading(true);
					await onButtonPress();
					onClose();
					setLoading(false);
				} else {
					setErrorMessage(validation.errorMessage);
				}
			}
		}
	};

	useEffect(() => {
		if (isVisible) return;

		setTimeout(() => setErrorMessage(""), 200);
	}, [isVisible]);

	return (
		<RnModal
			style={styles.modal}
			isVisible={isVisible}
			animationIn="zoomIn"
			animationOut="zoomOut"
			onBackdropPress={onClose}
			onBackButtonPress={onClose}
			backdropOpacity={0.2}
			backdropTransitionOutTiming={0}
		>
			<GestureHandlerRootView>
				<View style={[styles.content, { width: modalWidth }]}>
					<Text style={styles.title}>{title}</Text>

					{description ? <Text style={styles.description}>{description}</Text> : null}

					{children}

					{errorMessage ? <Text>{errorMessage}</Text> : null}

					<View style={styles.buttons}>
						<Button style={{ ...styles.button, width: 0.3 * modalWidth }} textStyle={styles.buttonTextStyle} onPress={onClose}>
							{buttons.cancel.text}
						</Button>
						<Button style={{ ...styles.button, width: 0.3 * modalWidth }} textStyle={styles.buttonTextStyle} onPress={onConfirmButtonPressed}>
							{loading && withLoadingIndicator ? <ActivityIndicator size="small" color={COLORS.primary} /> : buttons.confirm.text}
						</Button>
					</View>
				</View>
			</GestureHandlerRootView>
		</RnModal>
	);
};

const styles = StyleSheet.create({
	modal: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
	},
	title: {
		fontWeight: "bold",
		fontSize: 18,
		marginBottom: 20,
	},
	description: {
		fontSize: 16,
		marginBottom: 20,
	},
	content: {
		display: "flex",
		padding: 20,
		backgroundColor: "#fff",
		borderRadius: 20,
	},
	buttons: {
		display: "flex",
		flexDirection: "row",
		justifyContent: "flex-end",
	},
	button: {
		shadowOpacity: 0,
		elevation: 0,
		backgroundColor: "#fff",
	},
	buttonTextStyle: {
		color: COLORS.primary,
	},
});

export default Modal;
