import auth from '@react-native-firebase/auth'
import firestore from '@react-native-firebase/firestore'

export default class FirebaseUtil {
    public static signIn = (email: string, password: string) => {
        return auth().signInWithEmailAndPassword(email, password);
    }
    public static signOut = () => {
        return auth().signOut();
    }
    public static signUp = (email: string, password: string, phone: string, name: string, referral: string) => {
        return auth().createUserWithEmailAndPassword(email, password).then(data => {  
            const user = {
                email: email,
                password: password,
                user_id: data.user.uid,
                phone: phone,
                name: name,
                referral: referral,
                points: '0'
            };
            firestore().collection('Test').doc(data.user.uid).set(user);
         })
    }
}