import { useWindowDimensions } from "react-native";
import { useHeaderHeight } from "@react-navigation/elements";
import { TAB_BAR_HEIGHT } from "../navigation/HomeStack";

const useScreenDimensions = (): { height: number; width: number } => {
	const { width, height } = useWindowDimensions();
	const headerHeight = useHeaderHeight();

	const screenHeight = height - headerHeight - TAB_BAR_HEIGHT + 45;

	return { width, height: screenHeight };
};

export default useScreenDimensions;
