import { StyleSheet, Text, View } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";

export interface MenuOptionProps {
	text: string;
	icon: React.ReactElement;
	onPress: () => void;
	disabled?: boolean;
}

const MenuOption = ({ text, icon: Icon, onPress, disabled }: MenuOptionProps) => {
	return (
		<TouchableOpacity disabled={disabled} onPress={onPress}>
			<View style={[styles.container, { opacity: disabled ? 0.2 : 1 }] }>
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
