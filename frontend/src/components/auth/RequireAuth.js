import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';


export default ({ children }) => {
    const currentUser = useContext(AuthContext)
    console.log(currentUser)

    return currentUser ? children : <Navigate to="/" />
}