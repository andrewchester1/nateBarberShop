import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Card, ListItem, PricingCard } from 'react-native-elements'
import moment from 'moment';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore'
import { formatPhoneNumber } from '../../utils/DataFormatting';
import { ScrollView } from 'react-native-gesture-handler';

const HomeScreen = () => {
    const [userTestData, setUserData] = useState({'email': '', 'name': '', 'phone': '', 'previous': '', 'time': '', 'upcoming': '', 'points': ''});
    const [barberData, setBarberData] = useState({'location': '', 'price': '', 'phone': ''})
    const [userAppointments, setUserAppointments] = useState({})

    async function getUserData() {
        const userData = auth().currentUser;
        await firestore().collection('Test').doc(userData.uid).get().then((doc) => {
            setUserData({...userTestData, ...doc.data()})
        })
        await firestore().collection('Barber').doc('Nate').get().then((barber) => {
            setBarberData({...barberData, ...barber.data()})
        })
        await firestore().collection('Test').doc(userData.uid).collection('Haircuts').get()
        .then(snapshot => {
            let data = {}
            snapshot.forEach(doc => {
                let newdata = {
                    [doc.id]: doc.data().time
                }
                data =  {...data, ...newdata}
            });
            setUserAppointments(data)
        })
    }

    useEffect(() => {
        getUserData()
        }, [])

    return(
        <View style={styles.container}>
            <Card containerStyle={{ flex: 1, margin: 0}}>
                <Card.Title style={{ fontSize: 20}}> {userTestData.name} </Card.Title>
                <Card.Title style={{ fontSize: 15}}>Goat Points</Card.Title>
                <Card.Title style={{ fontSize: 15}}>{userTestData.points}</Card.Title>
            </Card>
            <View style={{flex: 3}}>
                { userAppointments ?  
                    <>  
                    <ScrollView>
                        <ListItem bottomDivider >
                            <ListItem.Content>
                                <ListItem.Title style={{ fontWeight: 'bold', alignSelf: 'center' }}><Text>Appointments</Text></ListItem.Title>
                            </ListItem.Content>
                        </ListItem>
                        {Object.entries(userAppointments).map((onekey, i) => (
                            <ListItem bottomDivider>
                                <ListItem.Content>
                                    <View style={{flex: 1, flexDirection: 'row'}}>
                                        <View style={{flex: 2, alignItems: 'flex-start' }}>
                                            <ListItem.Title key={i}>{onekey[0]}, {onekey[1].toString().toLowerCase()}</ListItem.Title>
                                        </View>
                                        <View style={{flex: 1, alignItems: 'flex-end'}}>
                                            <ListItem.Title >{barberData.price != '' ? barberData.price : '' }</ListItem.Title>
                                        </View>
                                    </View>
                                    <View style={{flex: 1, flexDirection: 'row'}}>
                                        <View style={{flex: 1, alignItems: 'flex-start' }}>
                                            <Text>{barberData.location != '' ? barberData.location : ''} </Text>
                                        </View>
                                        <View style={{flex: 1, alignItems: 'flex-end'}}>
                                            <Text>{barberData.phone != '' ? formatPhoneNumber(barberData.phone) : ''} </Text>
                                        </View>
                                    </View>
                                </ListItem.Content>
                            </ListItem>
                        ))}
                    </ScrollView>
                    </>
                :
                <ListItem bottomDivider >
                    <ListItem.Content>
                        <ListItem.Title style={{ fontWeight: 'bold' }}><Text>No Appointments</Text></ListItem.Title>
                    </ListItem.Content>
                </ListItem>
                }
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      justifyContent: 'center',
      alignContent: 'center',
    }
  });

export default HomeScreen
