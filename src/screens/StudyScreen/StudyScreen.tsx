import React, { useState } from "react";
import { View, Text, StyleSheet, ScrollView, RefreshControl, Image } from "react-native";
import ReactNativeZoomableView from "@openspacelabs/react-native-zoomable-view/src/ReactNativeZoomableView";
import useData from "../../hooks/useData";

import { ReviewButtons } from "./components";
import { ButtonType } from "./components/ReviewButtons";

interface StudyScreenProps {}

const fakeData = [
	{ uri: "https://media.collegetimes.com/uploads/2016/12/07170047/studyb.png" },
	{ uri: "https://data.whicdn.com/images/341323858/original.jpg" },
	{ uri: "https://data.whicdn.com/images/337761996/original.jpg" },
	{ uri: "https://data.whicdn.com/images/341164540/original.jpg" },
];

const StudyScreen = ({}: StudyScreenProps) => {
	const [index, setIndex] = useState<number | null>(0);
	const { loading, data, error, reload } = useData({
		loadData: async () => {
			await new Promise((resolve) => setTimeout(resolve, 2000));
			setIndex(0);
			return fakeData;
		},
	});

	const showNextNote = () => {
		if (data && index === data.length - 1) {
			setIndex(null);
		} else {
			if (index !== null) {
				setIndex(index + 1);
			}
		}
	};

	const saveReview = (type: ButtonType) => {};

	const onButtonPress = (type: ButtonType) => {
		showNextNote();
		saveReview(type);
	};

	if (loading) {
		return <Text>Loading...</Text>
	}

	return (
		<View style={styles.container}>
			{data && index !== null ? (
				<View style={styles.container}>
					<ReactNativeZoomableView 
						key={data[index].uri} 
						style={styles.imageContainer} 
						maxZoom={3} minZoom={1} 
						zoomStep={0.5} 
						initialZoom={1} 
						bindToBorders={true} 
					>
						<Image source={{ uri: data[index].uri }} style={{ width: "100%", height: "100%", resizeMode: "contain" }} />
					</ReactNativeZoomableView>
					<View style={styles.buttonContainer}>
						<ReviewButtons onPress={onButtonPress} />
					</View>
				</View>
			) : (
				<ScrollView minimumZoomScale={1} maximumZoomScale={3} contentContainerStyle={styles.container} refreshControl={<RefreshControl enabled={true} onRefresh={reload} refreshing={loading} />}>
					<Text>No more notes to review</Text>
				</ScrollView>
			)}
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#fff",
	},
	imageContainer: {
		flex: 1,
		backgroundColor: "#fff",
	},
	buttonContainer: {
		paddingVertical: 10,
		paddingHorizontal: 10,
	},
});

export default StudyScreen;
