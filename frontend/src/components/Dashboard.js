import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from './context/AuthContext';
import AddEventForm from '../components/events/AddEventForm';
import { getDoc, doc } from "firebase/firestore";
import { auth, db } from '../firebase';
import EditProfile from './profile/EditProfile';
import './dashboard.css';
import './swalstyles.css';
import { GiCheckMark } from 'react-icons/gi';
import { sendEmailVerification } from 'firebase/auth';
import Swal from 'sweetalert2';





export default () => {
    const user = auth.currentUser // production
    const currentUser = useContext(AuthContext)
    
    // const user = currentUser.currentUser

    const [userData, setUserData] = useState('')
    

    let userRef = doc(db, 'users', user.uid)
    useEffect(() => {

        const getUserInfo = async () => {
            const docSnap = await getDoc(userRef)

            if (docSnap.exists()) {
                setUserData(docSnap.data())
                // console.log('user data', docSnap.data());
            } else {
                return
            }
        }
        getUserInfo();

        user.emailVerified === false && Swal.fire({
            title:'Before you can add events and gifts you must verify your email!',
            confirmButtonColor: 'pink',
            
        })

    }, [])

    // let actionCodeSettings = {
    //     url: 'https://claims.gifts/dashboard',
    //     handleCodeInApp: false,
    // }

    const verifyEmail = async () => {
            try {
                await sendEmailVerification(auth.currentUser)
                    .then(() => {
                        Swal.fire({
                            title: 'Your verification email has been sent!',
                            text: 'Please check your spam folder.',
                            confirmButtonColor:'crimson'
                        })
                    })
            } catch(e) {
                console.log(e);
            }
    }
    
    


    return (
        <>  
            <div className='dashboardTainer'>
                <h2 style={{textAlign: 'center', marginBottom: '10px', marginTop:'10px'}}>Welcome to your dashboard <br /></h2>
                <div style={{display:'flex', alignItems:'center', justifyContent:'center'}}>
                    <EditProfile currentUser={user} userData={userData} />
                </div>
                <div style={{display:'flex', alignItems:'center', justifyContent:'center'}}>
                    {user.emailVerified === false && <button id="verifyemailBtn" className='btnInvert' onClick={verifyEmail}><GiCheckMark />Send Verification Email</button>}
                </div>
                <AddEventForm />
            </div>
            
        </>
    )
}