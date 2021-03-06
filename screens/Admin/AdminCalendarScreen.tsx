import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, Alert } from 'react-native';
import CalendarStrip from 'react-native-calendar-strip';
import firestore from '@react-native-firebase/firestore'
import moment from 'moment';
import { ListItem } from 'react-native-elements';
import { formatPhoneNumber } from '../../utils/DataFormatting';

const AppointmentScreen = ({ navigation }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [calendarData, setCalendarData] = useState([]);
    const [selectedDate, setSelectedDate] = useState(moment());
    const [formattedDate, setFormattedDate] = useState();
    const [availibility, setAvailibility] = useState({'Tuesday': '', 'Wednesday': '', 'Thursday': '', 'Friday': '', 'Saturday': '', 'goatPoints': ''})

    async function getAvailibility() {
          await firestore().collection('Barber').doc('Nate').get().then((doc) => {
          const databaseAvailibility = {...availibility, ...doc.data()}
          setAvailibility({ ...availibility, ...databaseAvailibility})
      })
  }
  
    const splitHours = async (selectedDate) => {

      const weekDay = Promise.resolve(moment(selectedDate, "YYYY-MM-DD HH:mm:ss").format('dddd').toString())
        Promise.all([weekDay]).then(values => {
            createAvailableTimes(availibility[`${values}`], selectedDate)
          });
  }

    function createAvailableTimes(newWeekDay, selectedDate) {
      let arr = newWeekDay
      const newSplitString = arr.toUpperCase().split("-").map(item => item.trim());
      const startTime = moment(newSplitString[0], 'HH:mm a')
      const endTime = moment(newSplitString[1], 'HH:mm a')
      let newIntervals = []
      while (startTime <= endTime) {
          let newobj = { 'time' : moment(startTime, 'HH:mm a').format("hh:mm A").toString().replace(/^(?:00:)?0?/, '') }
          newIntervals.push(newobj)
          startTime.add(30, 'minutes')
      }
      onGetData(selectedDate, newIntervals)
    }

    async function onGetData(selectedDate, newIntervals) {
      await firestore()
        .collection('Calendar')
        .doc(moment(selectedDate).format('MMM YY'))
        .collection(moment(selectedDate).format('YYYY-MM-DD')).get()
        .then(snapshot => {
            let data = []
            snapshot.forEach(doc => {
              const tempData = doc.data();
              data.push(tempData)
            });
            const calendarTimes = newIntervals.map(obj => data.find(o => o.time === obj.time) || obj)
            const testIntervals = [ ...data, ...newIntervals ]
            setCalendarData( calendarTimes )
            setIsLoading(false)
        })
    }

    useEffect(() => {
        setSelectedDate(moment())
        getAvailibility()
    }, [])
    
      const onDateSelected = selectedDate => {
        setSelectedDate(selectedDate.format('YYYY-MM-DD'));
        setFormattedDate(selectedDate.format('YYYY-MM-DD'));
        setIsLoading(true)
        splitHours(selectedDate)
      }
    
      const deleteAppointment = (deleteTime: any) => {
        firestore().collection('Calendar')
        .doc(moment(selectedDate).format('MMM YY'))
        .collection(moment(selectedDate).format('YYYY-MM-DD')).doc(deleteTime).delete().then(() => {
            Alert.alert('Success', 'Appointment Deleted')
          }).catch((e) => {
              Alert.alert('Error', `Unable to delete appointment. Try again. ${e}`)
          })
      }
    
    return(
        <View style={styles.container}> 
            <View style={{flex: 1}}>
                <CalendarStrip
                scrollable
                style={{height:100, paddingTop: 10, paddingBottom: 10}}
                calendarHeaderStyle={{color: 'white', fontSize: 17}}
                calendarColor={'grey'}
                dateNumberStyle={{color: 'white'}}
                dateNameStyle={{color: 'white'}}
                iconContainer={{flex: 0.1}}
                highlightDateNameStyle={{color: 'white'}}
                highlightDateNumberStyle={{fontWeight: 'bold', color: 'white'}}
                highlightDateContainerStyle={{backgroundColor: 'black'}}
                selectedDate={selectedDate}
                onDateSelected={onDateSelected}
                />
                
            </View>
            <View style={{flex: 5}}>
                <ListItem bottomDivider>
                    <ListItem.Content style={{ alignItems: 'center', marginTop: -5}}>
                        <ListItem.Title> {formattedDate ? formattedDate : 'Choose a date'} </ListItem.Title>
                    </ListItem.Content>
                </ListItem>
                { isLoading ? 
                    <ActivityIndicator size="large" color="#0000ff" />
                  : calendarData &&
                    <ScrollView style={{ borderColor: 'black', borderRadius: 15}}>
                        {
                        calendarData.map((key, index) => (
                            <ListItem key={`${key.name}_${key.phone}_${key.time}_${key.comment}`} bottomDivider 
                            onPress={() => key.name ? Alert.alert('Delete', `Are you sure you want to delete this ${"\n"}Appointment Time ${key.time} ${"\n"} with Client: ${key.name}`, 
                            [
                                {
                                  text: "Cancel"
                                },
                                { text: "Delete Appointment", onPress: () => (deleteAppointment(key.time))}
                              ]) : navigation.navigate('AdminAddAppointmentScreen', { formattedDate, time : [`${key.time}`] })}> 
                              <ListItem.Content>
                                <View style={{flex: 1, flexDirection: 'row'}}>
                                  <View style={{flex: 1}}><ListItem.Title >{key.time}</ListItem.Title></View>
                                    { !key.name ?
                                      <View style={{flex: 2, alignItems: 'flex-end'}}><ListItem.Title>Avaliable</ListItem.Title></View>
                                      : 
                                      <View style={{flex: 2, alignItems: 'flex-end'}}><ListItem.Title>Goat Points: {key.goatPoints ? key.goatPoints : '0'}</ListItem.Title></View>
                                    }
                                </View>
                                <View style={{flex: 1, flexDirection: 'row'}}>
                                    { key.name ?
                                      <>
                                        <View style={{flex: 2}}><ListItem.Subtitle>{key.name}</ListItem.Subtitle></View>
                                        <View style={{flex: 2, alignItems: 'flex-end'}}><ListItem.Subtitle>{formatPhoneNumber(key.phone) ? formatPhoneNumber(key.phone) : key.phone }</ListItem.Subtitle></View>
                                      </>
                                    : null
                                    }
                                </View>
                                { key.comment ?
                                  <ListItem.Subtitle>Comment: {key.comment}</ListItem.Subtitle>
                                  : null
                                }
                              </ListItem.Content>
                            </ListItem>
                            ))
                        }  
                    </ScrollView > 
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
      alignContent: 'center'
    }
  });

export default AppointmentScreen