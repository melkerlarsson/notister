import { ReactElement, useCallback, useEffect, useMemo, useRef } from "react";
import { View, Text, StyleSheet } from "react-native";
import BottomSheet, {
	useBottomSheetSpringConfigs,
	BottomSheetBackdrop,
} from "@gorhom/bottom-sheet";
import { Portal, PortalHost } from "@gorhom/portal";
import { MenuOptionProps } from "../../../../components/MenuOption";
import Divider from "../../../../components/Divider";

export interface SettingsBottomSheetBaseProps {
	open: boolean;
	onClose: () => void;
}

interface SettingsBottomSheetProps extends SettingsBottomSheetBaseProps {
	headerIcon: React.ReactElement;
	headerText: string;
	children?: ReactElement<MenuOptionProps> | ReactElement<MenuOptionProps>[];
	modals: ReactElement | ReactElement[];
}

const SettingsBottomSheet = ({
	open,
	onClose,
	headerIcon: HeaderIcon,
	headerText,
	children,
	modals,
}: SettingsBottomSheetProps) => {
	const bottomSheetRef = useRef<BottomSheet>(null);

	const snapPoints = useMemo(() => ["50%"], []);

	const animationConfigs = useBottomSheetSpringConfigs({
		damping: 80,
		overshootClamping: true,
		restDisplacementThreshold: 0.1,
		restSpeedThreshold: 0.1,
		stiffness: 400,
	});

	useEffect(() => {
		if (open) {
			bottomSheetRef.current?.close();
			onClose();
		} else {
			bottomSheetRef.current?.expand();
		}
	}, [open]);

	const renderBackdrop = useCallback(
		(props) => (
			<BottomSheetBackdrop
				{...props}
				disappearsOnIndex={-1}
				appearsOnIndex={0}
				opacity={0.2}
			/>
		),
		[]
	);

	return (
		<>
			<Portal>
				<BottomSheet
					ref={bottomSheetRef}
					index={-1}
					snapPoints={snapPoints}
					enablePanDownToClose
					backdropComponent={renderBackdrop}
					animationConfigs={animationConfigs}
				>
					<View style={styles.content}>
						<View style={styles.header}>
							{HeaderIcon}
							<Text style={styles.title}>{headerText}</Text>
						</View>
						<Divider />
						{children}
					</View>
				</BottomSheet>
			</Portal>
			{modals}
			<PortalHost name="settingsBottomSheet" />
		</>
	);
};

const styles = StyleSheet.create({
	content: {},
	header: {
		display: "flex",
		flexDirection: "row",
		alignItems: "center",
		marginTop: -10,
		paddingVertical: 15,
		paddingHorizontal: 20,
	},
	title: {
		fontSize: 18,
		fontWeight: "bold",
		marginLeft: 10,
	},
});

export default SettingsBottomSheet;
