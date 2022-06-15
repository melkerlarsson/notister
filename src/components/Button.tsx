import { StyleSheet, Text, ViewStyle, TextStyle, TouchableOpacity } from "react-native";
import { COLORS } from "../theme/colors";

interface ButtonProps {
	title?: string;
	style?: ViewStyle | ViewStyle[];
	textStyle?: TextStyle;
	onPress: () => void;
	inverted?: boolean;
	children?: string | React.ReactElement;
}

const Button = ({ title, style, textStyle, onPress, inverted, children }: ButtonProps) => {
	return (
		<TouchableOpacity onPress={onPress} style={[styles.button, { backgroundColor: inverted ? "#fff" : COLORS.primary }, style]} activeOpacity={0.8}>
			{children ? (
				typeof children === "string" ? (
					<Text style={[styles.text, { color: inverted ? COLORS.primary : "#fff" }, textStyle]}>{children}</Text>
				) : (
					children
				)
			) : (
				<Text style={[styles.text, { color: inverted ? COLORS.primary : "#fff" }, textStyle]}>{title}</Text>
			)}
		</TouchableOpacity>
	);
};

const styles = StyleSheet.create({
	button: {
		paddingHorizontal: 20,
		paddingVertical: 10,
		width: 200,
		height: 50,
		justifyContent: "center",
		alignItems: "center",
		borderRadius: 15,
		borderColor: COLORS.primary,
		borderWidth: 1,
	},
	text: {
		color: "#fff",
	},
});

export default Button;
