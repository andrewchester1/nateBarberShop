import React, { useContext, useState } from "react";
import { createStackNavigator  } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native'
import { LoginContext } from "./utils/LoginProvider";
import LoadingScreen from "./screens/Login/LoadingScreen";
import LoginScreen from "./screens/Login/LoginScreen";
import HomeScreen from "./screens/Client/HomeScreen";
import AppointmentScreen from "./screens/Client/AppointmentScreen";
import AboutScreen from "./screens/Client/AboutScreen";
import SettingsScreen from "./screens/Client/SettingsScreen";
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FirestoreUserNameUtil from "./utils/FireStoreUserNameUtil";
import AdminScreen from "./screens/Admin/AdminSettingScreen";
import EditAccountScreen from "./screens/Admin/AdminEditAccountScreen";
import AdminCalendarScreen from "./screens/Admin/AdminCalendarScreen";
import AdminAddAppointmentScreen from "./screens/Admin/AdminAddAppointmentScreen"
import AdminEditProfileScreen from "./screens/Admin/AdminEditProfileScreen";
import AdminProvider from "./utils/AdminProvider";
import AdminAddPoints from "./screens/Admin/AdminAddPoints";
import { View, Button, Text } from "react-native";
import SignUpScreen from "./screens/Login/SignUpScreen";
import ForgotPasswordScreen from "./screens/Login/ForgotPasswordScreen";

const Tab = createBottomTabNavigator()

const AdminCalendarStack = createStackNavigator();

function AdminCalendarStackScreen({ navigation }) {
    return (
        <AdminCalendarStack.Navigator>
            <AdminCalendarStack.Screen name="Admin Calendar" 
            component={AdminCalendarScreen} 
            options={{ title: 'Calendar', headerTitleAlign: 'center', headerRight: () => (
                <Button
                  onPress={() => navigation.navigate('AdminAddAppointmentScreen')}
                  title="Add"
                  color="black"
                />
              ),}}/>
            <AdminCalendarStack.Screen name="AdminAddAppointmentScreen" options={{ title: 'Add Appointments', headerTitleAlign: 'center' }} component={AdminAddAppointmentScreen} />
        </AdminCalendarStack.Navigator>
    )
}

const AdminSettingsStack = createStackNavigator();

function AdminSettingsStackScreen() {
    return (
        <AdminSettingsStack.Navigator>
            <AdminSettingsStack.Screen name="Admin Settings" options={{ headerStyle:{backgroundColor: 'grey'}, headerTintColor: 'white', title: 'Admin Settings', headerTitleAlign: 'center' }} component={AdminScreen}/>
            <AdminSettingsStack.Screen name="EditAccountScreen" options={{ title: 'Edit Accounts', headerTitleAlign: 'center' }} component={EditAccountScreen} />
            <AdminSettingsStack.Screen name="Points" options={{ title: 'Points', headerTitleAlign: 'center' }} component={AdminAddPoints} />
        </AdminSettingsStack.Navigator>
    )
}

const AdminAboutStack = createStackNavigator();

function AdminAdminStackScreen({ navigation }) {
    return (
        <AdminAboutStack.Navigator
        screenOptions={{
            headerStyle:{backgroundColor: '#080808'},
            headerTintColor: 'white',
            headerTitleAlign: 'center'
        }}>
            <AdminAboutStack.Screen name="Nate" options={{ title: 'Nate',
                headerRight: () => (
                    <Button
                    onPress={() => navigation.navigate('Edit Profile')}
                    title="Edit"
                    color="#080808"
                    />
                ),}} component={AboutScreen}/>
            <AdminAboutStack.Screen name="Edit Profile" options={{ title: 'Edit Profile', headerTitleAlign: 'center' }} component={AdminEditProfileScreen}/>
        </AdminAboutStack.Navigator>
    )
}

const LoginSreenStack = createStackNavigator();

function LoginStackScreen({ navigation }) {
    return (
        <LoginSreenStack.Navigator>
            <LoginSreenStack.Screen name="Sign In" options={{ title: 'Sign In', headerTitleAlign: 'center',
                headerRight: () => (
                    <Button
                    onPress={() => navigation.navigate('Sign Up')}
                    title="Sign Up"
                    color="black"
                    />
                ),}} component={LoginScreen}/>
            <LoginSreenStack.Screen name="Sign Up" options={{ title: 'Create Account', headerTitleAlign: 'center' }} component={SignUpScreen}/>
            <LoginSreenStack.Screen name="Forgot Password" options={{ title: 'Forgot Password', headerTitleAlign: 'center' }} component={ForgotPasswordScreen}/>
        </LoginSreenStack.Navigator>
    )
}
function MainStackNavigator() {
    return (
        <Tab.Navigator>
            <Tab.Screen name='Home' options={{ title: 'Home', headerTitleAlign: 'center' }} component={HomeScreen} />
            <Tab.Screen name='Appointment' options={{ title: 'Appointment', headerTitleAlign: 'center' }} component={AppointmentScreen} />
            <Tab.Screen name='About' options={{ title: 'Nate', headerTitleAlign: 'center' }} component={AboutScreen} />
            <Tab.Screen name='Settings' options={{ title: 'Settings', headerTitleAlign: 'center' }} component={SettingsScreen} />
        </Tab.Navigator>
    )
}

function MainAdminStackNavigator() {
    return (
        <Tab.Navigator 
        screenOptions={{
            tabBarStyle: {
            backgroundColor: '#080808',
            //backgroundColor: 'transparent',
            position:'absolute',
            bottom:0,
            elevation:0
            },
            headerShown: false,
            tabBarActiveTintColor: 'white',
            tabBarInactiveTintColor: 'white'
        }}>
                <Tab.Screen name='About' component={AdminAdminStackScreen} />
                <Tab.Screen name='Calendar' component={AdminCalendarStackScreen} />
                <Tab.Screen name='Admin' component={AdminSettingsStackScreen} />
        </Tab.Navigator>
    )
}


const Stack = createStackNavigator();

export default function AppStack() {
    const { user, isLoading } = useContext(LoginContext);
    let admin = AdminProvider()
    return (
        <NavigationContainer>
            <Stack.Navigator>
                {isLoading ? ( 
                    <Stack.Screen name="loading" options={{ headerShown: false}} component={LoadingScreen}/> 
                ): user && admin == true ? (
                    <><Stack.Screen name="MainAdminStackNavigator" options={{ headerShown: false }} component={MainAdminStackNavigator} />
                    <Stack.Screen
                            name="EditAccountScreen"
                            component={EditAccountScreen} />
                    <Stack.Screen name='AdminEditProfileScreen' component={AdminEditProfileScreen} /></>
                ): user && admin != true ? (
                    <Stack.Screen name="MainStackNavigator" options={{ headerShown: false }} component={MainStackNavigator} />
                ) : (
                    <Stack.Screen name="Sign In" options={{ headerShown: false }} component={LoginStackScreen}/>
                )}
            </Stack.Navigator>
        </NavigationContainer>
    )
}
