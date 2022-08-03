import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './navbar.css'
import Swal from 'sweetalert2';
import { eventData } from './events/data'
import { AuthContext } from './context/AuthContext';
import { db } from '../firebase';
import { collection, getDocs, where, query, DocumentSnapshot, addDoc } from "firebase/firestore";

 // me-auto nav classname
export default () => {
    const currentUser = useContext(AuthContext)
    const user = currentUser.currentUser
    const userId = currentUser.currentUser.uid
    const [didInvite, setDidInvite] = useState(false)
    const [eventsData, setEventsData] = useState([])
    const [clicked, setClicked] = useState(false)

    
    
    
    const q = query(collection(db, "events"), where("events.eventRef", "==", userId))

    // useEffect(() => {
    //     const getUsersEvents = async () => {
    //         let list = [];
    //         try {
    //             const querySnapshot = await getDocs(q)

    //             querySnapshot.forEach((doc) => {
    //                 console.log(doc.id, " =>", doc.data());
    //                 list.push({id: doc.id, ...doc.data()})
    //             })
    //             setEventsData([...list])
    //         } catch (error) {
    //             console.log(error)
    //         }
    //         console.log(eventsData);
            
    //     }
    //     getUsersEvents()
    //     console.log('navbar loaded');
    // }, [didInvite])

    // console.log('navbar', eventsData);

    // const eventNames = eventsData.map(i => i.events.eventName)
 
    // const handleClick = async () => {
    //     setClicked(clicked => !clicked)
    //     const { value: event } = await Swal.fire({
    //         title: 'Please select event to share:',
    //         confirmButtonColor: 'pink',
    //         input: 'select',
    //         inputOptions: {
    //             'Events':
    //                 {...eventNames}
    //         },
    //         inputPlaceholder: 'Your events...'
    //     })
    //     if(event) {
    //         const eventName = eventsData[event].events.eventName
    //         const eventDate = eventsData[event].events.eventDate
    //         const eventId = eventsData[event].id
    //         const { value: userEmail } = await Swal.fire({
    //             title: `Share event "${eventName}" with:`,
    //             confirmButtonColor: 'pink',
    //             input: 'email',
    //             inputLabel: '',
    //             inputPlaceholder: 'Invitee\'s email'
    //         })
    //         if (userEmail) {
    //             Swal.fire({
    //                 title: `Invitation sent to ${userEmail}'s message center.`,
    //                 confirmButtonColor: 'pink'
    //             })
    //             .then((result) => console.log(result.isConfirmed))
    //             .then(() => setDidInvite(prev => !prev))
    //             .then(() => addDoc(collection(db, "invites"), {
    //                 invitee: userEmail,
    //                 event: eventName,
    //                 invitedBy: user.email,
    //                 eventDate: eventDate,
    //                 eventId: eventId
    //             }))
    //             .then((data) => console.log(data))
    //             .catch((err) => console.log(err))
    //         }

    //         console.log(event)
    //         console.log(eventsData[event].events)
    //     } 
    // }

    return (
        <>
           <div className='' style={{background: 'pink', height: '15vh', display: 'flex', alignItems:'center', justifyContent: 'center', width: '100vw', overflow: 'hidden'}}>
                <Link to="/" style={{textDecoration: 'none', color: 'White'}}><h3>Claims Gifts</h3><h5>Beta</h5></Link>
                <Link to="/dashboard" className='navbarlinks'>Dashboard</Link>
                
                <Link to="/logout" className='navbarlinks'>Logout</Link>
            </div>
        </>
    )
}