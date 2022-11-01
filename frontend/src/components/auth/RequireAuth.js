import { onAuthStateChanged } from 'firebase/auth';
import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { auth } from '../../firebase';
import { AuthContext } from '../context/AuthContext';



export default ({ children }) => {

    

    
    const user = auth.currentUser // gets currently signed in user, if no user signed in, currentUser is null
    // console.log(user); // if logged out is true
    // use user in production, use currentUser for dev so u dont relog in over and over

    // const loggedIn = window.localStorage.setItem('isLoggedIn', true)
    // loggedIn && console.log('you have a local storage log in')

    // onAuthStateChanged(auth, user => {
    //     if (user) {
    //         // console.log('user auth object', user)
            
    //     } else {
    //         // console.log('no user');

    //     }
    // })

    const currentUser = useContext(AuthContext); // this is supposed to set currentUser to null on logout, and it is, but somehow,
                                                 // am unable to read the value as null, so using google
    
    // if (user) {
    //     return children
    // } else {
    //     return <Navigate to="/login" />
    // }



    return user ? children : <Navigate to="/" />
    
}