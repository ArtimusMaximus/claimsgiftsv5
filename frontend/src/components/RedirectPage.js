import React from 'react';
import { BsArrowReturnLeft } from 'react-icons/bs'
import { Link, useNavigate } from 'react-router-dom';
import { MdOutlineDashboard } from 'react-icons/md'
import './redirectpage.css'
import { auth } from '../firebase';
import { onAuthStateChanged } from 'firebase/auth';


export default () => {

    const user = auth.currentUser
    const navigate = useNavigate()

    const delay = t => new Promise(resolve => setTimeout(resolve, t))

    const takeMeBack = () => {
        onAuthStateChanged(auth, user => {
            if (user) {
                navigate('/dashboard', {replace:true})
            } else {
                navigate('/', {replace:true})
            }
        })
        
            
        
    }

    const PrevPage = () => {
        return (
            <>
                <a onClick={() => navigate(-1)}><BsArrowReturnLeft size={'100px'} color={'pink'} /></a>
            </>
        )
    }


    return (
        <>
            <h3 className='title' style={{textAlign: 'center'}}>This page does not exist!</h3>
            <div className='exclamation'>!</div>
            <hr />
            <div style={{textAlign:'center'}}><MdOutlineDashboard className='dash' onClick={takeMeBack} size={'200px'} color={'pink'} /><h3>Go back to your dashboard</h3></div>
            <hr />
            {/* <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}><PrevPage /></div>
            <h3 style={{textAlign: 'center'}}>Go back one page</h3> */}
            
        </>
    )
}