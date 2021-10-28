import React, { useState } from 'react'
import { StyleSheet, View, TextInput, Button, Text } from 'react-native'
import FirebaseUtil from '../../utils/FirebaseUtil';
import {useForm, Controller} from 'react-hook-form'

const LoginScreen = () => {

    const {
        control, 
        handleSubmit, 
        formState: {errors, isValid}
      } = useForm({mode: 'onBlur'})

    const signUp = data => {FirebaseUtil.signUp(data.email, data.password, data.phone, data.name, data.referral).catch((e) => {
        alert('Something went wrong')
    })};
    return(
        <View style={styles.container}>
            {errors.name && <Text>Name is Required</Text>}
            <Controller
                control={control}
                rules={{
                required: true,
                }}
                render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
                style={styles.textInput}
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                placeholder="Full Name"
            />
            )}
                name="name"
                defaultValue=""
            />

            {errors.email && <Text>Email is Required</Text>}
            <Controller
                control={control}
                rules={{
                required: true,
                }}
                render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
                style={styles.textInput}
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                placeholder="Email"
            />
            )}
                name="email"
                defaultValue=""
            />

            {errors.phone && <Text>Phone Number is Required</Text>}
            <Controller
                control={control}
                rules={{
                required: true,
                }}
                render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
                style={styles.textInput}
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                placeholder="Phone Number"
            />
            )}
                name="phone"
                defaultValue=""
            />

            {errors.password && <Text>Password is Required</Text>}
            {errors.confirmPassword && <Text>Passwords do not match</Text>}
            <Controller
                control={control}
                rules={{
                required: true,
                }}
                render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
                style={styles.textInput}
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                placeholder="Password"
                secureTextEntry={true}
            />
            )}
                name="password"
                defaultValue=""
            />

            {errors.confirmPassword && <Text>Passwords do not match</Text>}
            <Controller
                control={control}
                rules={{
                required: true,
                validate: value => value === value.password
                }}
                render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
                style={styles.textInput}
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                placeholder="Confirm Password"
                secureTextEntry={true}
            />
            )}
                name="confirmPassword"
                defaultValue=""
            />

            <Controller
                control={control}
                render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
                style={styles.textInput}
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                placeholder="Referral Optional"
            />
            )}
                name="referral"
                defaultValue=""
            />
            <Button title='Sign Up' onPress={handleSubmit(signUp)}/>
        </View>
    )
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