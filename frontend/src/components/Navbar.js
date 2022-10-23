import React, { useContext, useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import './navbar.css'
import Swal from 'sweetalert2';
import { AuthContext } from './context/AuthContext';
import { db } from '../firebase';
import { collection, getDocs, where, query, DocumentSnapshot, addDoc } from "firebase/firestore";
import { IoMdLogOut } from 'react-icons/io'
import { HiOutlineLogin } from 'react-icons/hi';


 // me-auto nav classname
export default () => {
    const currentUser = useContext(AuthContext)
    const user = currentUser.currentUser
    const location = useLocation();
    let navigate = useNavigate()

    

    return (
        <>
           <div className='navbar'>
                <div className='navtainer'>
                <span className='navbarlinks'><Link to={location.pathname === '/departure' ? "/" : "#"} style={{textDecoration: 'none', color: 'White'}}><h3>Claims Gifts</h3><h5>Alpha</h5></Link></span>
                {location.pathname !== '/dashboard' && user && <Link to="/dashboard" className='navbarlinks'>Dashboard</Link>}
                {location.pathname !== '/signup' && location.pathname !== '/' && location.pathname !== '/departure' && <Link to="/logout" className='navbarlogout'>Logout <IoMdLogOut style={{display: 'inlineFlex', alignItems: 'center'}} size={'20px'} /></Link>}
                {location.pathname === '/departure' && <Link style={{textDecoration: 'none', color: 'White', marginLeft:'25px'}} to={'/'}><h3>Login    <HiOutlineLogin color='white' cursor={'pointer'} /></h3></Link>}
                </div>
            </div>
        </>
    )
}