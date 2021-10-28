import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth'

export default class FirestoreUserNameUtil {
    public static getUserName = async () => {  
        const userData = auth().currentUser;
        const testData = await firestore().collection("Test").doc
        (userData.uid).get();
        console.log('testData: ', testData)
        return testData
    }
}