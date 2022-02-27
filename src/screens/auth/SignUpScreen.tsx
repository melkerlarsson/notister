import { View, Text, StyleSheet, TextInput } from "react-native";
import { getAuth, createUserWithEmailAndPassword, sendEmailVerification } from "firebase/auth";
import Button from "../../components/Button";
import { useState } from "react";
import { SignUpScreenNavigationProps } from "../../navigation/AuthStack";
import { auth } from "../../firebase/config";

type SignUpScreenProps = SignUpScreenNavigationProps;

const SignUpScreen = ({ navigation }: SignUpScreenProps) => {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [errorMessage, setErrorMessage] = useState("");

	const signUp = (email: string, password: string) => {
		email = email.trim();
		email = email.toLowerCase();
		createUserWithEmailAndPassword(auth, email, password)
			.then((userCredential) => {
				const user = userCredential.user;
				sendEmailVerification(user);

				navigation.push("SignIn");
			})
			.catch((error) => {
				const errorCode = error.code;
				const errorMessage = error.message;
				setErrorMessage(errorMessage);
				// ..
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
				{errorMessage ? <Text>{errorMessage}</Text> : null}
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
