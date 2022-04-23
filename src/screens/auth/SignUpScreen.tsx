import { View, Text, StyleSheet } from "react-native";
import { AuthError, createUserWithEmailAndPassword, sendEmailVerification } from "firebase/auth";
import Button from "../../components/Button";
import { object, SchemaOf, string } from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { SignUpScreenNavigationProps } from "../../navigation/AuthStack";
import { auth } from "../../firebase/config";
import { folderAPI } from "../../firebase";
import { Toast, CustomInput } from "../../components";

type SignUpScreenProps = SignUpScreenNavigationProps;

type FormData = {
	email: string;
	password: string;
};

const schema: SchemaOf<FormData> = object({
	email: string().required("This is a required field").email("The field must be a valid email"),
	password: string().required("This is a required field").min(8, "Your password should be at least 8 characters"),
}).required();

const SignUpScreen = ({ navigation }: SignUpScreenProps) => {
	const {
		control,
		handleSubmit,
		setError,
	} = useForm<FormData>({ mode: "onChange", resolver: yupResolver(schema) });

	const signUp = ({ email, password }: FormData) => {
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
				console.error(error.code);
				switch (error.code) {
					case "auth/email-already-in-use":
						setError("email", { message: "Email is already in use. Please choose another one." });
						break;
					default:
						Toast.show({ type: "error", title: "Oops, something went wrong", description: "An unexpected error occurred while signing up, please try again" });
				}
			});
	};

	return (
		<View style={styles.container}>
			<Text style={{ fontSize: 20 }}>Sign up below!</Text>
			<View style={{ width: "90%", alignItems: "center" }}>
				<CustomInput control={control} name="email" placeholder="john@example.com" label="Email" textContentType="emailAddress" />
				<CustomInput control={control} name="password" placeholder="Password" label="Password" secureTextEntry textContentType="password" />
				<Button title="Sign Up" onPress={handleSubmit(signUp)} style={{ marginTop: 20 }} />
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

export default SignUpScreen;
