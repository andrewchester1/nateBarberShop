import React, { useState } from 'react'
import { StyleSheet, View, TextInput, Button, Text } from 'react-native'
//import firebase from 'firebase'
import { initializeApp } from 'firebase/app';
import { getAuth, onAuthStateChanged, FacebookAuthProvider, signInWithCredential } from 'firebase/auth';

const ForgotPasswordScreen = ({ navigation }) => {
    const [email, setEmail] = useState('');

    // const forgotPassword = () => {
    //     firebase.auth().sendPasswordResetEmail(email)
    //       .then(function (user) {
    //         alert('Please check your email...')
    //       }).catch(function (e) {
    //         console.log(e)
    //       })
    //   }

    return (
        <View style={styles.container}>
            <TextInput 
                placeholder="Email"
                onChangeText={setEmail}
                value={email}
                style={styles.textInput} 
            />   
            <Button title='Send' onPress={() => "forgotPassword()"} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      backgroundColor: '#fff',
      padding: 20,
    },
    textInput: {
        borderWidth: 1,
        borderColor: 'grey',
        padding: 10,
        marginBottom: 20,
        borderRadius: 5,
    },
    text: {
        color: 'blue',
        marginTop: 20,
    },
  });

  export default ForgotPasswordScreen;