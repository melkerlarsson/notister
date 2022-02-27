import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import React, { useContext, useState } from "react";
import { View, Text, StyleSheet, TextInput } from "react-native";
import Button from "../../components/Button";
import { SignInScreenNavigationProps } from "../../navigation/AuthStack";
import { CommonActions } from "@react-navigation/native";
import { auth } from "../../firebase/config";
import { Dispatch } from "redux";
import { setUser, UserAction } from "../../redux/user/userActions";
import { useDispatch } from "react-redux";

type SignInScreenProps = SignInScreenNavigationProps;

const SignInScreen = ({ navigation }: SignInScreenProps) => {
	const dispatch: Dispatch<UserAction> = useDispatch();

	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [errorMessage, setErrorMessage] = useState("");

	const signIn = (email: string, password: string) => {
		email = email.trim();
		email = email.toLowerCase();

		console.log("Before signin in");

		signInWithEmailAndPassword(auth, email, password)
			.then((userCredential) => {
				const user = userCredential.user;

				console.log(user.email);

				if (!user.emailVerified) {
					setErrorMessage("Please verify your email before signing in");
				} else {
					dispatch(setUser(user));
				}
			})
			.catch((error) => {
				const errorCode = error.code;
				const errorMessage = error.message;
				setErrorMessage(errorMessage);
				console.log(errorMessage);
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
				{errorMessage ? <Text>{errorMessage}</Text> : null}
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
