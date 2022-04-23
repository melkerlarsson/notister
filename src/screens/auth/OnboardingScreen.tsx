import { View, StyleSheet, Text } from "react-native";
import Button from "../../components/Button";

import { OnboardingScreenNavigationProps } from "../../navigation/AuthStack";

type OnboardingScreenProps = OnboardingScreenNavigationProps;

const OnboardingScreen = ({ navigation }: OnboardingScreenProps) => {
	return (
		<View style={styles.container}>
			<Text style={styles.text}>Welcome to Notister</Text>
			<Button style={styles.button} title="Get Started" onPress={() => navigation.push("Authentication")} />
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		display: "flex",
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		paddingHorizontal: 30,
	},
	button: {
		width: "100%",
		position: "absolute", 
		bottom: 40,
	},
	text: {
		fontSize: 42,
		fontWeight: "200",
	},
});

export default OnboardingScreen;
