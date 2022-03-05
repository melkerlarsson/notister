import { View, Text, StyleSheet } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { Dispatch } from "redux";
import Button from "../components/Button";
import { auth } from "../firebase/config";
import { RootState } from "../redux/rootReducer";
import { signOutUser, UserAction } from "../redux/user/userActions";

interface SettingsScreenProps {}

const SettingsScreen = ({}: SettingsScreenProps) => {
	const dispatch: Dispatch<UserAction> = useDispatch();
	const user = useSelector((state: RootState) => state.userReducer.user);

	const onPress = async () => {
		dispatch(signOutUser());
		await auth.signOut();
	};

	return (
		<View style={styles.container}>
			<Text>Email: {user?.email}</Text>
			<Button title="Sign out" onPress={onPress} />
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		display: "flex",
		flex: 1,
		paddingHorizontal: 20,
		paddingVertical: 40,
	},
});

export default SettingsScreen;
