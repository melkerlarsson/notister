import { View, StyleSheet } from "react-native";
import Button from "../../../components/Button";
import { ReviewDifficulty } from "../../../types/review";

interface ReviewButtonsProps {
	onPress: (type: ReviewDifficulty) => void;
}

const ReviewButtons = ({ onPress }: ReviewButtonsProps) => {
	return (
		<View style={styles.container}>
			<Button style={[styles.button, styles.button, styles.button1]} title="Impossible" onPress={() => onPress(ReviewDifficulty.Impossible)} />
			<Button style={[styles.button, styles.button, styles.button2]} title="Difficult" onPress={() => onPress(ReviewDifficulty.Difficult)} />
			<Button style={[styles.button, styles.button, styles.button3]} title="Okay" onPress={() => onPress(ReviewDifficulty.Okay)} />
			<Button style={[styles.button, styles.button, styles.button4]} title="Easy" onPress={() => onPress(ReviewDifficulty.Easy)} />
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
