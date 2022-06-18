import { AuthError, signInWithEmailAndPassword } from "firebase/auth";
import React from "react";
import { View, Text, StyleSheet, KeyboardAvoidingView } from "react-native";
import Button from "../../components/Button";
import { SignInScreenNavigationProps } from "../../navigation/AuthStack";
import { auth } from "../../firebase/config";
import { Dispatch } from "redux";
import { setUser, UserAction } from "../../redux/user/userActions";
import { useDispatch } from "react-redux";
import { object, SchemaOf, string } from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Toast, CustomInput, Divider } from "../../components";

type SignInScreenProps = SignInScreenNavigationProps;

type FormData = {
	email: string;
	password: string;
};

const schema: SchemaOf<FormData> = object({
	email: string().required("This is a required field").email("The field must be a valid email"),
	password: string().required("This is a required field"),
}).required();

const SignInScreen = ({ navigation }: SignInScreenProps) => {
	const dispatch: Dispatch<UserAction> = useDispatch();

	const { control, handleSubmit } = useForm<FormData>({ resolver: yupResolver(schema) });

	const signIn = ({ email, password }: FormData) => {
		email = email.trim();
		email = email.toLowerCase();

		signInWithEmailAndPassword(auth, email, password)
			.then((userCredential) => {
				const user = userCredential.user;

				if (!user.emailVerified) {
					Toast.show({ type: "error", title: "Error signing in", description: "Please verify your email before signing in" });
				} else {
					dispatch(setUser(user));
				}
			})
			.catch((error: AuthError) => {
				const errorMessage = error.message;
				Toast.show({ type: "error", title: "Error signing in", description: errorMessage });
			});
	};

	return (
		<KeyboardAvoidingView style={{  flex: 1 }} contentContainerStyle={{ width: "100%", ...styles.container }} behavior="position" keyboardVerticalOffset={-200}>
			<Text style={{ fontSize: 48, fontWeight: "bold", alignSelf: "flex-start", position: "absolute", top: 200, left: 20 }}>Welcome{"\n"}back</Text>
			<View style={{ width: "100%", alignItems: "center" }}>
				<CustomInput control={control} name="email" placeholder="Your email" label="Email" textContentType="emailAddress" />
				<CustomInput control={control} name="password" placeholder="Your password" label="Password" secureTextEntry textContentType="password" />
				<Button title="Log In" onPress={handleSubmit(signIn)} style={[styles.button, { marginTop: 40 }]} />
				<Divider text="or" />
				<Button title="Sign Up" onPress={() => navigation.push("SignUp")} inverted style={styles.button} />
			</View>
		</KeyboardAvoidingView>
	);
};

const styles = StyleSheet.create({
	container: {
		display: "flex",
		flex: 1,
		paddingVertical: 40,
		paddingHorizontal: 20,
		alignItems: "center",
		justifyContent: "flex-end",
	},
	button: {
		width: "100%",
	},
});

export default SignInScreen;
