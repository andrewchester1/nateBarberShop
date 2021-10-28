import firestore from '@react-native-firebase/firestore';

export default class FirestoreBarberInfoUtil {
    public static getBarberInfo = async () => {  
        const testData = await firestore().collection('Barber').doc('Nate').get();
        return testData
    }
}