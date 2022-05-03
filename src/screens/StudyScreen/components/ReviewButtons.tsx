import { View, StyleSheet } from "react-native";
import Button from "../../../components/Button";

export type ButtonType = "impossible" | "difficult" | "okay" | "easy";

interface ReviewButtonsProps {
	onPress: (type: ButtonType) => void;
}

const ReviewButtons = ({ onPress }: ReviewButtonsProps) => {
	return (
		<View style={styles.container}>
			<Button style={[styles.button, styles.button, styles.button1]} title="Impossible" onPress={() => onPress("impossible")} />
			<Button style={[styles.button, styles.button, styles.button2]} title="Difficult" onPress={() => onPress("difficult")} />
			<Button style={[styles.button, styles.button, styles.button3]} title="Okay" onPress={() => onPress("okay")} />
			<Button style={[styles.button, styles.button, styles.button4]} title="Easy" onPress={() => onPress("easy")} />
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flexDirection: "row",
		width: "100%",
	},
	button: {
		flex: 1,
		paddingHorizontal: 5,
		borderWidth: 0,
	},
	button1: {
		backgroundColor: "#ff0000",
		marginRight: 10,
	},
	button2: {
		backgroundColor: "#ffbe56",
		marginRight: 10,
	},
	button3: {
		backgroundColor: "#ffdf52",
		marginRight: 10,
	},
	button4: {
		backgroundColor: "#58d025",
	},
});

export default ReviewButtons;
