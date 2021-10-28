import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth'

export default class FirestoreUpcomingAppointmentsUtil {
    public static getAppointmentInfo = async () => {  
        const userData = auth().currentUser;
        const appointmentData = await firestore().collection("Test").doc(userData.uid).get();
        return appointmentData
    }
}