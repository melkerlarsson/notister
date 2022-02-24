import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator, NativeStackScreenProps } from "@react-navigation/native-stack";
import { NotesScreen } from "../screens";

export type NotesStackaramList = {
  Notes: { folderId: string, folderName: string } | undefined;
};

export type NotesScreenNavigationProps = NativeStackScreenProps<
  NotesStackaramList,
  "Notes"
>;

export const Stack = createNativeStackNavigator<NotesStackaramList>();

const NotesStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: true, }}>
      <Stack.Screen name="Notes" component={NotesScreen} />
    </Stack.Navigator>
  );
};


export default NotesStack;