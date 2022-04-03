import { useWindowDimensions, View, Text } from "react-native";
import Modal from "react-native-modal";
import { StatusBar } from "expo-status-bar";
import { default as ImageSlider } from "react-native-image-zoom-viewer";

type ImageData = {
	url: string;
};

type ImageViewerProps = {
	images: ImageData[];
	visible: boolean;
	onClose: () => void;
	startIndex: number;
};

const ImageViewer = ({ images, visible, onClose, startIndex }: ImageViewerProps) => {
	const NUMBER_OF_IMAGES = images.length;

	const { width } = useWindowDimensions();

	return (
		<>
			<StatusBar animated={true} backgroundColor={visible ? "#000" : "#fff"} style={visible ? "inverted" : "dark"} translucent={visible} />
			<Modal style={{ padding: 0, margin: 0 }} useNativeDriver isVisible={visible} animationIn="zoomIn" animationOut="fadeOut" onBackButtonPress={onClose}>
				<ImageSlider
					imageUrls={images}
					onCancel={onClose}
					onSwipeDown={onClose}
					index={startIndex}
					enableSwipeDown
					renderIndicator={() => <></>}
					renderFooter={(index) => (
						<View style={{ width, marginBottom: 40, alignItems: "center" }}>
							<Text style={{ color: "#fff" }}>
								{index + 1} / {NUMBER_OF_IMAGES}
							</Text>
						</View>
					)}
				/>
			</Modal>
		</>
	);
};

export default ImageViewer;