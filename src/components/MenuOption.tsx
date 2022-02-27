import { StyleSheet, Text } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";

interface MenuOptionProps {
  text: string;
  icon: React.ReactElement;
  onPress: () => void;
}

const MenuOption = ({ text, icon: Icon, onPress }: MenuOptionProps) => {
	return (
		<TouchableOpacity style={styles.container} onPress={onPress}>
			{Icon}
			<Text style={styles.text}>{text}</Text>
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
