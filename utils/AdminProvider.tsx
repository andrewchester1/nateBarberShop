import React from 'react';
import { useEffect, useState} from 'react'
import auth from '@react-native-firebase/auth'
import FirestoreUserNameUtil from './FireStoreUserNameUtil';

export default function AdminProvider() { 
    const [admin, setAdmin] = useState(false)

    FirestoreUserNameUtil.getUserName().then((userData) => {
        let tempAdmin = userData.data().admin
        setAdmin(tempAdmin)
    })
    return (admin)
}