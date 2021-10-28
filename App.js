import React from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import AppStack from './AppStack';
import LoginProvider from './utils/LoginProvider';

const firebaseCredentials = Platform.select({
  ios: 'https://invertase.link/firebase-ios',
  android: 'https://invertase.link/firebase-android',
});


export default function App() {
  return (
    <View style={styles.container}>
      <LoginProvider>
        <AppStack />
      </LoginProvider>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000'
  }
});
