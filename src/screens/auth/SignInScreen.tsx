import { AuthError, signInWithEmailAndPassword } from "firebase/auth";
import React, { useState } from "react";
import { View, Text, StyleSheet, TextInput } from "react-native";
import Button from "../../components/Button";
import { SignInScreenNavigationProps } from "../../navigation/AuthStack";
import { auth } from "../../firebase/config";
import { Dispatch } from "redux";
import { setUser, UserAction } from "../../redux/user/userActions";
import { useDispatch } from "react-redux";
import { object, SchemaOf, string } from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Toast, CustomInput } from "../../components";

type SignInScreenProps = SignInScreenNavigationProps;

type FormData = {
	email: string;
	password: string;
};

const schema: SchemaOf<FormData> = object({
	email: string().required("This is a required field").email("The field must be a valid email"),
	password: string().required("This is a required field")
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

				console.log(user.email);

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
		<View style={styles.container}>
			<Text style={{ fontSize: 20 }}>Sign in below!</Text>
			<View style={{ width: "90%", alignItems: "center" }}>
				<CustomInput control={control} name="email" placeholder="Your email" label="Email" textContentType="emailAddress" />
				<CustomInput control={control} name="password" placeholder="Your password" label="Password" secureTextEntry textContentType="password" />
				<Button title="Sign In" onPress={handleSubmit(signIn)} style={{ marginTop: 20 }} />
			</View>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		display: "flex",
		flex: 1,
		marginTop: 100,
		alignItems: "center",
	},
});

export default SignInScreen;
