import { View, Text, StyleSheet, ScrollView, RefreshControl, Image, ActivityIndicator } from "react-native";
import ReactNativeZoomableView from "@openspacelabs/react-native-zoomable-view/src/ReactNativeZoomableView";
import useData from "../../hooks/useData";

import { ReviewButtons } from "./components";
import { getDocs, query, where } from "firebase/firestore";
import { collections } from "../../firebase/config";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/rootReducer";
import { noteAPI } from "../../firebase";
import { ReviewDifficulty } from "../../types/review";
import { Toast } from "../../components";
import { calculateNewReviewInterval } from "../../util";
import { COLORS } from "../../theme/colors";

interface StudyScreenProps {}

const StudyScreen = ({}: StudyScreenProps) => {
	const user = useSelector((state: RootState) => state.userReducer.user);
	const { loading, data, error, reload, setData } = useData<StudyData[] | null>({
		loadData: async () => {
			if (!user) return null;
			const documents = await getDocs(query(collections.studyData(user.uid), where("reviewDate", "<=", new Date(Date.now()))));
			return documents.docs.map((d) => d.data());
		},
	});

	const saveReview = async (studyData: StudyData, difficulty: ReviewDifficulty, userId: string) => {
		const res = await noteAPI.saveReview({ studyData, difficulty, userId });

		if (res.error) {
			Toast.show({ title: res.error.title, description: res.error.description, type: "error" });
		}
	};

	const onButtonPress = async (difficulty: ReviewDifficulty) => {
		if (data === null || user === null || data.length === 0) return;
		await saveReview(data[0], difficulty, user.uid);

		const firstElement = data[0];

		if (difficulty === ReviewDifficulty.Impossible) {
			data.push(firstElement);
		}

		setData(data.splice(1, data.length));
	};

	if (error) {
		return (
			<ScrollView
				contentContainerStyle={[styles.container, { justifyContent: "center", alignItems: "center" }]}
				refreshControl={<RefreshControl enabled={true} onRefresh={reload} refreshing={loading} />}
			>
				<Text style={{ fontSize: 24 }}>Error loading reviews. Scroll down to refresh.</Text>
			</ScrollView>
		);
	}

	if (loading) {
		return (
			<View style={[styles.container, { justifyContent: "center" }]}>
				<ActivityIndicator size="large" color={COLORS.primary} />
			</View>
		);
	}

	if (data && data.length > 0) {
		return (
			<View style={styles.container}>
				<View style={styles.container}>
					<ReactNativeZoomableView key={data[0].imageUrl} style={styles.imageContainer} maxZoom={3} minZoom={1} zoomStep={0.5} initialZoom={1} bindToBorders={true}>
						<Image source={{ uri: data[0].imageUrl }} style={{ width: "100%", height: "100%", resizeMode: "contain" }} />
					</ReactNativeZoomableView>
					<View style={styles.buttonContainer}>
						<ReviewButtons
							onPress={onButtonPress}
							daysUntilNextReview={{
								impossible: calculateNewReviewInterval(data[0].lastReivewInterval, ReviewDifficulty.Impossible),
								difficult: calculateNewReviewInterval(data[0].lastReivewInterval, ReviewDifficulty.Difficult),
								okay: calculateNewReviewInterval(data[0].lastReivewInterval, ReviewDifficulty.Okay),
								easy: calculateNewReviewInterval(data[0].lastReivewInterval, ReviewDifficulty.Easy),
							}}
						/>
					</View>
				</View>
			</View>
		);
	}

	return (
		<ScrollView
			contentContainerStyle={[styles.container, { justifyContent: "center", alignItems: "center" }]}
			refreshControl={<RefreshControl enabled={true} onRefresh={reload} refreshing={loading} />}
		>
			<Text style={{ fontSize: 24 }}>No more notes to review today</Text>
			<Text style={{ fontSize: 14 }}>Scroll down to refresh</Text>
		</ScrollView>
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
