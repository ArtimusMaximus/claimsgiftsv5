import React, { useContext, useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './navbar.css'
import Swal from 'sweetalert2';
import { AuthContext } from './context/AuthContext';
import { db } from '../firebase';
import { collection, getDocs, where, query, DocumentSnapshot, addDoc } from "firebase/firestore";
import { IoMdLogOut } from 'react-icons/io'


 // me-auto nav classname
export default () => {
    const currentUser = useContext(AuthContext)
    const user = currentUser.currentUser
    const location = useLocation();

    return (
        <>
           <div className='navbar'>
                <Link to="/" style={{textDecoration: 'none', color: 'White'}}><h3>Claims Gifts</h3><h5>Alpha</h5></Link>
                {location.pathname !== '/signup' && location.pathname !== '/' && <Link to="/dashboard" className='navbarlinks'>Dashboard</Link>}
                {location.pathname !== '/signup' && location.pathname !== '/' && <Link to="/logout" className='navbarlogout'>Logout <IoMdLogOut style={{display: 'inlineFlex', alignItems: 'center'}} size={'22px'} /></Link>}
            </div>
        </>
    )
}