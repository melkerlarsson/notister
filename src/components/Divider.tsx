import { View, StyleSheet } from "react-native";

const Divider = () => {
	return <View style={styles.divider} />;
};

const styles = StyleSheet.create({
	divider: {
		width: "100%",
		height: 1,
		backgroundColor: "#c9c9c9",
		marginVertical: 10,
	},
});

export default Divider;
