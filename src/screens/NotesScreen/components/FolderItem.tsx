import React from "react";
import { View, StyleSheet } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";

interface FolderItemProps {
}

const FolderItem = ({}: FolderItemProps) => {
	return <TouchableOpacity style={styles.container}></TouchableOpacity>;
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
});

export default FolderItem;
