import { View, Text, StyleSheet, TextInput } from "react-native";
import { AuthError, createUserWithEmailAndPassword, sendEmailVerification } from "firebase/auth";
import Button from "../../components/Button";
import { useState } from "react";
import { SignUpScreenNavigationProps } from "../../navigation/AuthStack";
import { auth } from "../../firebase/config";
import { folderAPI } from "../../firebase";
import Toast from "../../components/Toast";

type SignUpScreenProps = SignUpScreenNavigationProps;

const SignUpScreen = ({ navigation }: SignUpScreenProps) => {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");

	const signUp = (email: string, password: string) => {
		email = email.trim();
		email = email.toLowerCase();
		createUserWithEmailAndPassword(auth, email, password)
			.then(async (userCredential) => {
				const user = userCredential.user;
				void sendEmailVerification(user);
				const error = await folderAPI.createRootFolder(user.uid);

				if (error) {
					Toast.show({ type: "error", title: error.title, description: error.description });
				} else {
					navigation.push("SignIn");
				}
			})
			.catch((error: AuthError) => {
				let message = "";
				console.log(error.message);
				switch (error.message) {
					case "auth/weak-password":
						message = "The password is too weak.";
						break;
					default:
						message = "Error signing up. Please try again.";
				}
				Toast.show({ type: "error", title: "Error", description: message });
			});
	};

	return (
		<View style={styles.container}>
			<Text>Sign Up!</Text>
			<View
				style={{
					justifyContent: "center",
					alignItems: "center",
					display: "flex",
				}}
			>
				<TextInput
					style={styles.textInput}
					onChangeText={(text) => {
						setEmail(text);
					}}
					value={email}
					placeholder="Email"
					textContentType="emailAddress"
					autoCompleteType="email"
				/>

				<TextInput
					style={styles.textInput}
					onChangeText={(text) => {
						setPassword(text);
					}}
					secureTextEntry={true}
					value={password}
					placeholder="Password"
					textContentType="newPassword"
					autoCompleteType="password"
				/>
				<Button title="Sign Up" onPress={() => signUp(email, password)} />
			</View>
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

	textInput: {
		width: 300,
		height: 50,
		borderRadius: 25,
		borderColor: "#269dff",
		borderWidth: 1,
		marginVertical: 10,
		paddingHorizontal: 10,
	},
});

export default SignUpScreen;
