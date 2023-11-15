import React from "react";
import { createNativeStackNavigator, NativeStackScreenProps } from "@react-navigation/native-stack";
import { NavigationContainer } from "@react-navigation/native";
import OnboardingScreen from "../screens/auth/OnboardingScreen";
import AuthenticationScreen from "../screens/auth/AuthenticationScreen";
import { SignInScreen, SignUpScreen } from "../screens";

export type AuthStackParamList = {
	Onboarding: undefined;
	Authentication: undefined;
	SignIn: undefined;
	SignUp: undefined;
};

export type OnboardingScreenNavigationProps = NativeStackScreenProps<AuthStackParamList, "Onboarding">;
export type AuthenticationScreenNavigationProps = NativeStackScreenProps<AuthStackParamList, "Authentication">;
export type SignInScreenNavigationProps = NativeStackScreenProps<AuthStackParamList, "SignIn">;
export type SignUpScreenNavigationProps = NativeStackScreenProps<AuthStackParamList, "SignUp">;

export const Stack = createNativeStackNavigator<AuthStackParamList>();

const AuthStack = () => {
	return (
		<NavigationContainer>
			<Stack.Navigator screenOptions={{ headerShown: false, contentStyle: { backgroundColor: "#fff" } }}>
				<Stack.Screen name="Onboarding" component={OnboardingScreen} />
				<Stack.Screen name="Authentication" component={AuthenticationScreen} />
				<Stack.Screen name="SignIn" component={SignInScreen} />
				<Stack.Screen name="SignUp" component={SignUpScreen} />
			</Stack.Navigator>
		</NavigationContainer>
	);
};

export default AuthStack;
