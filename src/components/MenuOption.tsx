import { StyleSheet, Text, View } from "react-native";
import { TouchableHighlight } from "react-native-gesture-handler";

export interface MenuOptionProps {
	text: string;
	icon: React.ReactElement;
	onPress: () => void;
	disabled?: boolean;
	textColor?: string;
}

const MenuOption = ({ text, icon: Icon, onPress, disabled , textColor }: MenuOptionProps) => {
	return (
		<TouchableHighlight disabled={disabled} onPress={onPress} underlayColor="#efefef" 
		
		>
			<View style={[styles.container, { opacity: disabled ? 0.2 : 1 }] }>
				{Icon}
				<Text style={[styles.text, { color: textColor}]}>{text}</Text>
			</View>
		</TouchableHighlight>
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
