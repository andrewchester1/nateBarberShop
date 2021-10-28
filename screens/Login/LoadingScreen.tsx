import React from "react";
import { ActivityIndicator, View, StyleSheet } from "react-native";

const LoadingScreen = () => {
    return(
        <View style={styles.container}>
            <ActivityIndicator color='#000' size='large'/>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      justifyContent: 'center',
    }
  });

export default LoadingScreen