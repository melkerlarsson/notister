import { View, StyleSheet, Text } from "react-native";
import Button from "../../../components/Button";
import { ReviewDifficulty } from "../../../types/review";

interface ReviewButtonsProps {
	onPress: (type: ReviewDifficulty) => void;
	daysUntilNextReview: {
		impossible: number;
		difficult: number;
		okay: number;
		easy: number;
	};
	disabled: boolean;
}

const ReviewButtons = ({ onPress, disabled, daysUntilNextReview }: ReviewButtonsProps) => {
	return (
		<View style={[styles.container]}>
			<Button style={[styles.button, styles.button, styles.button1]} disabled={disabled} onPress={() => onPress(ReviewDifficulty.Impossible)}>
				<>
					<Text style={[styles.text, styles.difficulty]}>Impossible</Text>
					<Text style={styles.text}>{`In ${daysUntilNextReview.impossible} day`}</Text>
				</>
			</Button>
			<Button style={[styles.button, styles.button, styles.button2]} disabled={disabled} onPress={() => onPress(ReviewDifficulty.Difficult)}>
				<>
					<Text style={[styles.text, styles.difficulty]}>Difficult</Text>
					<Text style={styles.text}>{`In ${daysUntilNextReview.difficult} days`}</Text>
				</>
			</Button>
			<Button style={[styles.button, styles.button, styles.button3]} disabled={disabled} onPress={() => onPress(ReviewDifficulty.Okay)}>
				<>
					<Text style={[styles.text, styles.difficulty]}>Okay</Text>
					<Text style={styles.text}>{`In ${daysUntilNextReview.okay} days`}</Text>
				</>
			</Button>
			<Button style={[styles.button, styles.button, styles.button4]} disabled={disabled} onPress={() => onPress(ReviewDifficulty.Easy)}>
				<>
					<Text style={[styles.text, styles.difficulty]}>Easy</Text>
					<Text style={styles.text}>{`In ${daysUntilNextReview.easy} days`}</Text>
				</>
			</Button>
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
	text: {
		color: "#fff",
	},
	difficulty: {
		fontWeight: "bold",
	}
});

export default ReviewButtons;
