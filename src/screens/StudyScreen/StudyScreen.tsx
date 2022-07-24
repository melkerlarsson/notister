import { View, Text, StyleSheet, ScrollView, RefreshControl, Image, ActivityIndicator } from "react-native";
import ReactNativeZoomableView from "@openspacelabs/react-native-zoomable-view/src/ReactNativeZoomableView";
import useData from "../../hooks/useData";
import { Ionicons } from "@expo/vector-icons";
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
import { useLayoutEffect, useState } from "react";
import { StudyTabScreenProps } from "../../navigation/HomeStack";

type StudyScreenProps = StudyTabScreenProps;

const StudyScreen = ({ navigation }: StudyScreenProps) => {
	const user = useSelector((state: RootState) => state.userReducer.user);
	const [savingReview, setSavingReview] = useState(false);
	const { loading, data, error, reload, setData } = useData<StudyData[] | null>({
		loadData: async () => {
			if (!user) return null;
			const documents = await getDocs(query(collections.studyData(user.uid), where("reviewDate", "<=", new Date(Date.now()))));
			return documents.docs.map((d) => d.data());
		},
	});

	useLayoutEffect(() => {
		navigation.setOptions({
			headerRight: () => <Ionicons name="reload" onPress={reload} color={"#000"} size={24} />,
		});
	}, [navigation]);

	const saveReview = async (studyData: StudyData, difficulty: ReviewDifficulty, userId: string): Promise<StudyData> => {
		const res = await noteAPI.saveReview({ studyData, difficulty, userId });

		if (res.error) {
			Toast.show({ title: res.error.title, description: res.error.description, type: "error" });
			return studyData;
		} else {
			return res.data;
		}
	};

	const onButtonPress = async (difficulty: ReviewDifficulty) => {
		if (data === null || user === null || data.length === 0) return;

		setSavingReview(true);
		const newStudyData = await saveReview(data[0], difficulty, user.uid);

		if (difficulty === ReviewDifficulty.Impossible) {
			data.push(newStudyData);
		}

		setData(data.splice(1, data.length));
		setSavingReview(false);
	};

	if (error) {
		console.error(error);
		return (
			<ScrollView
				contentContainerStyle={[styles.container, { justifyContent: "center", alignItems: "center" }]}
				refreshControl={<RefreshControl enabled={true} onRefresh={reload} refreshing={loading} />}
			>
				<Text style={{ fontSize: 24 }}>Error loading reviews</Text>
				<Text style={{ fontSize: 14 }}>Scroll down to refresh</Text>
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
							disabled={savingReview}
							onPress={onButtonPress}
							daysUntilNextReview={{
								impossible: calculateNewReviewInterval(data[0].lastReivewInterval, ReviewDifficulty.Impossible),
								difficult: calculateNewReviewInterval(data[0].lastReivewInterval, ReviewDifficulty.Difficult),
								okay: calculateNewReviewInterval(data[0].lastReivewInterval, ReviewDifficulty.Okay),
								easy: calculateNewReviewInterval(data[0].lastReivewInterval, ReviewDifficulty.Easy),
							}}
						/>
					</View>
					{savingReview && <ActivityIndicator size="large" style={{ position: "absolute", alignSelf: "center", top: "40%" }} color={"#000"} />}
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
