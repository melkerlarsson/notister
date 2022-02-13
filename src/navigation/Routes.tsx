import { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { Dispatch } from 'redux';
import { auth } from '../firebase/config';
import { RootState } from '../redux/rootReducer';
import { setUser, UserAction } from '../redux/user/userActions';
import { SplashScreen } from '../screens';
import AuthStack from './AuthStack';
import HomeStack from './HomeStack';


interface RoutesProps {

}

const Routes = ({}: RoutesProps) => {

  const [loading, setLoading] = useState(true);
    const dispatch: Dispatch<UserAction> = useDispatch();
    const user = useSelector((state: RootState) => state.userReducer.user);

  useEffect(() => {
    const authObserverUnsubscribe = auth.onAuthStateChanged(
      (user) => {
        dispatch(setUser(user));

        setLoading(false);
      },
      (error) => {
        console.log(error);
        setLoading(false);
      }
    );

    return () => {
      authObserverUnsubscribe();
    };
  }, []);

  if (loading) {
    return <SplashScreen />;
  }

  return <>{user && user.emailVerified ? <HomeStack /> : <AuthStack />}</>;
};

const styles = StyleSheet.create({

});

export default Routes;