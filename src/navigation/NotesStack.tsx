import React from "react";
import {
	createNativeStackNavigator,
	NativeStackScreenProps,
} from "@react-navigation/native-stack";
import { NotesScreen } from "../screens";
import { HEADER_BACKGROUND_COLOR } from "../theme/colors";

export type NotesStackaramList = {
	Notes: { folderId: string; folderName: string } | undefined;
};

export type NotesScreenNavigationProps = NativeStackScreenProps<
	NotesStackaramList,
	"Notes"
>;

export const Stack = createNativeStackNavigator<NotesStackaramList>();

const NotesStack = () => {
	return (
		<Stack.Navigator
			screenOptions={{
				headerShown: true,
				headerStyle: {
					backgroundColor: HEADER_BACKGROUND_COLOR,
				},
				headerTintColor: "#000",
				headerTitleStyle: {
					fontWeight: "bold",
					fontSize: 20,
				},
				contentStyle: { backgroundColor: "#fff" },
			}}
		>
			<Stack.Screen name="Notes" component={NotesScreen} />
		</Stack.Navigator>
	);
};

export default NotesStack;
