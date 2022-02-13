import { GestureHandlerRootView } from "react-native-gesture-handler";
import { StyleSheet, Text, View } from "react-native";

import { useEffect, useState } from "react";
import { auth, collections } from "./src/firebase/config";
import { addDoc, getDocs } from "firebase/firestore";

import { Provider } from "react-redux";
import store from "./src/redux/store";

import Routes from './src/navigation/Routes';

export default function App() {

  return (
    <GestureHandlerRootView style={styles.container}>
      <Provider store={store}>
        <Routes />
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
