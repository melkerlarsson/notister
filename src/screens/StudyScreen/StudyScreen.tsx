import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView, RefreshControl, Image, ActivityIndicator } from "react-native";
import ReactNativeZoomableView from "@openspacelabs/react-native-zoomable-view/src/ReactNativeZoomableView";
import useData from "../../hooks/useData";

import { ReviewButtons } from "./components";
import { getDocs, query, where } from "firebase/firestore";
import { collections, } from "../../firebase/config";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/rootReducer";
import { noteAPI } from "../../firebase";
import { ReviewDifficulty } from "../../types/review";

interface StudyScreenProps {}

const StudyScreen = ({}: StudyScreenProps) => {
	const user = useSelector((state: RootState) => state.userReducer.user);
	const [index, setIndex] = useState<number | null>(0);
	const { loading, data, error, reload } = useData<StudyData[] | null>({
		loadData: async () => {
			if (!user) return null;
			const documents = await getDocs(query(collections.studyData(user.uid), where("reviewDate", "<=", new Date(Date.now()))));
			setIndex(0);
			return documents.docs.map((d) => d.data());
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


	const saveReview = async (studyData: StudyData, difficulty: ReviewDifficulty, userId: string) => {
		const res = await noteAPI.saveReview({ studyData, difficulty, userId})
	};

	const onButtonPress = (diffuculty: ReviewDifficulty) => {
		if (data === null || index === null || user === null) return;
		saveReview(data[index], diffuculty, user.uid);
		showNextNote();
	};

	if (loading) {
		return <ActivityIndicator />;
	}

	if (data && data.length > 0 && index !== null) {
		return (
			<View style={styles.container}>
				<View style={styles.container}>
					<ReactNativeZoomableView key={data[index].imageUrl} style={styles.imageContainer} maxZoom={3} minZoom={1} zoomStep={0.5} initialZoom={1} bindToBorders={true}>
						<Image source={{ uri: data[index].imageUrl }} style={{ width: "100%", height: "100%", resizeMode: "contain" }} />
					</ReactNativeZoomableView>
					<View style={styles.buttonContainer}>
						<ReviewButtons onPress={onButtonPress} />
					</View>
				</View>
			</View>
		);
	}

	return (
		<View style={styles.container}>
			<ScrollView minimumZoomScale={1} maximumZoomScale={3} contentContainerStyle={styles.container}  refreshControl={<RefreshControl enabled={true} onRefresh={reload} refreshing={loading}  />}>
				<Text>No more notes to review</Text>
			</ScrollView>
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
