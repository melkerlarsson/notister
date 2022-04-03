import {
	createNativeStackNavigator,
	NativeStackScreenProps,
} from "@react-navigation/native-stack";
import { NotesScreen } from "../screens";
import ImageViewer from "../screens/NotesScreen/components/ImageViewer/ImageViewer";

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
				contentStyle: { backgroundColor: "#fff" },
			}}
		>
			<Stack.Screen name="Notes" component={NotesScreen} />
		</Stack.Navigator>
	);
};

export default NotesStack;
