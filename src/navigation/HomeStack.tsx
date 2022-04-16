import { NavigationContainer, RouteProp } from "@react-navigation/native";
import { BottomTabNavigationOptions, BottomTabScreenProps, createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { SettingsScreen, StudyScreen } from "../screens";
import { Ionicons } from "@expo/vector-icons";
import NotesStack from "./NotesStack";
import { HEADER_BACKGROUND_COLOR } from "../theme/colors";

type TabParamBase = {
	Settings: undefined;
	NotesTab: { folders: SubFolder[] | null | undefined; folderName: string } | undefined;
	Study: undefined;
};

export const Tab = createBottomTabNavigator<TabParamBase>();

export type NotesTabScreenProps = BottomTabScreenProps<TabParamBase, "NotesTab">;

export const TAB_BAR_HEIGHT = 70;

const HomeStack = () => {
	const screenOptions = (route: RouteProp<TabParamBase, keyof TabParamBase>): BottomTabNavigationOptions => {
		return {
			tabBarShowLabel: true,
			tabBarStyle: {
				height: TAB_BAR_HEIGHT,
				justifyContent: "center",
				alignItems: "center",
				paddingBottom: 10,
				backgroundColor: "#ffffff",
				// borderTopLeftRadius: 15,
				// borderTopRightRadius: 15,
			},
			tabBarIcon: ({ focused, color, size }) => {
				let iconname: keyof typeof Ionicons.glyphMap;

				switch (route.name) {
					case "NotesTab":
						iconname = focused ? "folder" : "folder-outline";
						break;
					case "Settings":
						iconname = focused ? "md-settings" : "md-settings-outline";
						break;
					case "Study":
						iconname = focused ? "book" : "book-outline";
						break;
				}

				return <Ionicons name={iconname} size={size} color={color} />;
			},
			headerStyle: {
				backgroundColor: HEADER_BACKGROUND_COLOR,
			},
			headerTintColor: "#000",
			headerTitleStyle: {
				fontWeight: "bold",
				fontSize: 20,
			},
			lazy: route.name !== "NotesTab",
		};
	};

	return (
		<NavigationContainer>
			<Tab.Navigator initialRouteName="Study" screenOptions={({ route }) => screenOptions(route)}>
				<Tab.Screen name="NotesTab" component={NotesStack} options={{ headerShown: false }} />
				<Tab.Screen name="Study" component={StudyScreen} />
				<Tab.Screen name="Settings" component={SettingsScreen} />
			</Tab.Navigator>
		</NavigationContainer>
	);
};

export default HomeStack;
