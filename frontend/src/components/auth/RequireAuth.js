import React, { useContext } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';



export default ({ children }) => {
    const navigate = useNavigate();
    const currentUser = useContext(AuthContext);
    // console.log(currentUser)

    return currentUser ? children : navigate('/')
}