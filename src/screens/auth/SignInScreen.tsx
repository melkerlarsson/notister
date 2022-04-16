import { AuthError, signInWithEmailAndPassword } from "firebase/auth";
import React, {  useState } from "react";
import { View, Text, StyleSheet, TextInput } from "react-native";
import Button from "../../components/Button";
import { SignInScreenNavigationProps } from "../../navigation/AuthStack";
import { auth } from "../../firebase/config";
import { Dispatch } from "redux";
import { setUser, UserAction } from "../../redux/user/userActions";
import { useDispatch } from "react-redux";
import Toast from "../../components/Toast";

type SignInScreenProps = SignInScreenNavigationProps;

const SignInScreen = ({ navigation }: SignInScreenProps) => {
	const dispatch: Dispatch<UserAction> = useDispatch();

	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");

	const signIn = (email: string, password: string) => {
		email = email.trim();
		email = email.toLowerCase();

		signInWithEmailAndPassword(auth, email, password)
			.then((userCredential) => {
				const user = userCredential.user;

				console.log(user.email);

				if (!user.emailVerified) {
					Toast.show({ type: "error", title: "Error signing in", description: "Please verify your email before signing in" });
				} else {
					dispatch(setUser(user));
				}
			})
			.catch((error: AuthError) => {
				const errorMessage = error.message;
				Toast.show({ type: "error", title: "Error signing in", description: errorMessage});
			});
	};

	return (
		<View style={styles.container}>
			<Text>Sign In!</Text>
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
					textContentType="password"
					autoCompleteType="password"
				/>
				<Button title="Sign In" onPress={() => signIn(email, password)} />
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

export default SignInScreen;
