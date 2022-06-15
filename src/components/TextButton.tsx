import { View, Text, StyleSheet } from "react-native";
import { TouchableHighlight } from "react-native-gesture-handler";
import { COLORS } from "../theme/colors";

interface TextButtonProps {
	onPress: () => void;
	children?: string | React.ReactElement;
  type?: "error" | "primary"
}

const TextButton = ({ onPress, children, type = "primary"}: TextButtonProps) => {
	const renderChildren = () => {
		if (typeof children === "string") {
			return <Text style={[styles.textStyle, { color: type === "error" ? COLORS.error : "#000"}]}>{children}</Text>;
		} else {
			return <>{children}</>;
		}
	};

	return (
		<View style={styles.container}>
			<TouchableHighlight onPress={onPress} underlayColor="#efefef">
				<View style={styles.button}>{renderChildren()}</View>
			</TouchableHighlight>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		width: 90,
		maxWidth: 200,
		borderRadius: 10,
		overflow: "hidden",
	},
	button: {
		paddingHorizontal: 20,
    paddingVertical: 15,
		alignItems: "center",
	},
	textStyle: {
		color: "#000",
		fontSize: 14,
	},
});

export default TextButton;
