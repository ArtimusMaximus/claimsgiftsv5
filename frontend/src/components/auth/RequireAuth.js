import { getAuth } from 'firebase/auth';
import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';



export default ({ children }) => {

    const auth = getAuth(); // 
    const user = auth.currentUser // gets currently signed in user, if no user signed in, currentUser is null
    // console.log(user === null); // if logged out is true
    // use user in production, use currentUser for dev so u dont relog in over and over

    const currentUser = useContext(AuthContext); // this is supposed to set currentUser to null on logout, and it is, but somehow,
                                                 // am unable to read the value as null, so using google

    return currentUser ? children : <Navigate to="/" />
}