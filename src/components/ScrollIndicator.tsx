import { useEffect } from "react";
import { View, Text, StyleSheet } from "react-native";
import Animated, {
	Extrapolate,
	interpolate,
	SharedValue,
	useAnimatedStyle,
} from "react-native-reanimated";

interface ScrollIndicatorProps {
	numberOfItems: number;
	width: number;
	scrollValue: number;
}

const ScrollIndicator = ({
	numberOfItems,
	width,
	scrollValue,
}: ScrollIndicatorProps) => {
	useEffect(() => console.log(scrollValue), [scrollValue]);

	return (
		<View
			style={{
				position: "absolute",
				bottom: 20,
				flexDirection: "row",
				width: width,
				justifyContent: "center",
			}}
		>
			{[...Array(numberOfItems).keys()].map((_, index) => (
				<Item
					index={index}
					scrollValue={scrollValue}
					key={index}
					width={width}
				/>
			))}
		</View>
	);
};

const Item = ({
	index,
	scrollValue,
	width,
}: {
	index: number;
	width: number;
	scrollValue: number;
}) => {
	const indicatorStyle = useAnimatedStyle(() => {
		console.log(scrollValue);
		const w = interpolate(
			scrollValue,
			[width * (index - 1), width * index, width * (index + 1)],
			[20, 40, 20],
			Extrapolate.CLAMP
		);
		return { width: w };
	});

	return (
		<Animated.View
			style={[
				{
					marginHorizontal: 20,
					height: 20,
					backgroundColor: "rgb(123, 123, 123)",
					borderRadius: 10,
				},
				indicatorStyle,
			]}
		/>
	);
};

const styles = StyleSheet.create({});

export default ScrollIndicator;
