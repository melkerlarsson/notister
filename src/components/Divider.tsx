import { View, StyleSheet, Text } from "react-native";

type DividerProps = {
	text?: string;
};

const Divider = ({ text }: DividerProps) => {
	if (!text) {
		return <View style={[styles.divider, { width: "100%" }]} />;
	} else {
		return (
			<View style={{ display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "center"}}>
				<View style={[styles.divider, { flex: 1, marginVertical: 15 }]} />
				<Text style={{ marginHorizontal: 10 }}>{text}</Text>
				<View style={[styles.divider, { flex: 1, marginVertical: 15 }]} />
			</View>
		);
	}
};

const styles = StyleSheet.create({
	divider: {
		height: 1,
		backgroundColor: "#d4d4d4",
		marginVertical: 10,
	},
});

export default Divider;
