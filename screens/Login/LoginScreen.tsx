import React, { useState } from 'react'
import { StyleSheet, View, TextInput, Button, Text } from 'react-native'
import FirebaseUtil from '../../utils/FirebaseUtil';
  
const LoginScreen = ({ navigation }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const signIn = () => {FirebaseUtil.signIn(email, password).catch((e) => {
        alert('Email/Password is incorrect')
    })};

    return (
        <View style={styles.container}>
            <TextInput 
                placeholder="Email"
                onChangeText={setEmail}
                value={email}
                style={styles.textInput} 
            />
            <TextInput 
                placeholder="Password"
                onChangeText={setPassword}
                value={password}
                style={styles.textInput} 
                secureTextEntry={true} 
            />
                
            <Button title='Sign In' onPress={() => signIn()} />
            <Button title='Forgot Password?' onPress={() => navigation.navigate('Forgot Password')} />
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

  export default LoginScreen;