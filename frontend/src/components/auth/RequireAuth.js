import { getAuth } from 'firebase/auth';
import React, { useContext } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';



export default ({ children }) => {

    const auth = getAuth(); // 
    const user = auth.currentUser // gets currently signed in user, if no user signed in, currentUser is null

    const currentUser = useContext(AuthContext);

    return user ? children : <Navigate to="/" />
}