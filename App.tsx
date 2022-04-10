import { GestureHandlerRootView } from "react-native-gesture-handler";
import { StyleSheet, LogBox } from "react-native";
import { PortalProvider } from "@gorhom/portal";
import { ToastProvider } from "./src/components/Toast";

import { Provider } from "react-redux";
import store from "./src/redux/store";

import Routes from "./src/navigation/Routes";

LogBox.ignoreLogs(["Setting a timer for a long period"]);

export default function App() {
	return (
		<GestureHandlerRootView style={styles.container}>
			<Provider store={store}>
				<PortalProvider>
					<Routes />
				</PortalProvider>
				<ToastProvider />
			</Provider>
		</GestureHandlerRootView>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#fff",
	},
});
