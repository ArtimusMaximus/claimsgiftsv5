import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from './context/AuthContext';
import AddEventForm from '../components/events/AddEventForm';
import { collection, query, where, getDocs, getDoc, doc } from "firebase/firestore";
import { db } from '../firebase';
import EditProfile from './profile/EditProfile';
import './dashboard.css';
import './swalstyles.css';



export default () => {
    const currentUser = useContext(AuthContext)
    const user = currentUser.currentUser
    const [userData, setUserData] = useState('')

    

    const q = query(collection(db, "invites"), where("invitee", "==", user.email))

    let userRef = doc(db, 'users', user.uid)
    useEffect(() => {

        const getUserInfo = async () => {
            const docSnap = await getDoc(userRef)

            if (docSnap.exists()) {
                setUserData(docSnap.data())
            } else {
                return
            }
        }
        getUserInfo();

    }, [])


    return (
        <>  
            <div className='dashboardTainer'>
                <h2 style={{textAlign: 'center', marginBottom: '10px', marginTop:'10px'}}>Welcome to your dashboard <br /></h2>
                <div style={{display:'flex', alignItems:'center', justifyContent:'center'}}>
                    <EditProfile currentUser={currentUser} userData={userData} />
                </div>
                <AddEventForm />
            </div>
            
        </>
    )
}