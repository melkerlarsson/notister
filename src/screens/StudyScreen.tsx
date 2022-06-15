import { View, Text, StyleSheet } from "react-native";


interface StudyScreenProps {}

const StudyScreen = ({}: StudyScreenProps) => {

	return (
		<View style={styles.container}>
			<Text style={styles.text}>Coming soon...</Text>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		backgroundColor: "#fff",
		flex: 1,
	},
	text: {
		fontSize: 42,
		alignSelf: "center",
		marginTop: 100
	}
});

export default StudyScreen;
