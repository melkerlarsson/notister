import { View, Text, StyleSheet } from 'react-native';
import { AuthenticationScreenNavigationProps } from '../../navigation/AuthStack';
import { ResponseType } from "expo-auth-session";
import * as Google from "expo-auth-session/providers/google";
import Button from '../../components/Button';
import { signInWithCredential, signInWithPopup } from 'firebase/auth';
import { useEffect } from 'react';
import { GoogleAuthProvider } from 'firebase/auth/react-native';


interface AuthenticationScreenProps extends AuthenticationScreenNavigationProps {

}

const AuthenticationScreen = ({ navigation }: AuthenticationScreenProps) => {

  return (
    <View style={styles.container}>
      <Text>Get started by signing in below, or creating an account</Text>
      <Button
        style={{ marginTop: 20, marginBottom: 10 }}
        title="Sign In"
        onPress={() => navigation.push("SignIn")}
      />
      <Button title="Sign Up" onPress={() => navigation.push("SignUp")} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    display: "flex",
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default AuthenticationScreen;