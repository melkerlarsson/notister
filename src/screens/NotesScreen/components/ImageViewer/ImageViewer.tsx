import {
	View,
	Text,
	StyleSheet,
	Image,
	ListRenderItemInfo,
	useWindowDimensions,
} from "react-native";
import { ImageViewerNavigationProps } from "../../../../navigation/NotesStack";

import Carousel from "react-native-reanimated-carousel";

import { FlatList } from "react-native-gesture-handler";
import { CarouselRenderItemInfo } from "react-native-reanimated-carousel/lib/typescript/types";
import useScreenDimensions from "../../../../hooks/useScreenDimensions";

const ImageViewer = ({ navigation, route }: ImageViewerNavigationProps) => {
	const { images, index } = route.params;

	const { width, height } = useScreenDimensions();

	const renderItem = (image: CarouselRenderItemInfo<Note>) => {
		return (
			<Image
				source={{ uri: image.item.imageUrl }}
				style={{
					height: height,
					width: width,
					resizeMode: "contain",
					alignSelf: "center",
				}}
			/>
		);
	};

	return (
		<Carousel
			width={width}
			height={height}
			style={{}}
			defaultIndex={index}
			loop={false}
			pagingEnabled
			windowSize={width}
			data={images}
			renderItem={(image) => renderItem(image)}
		/>
	);
};

const styles = StyleSheet.create({});

export default ImageViewer;
