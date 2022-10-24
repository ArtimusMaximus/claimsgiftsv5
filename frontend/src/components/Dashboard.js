import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from './context/AuthContext';
import AddEventForm from '../components/events/AddEventForm';
import { getDoc, doc } from "firebase/firestore";
import { auth, db } from '../firebase';
import EditProfile from './profile/EditProfile';
import './dashboard.css';
import './swalstyles.css';




export default () => {
    const user = auth.currentUser
    const currentUser = useContext(AuthContext)
    // const user = currentUser.currentUser

    
    
   


    const [userData, setUserData] = useState('')
    

    let userRef = doc(db, 'users', user.uid)
    useEffect(() => {

        

        const getUserInfo = async () => {
            const docSnap = await getDoc(userRef)

            if (docSnap.exists()) {
                setUserData(docSnap.data())
                console.log('user data', docSnap.data());
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
                    <EditProfile currentUser={user} userData={userData} />
                    
                </div>
                <AddEventForm />
            </div>
            
        </>
    )
}