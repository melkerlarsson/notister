import { useEffect, useRef, useState } from "react";
import { View, Text, StyleSheet, Image } from "react-native";
import { PinchGestureHandler, PinchGestureHandlerGestureEvent, GestureHandlerRootView, PanGestureHandler } from "react-native-gesture-handler";
import Animated, { useSharedValue, useAnimatedScrollHandler, useAnimatedGestureHandler, useAnimatedStyle, withSpring, withTiming, useAnimatedProps } from "react-native-reanimated";
import useScreenDimensions from "../../hooks/useScreenDimensions";
import ScrollIndicator from "../ScrollIndicator";

import ReText from "../ReText";

interface ImageViewerProps {}

type Item = { url: string; id: number };

const data: Item[] = [
	{ url: "https://data.whicdn.com/images/313281283/original.jpg", id: 1 },
	{
		url: "https://i.pinimg.com/originals/c6/e2/d6/c6e2d6d7ed59f079810088f2fdc66eee.jpg",
		id: 2,
	},
	{ url: "https://data.whicdn.com/images/313281283/original.jpg", id: 3 },
];

const ImageViewer = ({}: ImageViewerProps) => {
	const { width, height } = useScreenDimensions();

	const scrollRef = useRef<Animated.ScrollView>(null);
	const scrollOffset = useSharedValue(0);

	const currentIndex = useSharedValue("1 / 3");

	const scrollHandler = useAnimatedScrollHandler({
		onScroll: (event) => {
			scrollOffset.value = event.contentOffset.x;
		},
		onEndDrag: () => {
			const index = Math.floor(scrollOffset.value / width) + 1;
			currentIndex.value = index.toString() + " / " + data.length.toString();

			console.log(index);
		},
	});
															
	return (
		<View style={{ width: width, height: height }}>
			<GestureHandlerRootView>
				<>
					<Animated.ScrollView
						contentContainerStyle={{}}
						style={{}}
						scrollEnabled
						pagingEnabled
						horizontal
						decelerationRate={"fast"}
						showsHorizontalScrollIndicator={false}
						bounces={true}
						scrollEventThrottle={16}
						onScroll={scrollHandler}
						ref={scrollRef}
					>
						{data.map((item) => (
							<ScrollViewItem key={item.id} item={item} screenHeight={height} screenWidth={width} />
						))}
					</Animated.ScrollView>
					<View style={{ position: "absolute", bottom: 30, width: width, alignItems: "center" }}>
						<ReText text={currentIndex} />
					</View>
				</>
			</GestureHandlerRootView>

			{/* <ScrollIndicator width={width} numberOfItems={data.length} scrollValue={scrollOffset.value} /> */}
		</View>
	);
};

const ScrollViewItem = ({ item, screenWidth, screenHeight }: { item: Item; screenWidth: number; screenHeight: number }) => {
	const scale = useSharedValue(1);
	const focalX = useSharedValue(0);
	const focalY = useSharedValue(0);

	const pinchHandler = useAnimatedGestureHandler<PinchGestureHandlerGestureEvent>({
		onActive: (event) => {
			scale.value = event.scale;
			focalX.value = event.focalX;
			focalY.value = event.focalY;
		},
		onEnd: (event) => {
			scale.value = withTiming(1);
			focalX.value = 0;
			focalY.value = 0;
		},
	});

	const animatedStyle = useAnimatedStyle(() => {
		return {
			transform: [{ scale: scale.value }],
		};
	});

	return (
		<PinchGestureHandler onGestureEvent={pinchHandler}>
			<Animated.Image style={[{ width: screenWidth, height: screenHeight, resizeMode: "contain" }, animatedStyle]} source={{ uri: item.url }} />
		</PinchGestureHandler>
	);
};

export default ImageViewer;
