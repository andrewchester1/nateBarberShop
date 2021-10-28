import firestore from '@react-native-firebase/firestore';

export default class FirestoreDeleteDocUtil {
    public static deleteDoc = async (collection, user_id) => {  
        
        return firestore()
        .collection(collection)
        .doc(user_id)
        .delete()
        .then(() => {
            console.log('User deleted!');
        });
    }
}