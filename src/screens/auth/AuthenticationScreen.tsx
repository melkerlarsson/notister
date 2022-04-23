import { View, Text, StyleSheet } from "react-native";
import { AuthenticationScreenNavigationProps } from "../../navigation/AuthStack";
import Button from "../../components/Button";

type AuthenticationScreenProps = AuthenticationScreenNavigationProps;

const AuthenticationScreen = ({ navigation }: AuthenticationScreenProps) => {
	return (
		<View style={styles.container}>
			<Text style={{ fontSize: 54, fontWeight: "bold", alignSelf: "flex-start" }}>Notiser</Text>
			<Text style={{ fontSize: 18, alignSelf: "flex-start", marginBottom: 20 }}>Start reviewing your notes today.</Text>
			<View style={styles.buttonContainer}>
				<Button style={[styles.button, { marginVertical: 15 }]} title="Log In" onPress={() => navigation.push("SignIn")} />
				<Button style={styles.button} inverted title="Sign Up" onPress={() => navigation.push("SignUp")} />
			</View>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		display: "flex",
		flex: 1,
		paddingVertical: 40,
		paddingHorizontal: 30,
		justifyContent: "flex-end",
		alignItems: "center",
	},
	buttonContainer: {
		width: "100%",
	},
	button: {
		width: "100%",
	},
});

export default AuthenticationScreen;
