import { StyleSheet, Text, View } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";

interface MenuOptionProps {
	text: string;
	icon: React.ReactElement;
	onPress: () => void;
	disabled?: boolean;
}

const MenuOption = ({ text, icon: Icon, onPress, disabled }: MenuOptionProps) => {
	return (
		<TouchableOpacity disabled={disabled} onPress={onPress}>
			<View style={styles.container}>
				{Icon}
				<Text style={styles.text}>{text}</Text>
			</View>
		</TouchableOpacity>
	);
};

const styles = StyleSheet.create({
	container: {
		display: "flex",
		flexDirection: "row",
		alignItems: "center",
		paddingVertical: 15,
		paddingHorizontal: 20,
	},
	icon: {},
	text: {
		marginLeft: 10,
	},
});

export default MenuOption;
