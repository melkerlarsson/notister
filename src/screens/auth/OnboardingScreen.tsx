import { View, StyleSheet, Text } from "react-native";
import Button from "../../components/Button";

import { OnboardingScreenNavigationProps } from "../../navigation/AuthStack";

type OnboardingScreenProps = OnboardingScreenNavigationProps;

const OnboardingScreen = ({ navigation }: OnboardingScreenProps) => {
	return (
		<View style={styles.container}>
			<Text>Welcome to Notister</Text>
			<Button style={{ marginTop: 20 }} title="Next" onPress={() => navigation.push("Authentication")} />
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		display: "flex",
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
	},
});

export default OnboardingScreen;
