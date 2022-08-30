import React, { useEffect } from 'react';
import { BsExclamationLg } from 'react-icons/bs'
import { BsArrowReturnLeft } from 'react-icons/bs'
import { Link, useNavigate } from 'react-router-dom';
import { RiDashboardFill } from 'react-icons/ri'
import { MdOutlineDashboard } from 'react-icons/md'
import './redirectpage.css'

export default () => {
    const navigate = useNavigate()

    const takeMeBack = () => {
        navigate('/dashboard', {replace:true})
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
            <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}><PrevPage /></div>
            <h3 style={{textAlign: 'center'}}>Go back one page</h3>
            <hr />
            <div style={{textAlign:'center'}}><MdOutlineDashboard className='dash' onClick={takeMeBack} size={'200px'} color={'pink'} /><h3>Go back to your dashboard</h3></div>
            
        </>
    )
}