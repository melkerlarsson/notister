import { View, Text, StyleSheet } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { Dispatch } from "redux";
import MenuOption from "../components/MenuOption";
import Divider from "../components/Divider";
import { auth } from "../firebase/config";
import { RootState } from "../redux/rootReducer";
import { Ionicons } from "@expo/vector-icons";
import { signOutUser, UserAction } from "../redux/user/userActions";
import { COLORS } from "../theme/colors";

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
			<Divider />
			<Text style={{ paddingHorizontal: 20, fontSize: 18, marginTop: 10, marginBottom: 10 }}>Signed in as {user?.email}</Text>
			<Divider />
			<MenuOption text="Sign out" icon={<Ionicons name="exit-outline" size={28} color={COLORS.error} />} onPress={onPress} textColor={COLORS.error} />
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		display: "flex",
		flex: 1,
		paddingVertical: 10,
		backgroundColor: "#fff"
	},
});

export default SettingsScreen;
