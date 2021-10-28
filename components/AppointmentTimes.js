import React, { Component } from 'react';
import { View, Text, ScrollView, Button, ActivityIndicator, TextInput } from 'react-native';
import { Card, ListItem } from 'react-native-elements'
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth'
import CalendarPicker from 'react-native-calendar-picker';
import moment from 'moment';
import FirestoreBarberInfoUtil from '../utils/FirestoreBarberInfoUtil';

class AppointmentTimes extends Component {
    state = {
        time: {},
        final: {},
        showAppointments: false,
        userName: '',
        phone: '',
        newPrevious: '',
        barberInfo: {},
        monSunArray: [],
        intervals: {},
        availibleTime: '',
        comment: ''
    }

    createAvailableTimes = (start, end) => {
        const startTime = moment(start, 'HH:mm a')
        const endTime = moment(end, 'HH:mm a')
        let newIntervals = {}
        while (startTime <= endTime) {
            let newobj = {[moment(startTime, 'HH:mm a').format("hh:mm A").toString().replace(/^(?:00:)?0?/, '')] : '' }
            newIntervals = {...newIntervals, ...newobj}
            startTime.add(30, 'minutes')
        }
        this.setState({intervals: this.state.intervals = newIntervals })
        this.onGetData()
      }

    splitHours = (hours) => {
        const { selectedStartDate } = this.state;
        const weekDay = moment(selectedStartDate, "YYYY-MM-DD HH:mm:ss")
        const newWeekDay = weekDay.format('dddd')
        firestore().collection('Barber').doc('Nate').get().then((doc) => {
            let availibility = doc.get(newWeekDay)
            var arr = availibility.toString().toUpperCase().split("-").map(item => item.trim());
            this.createAvailableTimes(arr[0], arr[1])
        })
    }

    AppoitnmentTime = {
        '11:00 am': '',
        '11:30 am': '',
        '12:00 pm': '',
        '12:30 pm': '',
        '1:00 pm': '',
        '1:30 pm': '',
        '2:00 pm': '',
        '2:30 pm': '',
        '3:00 pm': '',
        '3:30 pm': '',
        '4:00 pm': '',
        '4:30 pm': '',
        '5:00 pm': '',
        '5:30 pm': '',
        '6:00 pm': '',
        '6:30 pm': '',
        '7:00 pm': '',
    }
    constructor(props) {
        super(props);
        this.state = { 
            time : {},
            final: {},
            isLoading: false,
            selectedStartDate: null,
            confirmTime: false,
            selectedTime: null,
            userName: '',
            phone: '',
            newPrevious: '',
            monSunArray: [],
            intervals: {},
            availibleTime: '',
            comment: ''
        };
        this.getBarberInfo()
        this.removeMonSun()
        this.onDateChange = this.onDateChange.bind(this);
    }

    onDateChange(date) {
        this.setState({
          selectedStartDate: date,
          isLoading: false,
          confirmTime: false,
        });
      }
    
    onButtonClick() {
        const { selectedStartDate } = this.state;
        if(selectedStartDate) {
        this.splitHours('11:00 am - 7:00 pm')
        this.setState({
            isLoading: true,
          });
        }
    }

    onTimeClick(value) {
        this.getUserId()
        this.setState({
            isLoading: false,
            confirmTime: true,
            selectedTime: value,
        }); 
    }
    
    onGetData = async () => {
        const { selectedStartDate } = this.state;
        this.state.final = {}
        firestore()
        .collection('Calendar')
        .doc(moment(selectedStartDate).format('MMM YY'))
        .collection(moment(selectedStartDate).format('YYYY-MM-DD')).get()
        .then(snapshot => {
            let data = {}
            snapshot.forEach(doc => {
                let newdata = {[doc.id] : 'Taken'}
                data = { ...data, ...newdata}
            });
            this.setState({ time: data })
            this.setState({ final: {...this.state.intervals, ...this.state.time} })
            this.setState({isLoading:true})
        })
    }

    getBarberInfo = () => {
        FirestoreBarberInfoUtil.getBarberInfo().then((testData) => {
            const barberData = {
                Price: testData.data().price,
                Address: testData.data().location
            };
            this.setState({ barberInfo: barberData})
        });
    };

    getUserId = () => {
    const userData = auth().currentUser;
        firestore().collection("Test").doc(userData.uid).onSnapshot(doc => {
            this.setState({ userName: doc.data().name });
            this.setState({ phone: doc.data().phone}) 
        })
    }

    scheduleAppoint = async (selectedDate, selectedTime) => {
        const newSelectedTime = selectedTime
        const userAppointmentInfo = {
            name: this.state.userName,
            comment: this.state.comment,
            time : selectedTime,
            phone : this.state.phone
        };

        await firestore()
        .collection('Calendar')
        .doc(moment(selectedDate).format('MMM YY'))
        .collection(moment(selectedDate).format('YYYY-MM-DD')).doc(selectedTime)
        .set(userAppointmentInfo, {merge: true})
        .then(() => {
            this.addAppointmentToUser(selectedDate, selectedTime)
            console.log('It worked!!!!!')
            alert(`Thanks ${this.state.userName}, your appointment has been scheduled`)
        }).catch((error) => {
            console.log('Error updating the document: ', error)
            alert('Something went wrong try again')
        }); 
    }

    addAppointmentToUser = async (selectedDate, selectedTime) => {
        const userData = auth().currentUser;
        const oldAppointmentData = await firestore().collection('Test').doc(userData.uid).get()
        this.setState({ newPrevious: oldAppointmentData.get('upcoming') })
        this.addAppointmentDataBase(userData, selectedDate, selectedTime)
    }

    addAppointmentDataBase = async (userData, selectedDate, selectedTime) => {
        const appointmentData = {
            previous: this.state.newPrevious,
            upcoming: selectedDate,
            time: selectedTime,
        };
        await firestore().collection('Test').doc(userData.uid).set( appointmentData, {merge: true})
    }

    removeMonSun = () => {
        let dateArray = []
        let currentDate = moment()
        const stopDate = moment().add(30, 'days');
        while (currentDate <= stopDate) {
            if(moment(currentDate).format('dddd') == 'Sunday' || moment(currentDate).format('dddd') == 'Monday' ) {
                dateArray.push( moment(currentDate).format('YYYY-MM-DD'))
            }
            currentDate = moment(currentDate).add(1, 'days');
        }
        this.setState({ monSunArray: [this.state.monSunArray.push(...dateArray)] })
    }

    handleComment = (text) => {
        this.setState({ comment: text })
    }
    render() {
        const { selectedStartDate, isLoading, final, confirmTime, selectedTime, monSunArray } = this.state;
        const selectedDate = selectedStartDate ? moment(selectedStartDate).format('YYYY-MM-DD').toString() : '';
        const today = moment()
        let minDate = new Date()
        let maxDate = today.add(30, 'day');
        return (
            <><View style={{ flex: 1 }}>
                <CalendarPicker
                    minDate={minDate}
                    maxDate={maxDate}
                    disabledDates={monSunArray}
                    onDateChange={this.onDateChange} />

                <Button onPress={() => this.onButtonClick()} title={`Check Available Times for ${selectedDate}`} />

                { isLoading && selectedStartDate &&
                    <ScrollView style={{ borderColor: 'black', borderRadius: 15}}>
                    {
                    Object.entries(final).map((onekey, i) => (
                        <ListItem key={i} bottomDivider numColumns={2} onPress={() => this.onTimeClick(onekey[0])}>
                            <ListItem.Content>
                                <ListItem.Title>{onekey[1] ? null : onekey[0]}</ListItem.Title>
                            </ListItem.Content>
                        </ListItem>
                        ))
                    }  
                    </ScrollView > 
                }
                { confirmTime ?
                    <Card containerStyle={{ flex: 2, borderRadius: 15 }}>
                        <Card.Title style={{ fontSize: 15 }}>{selectedDate} @ {selectedTime}</Card.Title>
                        <Card.Divider />
                        { Object.entries(this.state.barberInfo).map((onekey, i) => (
                            <Text key={i}>{onekey[0]}: {onekey[1]}</Text>
                            ))
                        }
                        <Text>Total time: ~30 minutes</Text>
                        <TextInput
                            // style={styles.input}
                            onChangeText={this.handleComment}
                            placeholder="Comment"
                        />
                        <Button onPress={() => this.scheduleAppoint(selectedDate, selectedTime)} title='Confirm Appointment' />
                    </Card> : 
                    <View></View>
                }

            </View></>
        )
    }
}

export default AppointmentTimes