import { View, StyleSheet, Text, ViewStyle, TextStyle, TouchableOpacity } from "react-native";

interface ButtonProps {
  title?: string;
  style?: ViewStyle;
  textStyle?: TextStyle;
  onPress: () => void;
  reversed?: boolean;
  children?: string | React.ReactElement;
}

const Button = ({ title, style, textStyle, onPress, reversed, children}: ButtonProps) => {
	const reversedButtonStyles = () => {
		if (!reversed) return {};

		return {
			backgroundColor: "#fff",
		};
	};

	const reversedTextSyle = () => {
		if (!reversed) return {};

		return {
			color: "#269dff",
		};
	};

	return (
		<TouchableOpacity onPress={onPress} style={[styles.button, style, reversedButtonStyles()]} activeOpacity={0.8}>
			{children ? (
				typeof children === "string" ? (
					<Text style={[styles.text, textStyle, reversedTextSyle()]}>{children}</Text>
				) : (
					children
				)
			) : (
				<Text style={[styles.text, textStyle, reversedTextSyle()]}>{title}</Text>
			)}
		</TouchableOpacity>
	);
};

const styles = StyleSheet.create({
	button: {
		backgroundColor: "#269dff",
		paddingHorizontal: 20,
		paddingVertical: 10,
		width: 200,
		height: 50,
		justifyContent: "center",
		alignItems: "center",
		borderRadius: 25,
		shadowColor: "#269dff",
		shadowOffset: { width: 2, height: 4 },
		shadowOpacity: 0.2,
		shadowRadius: 3,
		elevation: 20,
	},
	text: {
		color: "#fff",
	},
});

export default Button;
