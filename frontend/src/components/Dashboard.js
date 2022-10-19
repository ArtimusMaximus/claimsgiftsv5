import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from './context/AuthContext';
import AddEventForm from '../components/events/AddEventForm';
import { TbMailbox } from 'react-icons/tb'
import Swal from 'sweetalert2';
import { collection, query, where, getDocs, getDoc, doc } from "firebase/firestore";
import { db } from '../firebase';
import { GrGift } from 'react-icons/gr'



export default () => {
    const currentUser = useContext(AuthContext)
    const user = currentUser.currentUser
    const [inviteData, setInviteData] = useState([])
    const [agreedEvent, setAgreedEvent] = useState(false)
    const [participantEventId, setParticipantEventId] = useState([])
    
    const q = query(collection(db, "invites"), where("invitee", "==", user.email))

    // useEffect(() => {
        // const checkInvites = async () => {
        //     let list = [];
        //     try {
        //         const querySnapshot = await getDocs(q)
        //         querySnapshot.forEach((doc) => {
        //             // console.log(doc.data())
        //             list.push(doc.data())
        //             setInviteData(prev => [...prev, doc.data()])
        //         })
                
        //     } catch (error) {
        //         console.log(error);
        //     }
        // }
        // checkInvites()
        // const getEventPartici = async () => {
        //     const docRef = doc(db, "events", participantEventId)
        //     const docSnap = await getDoc(docRef)
        //     const list = [];
        //     try {
        //         if (docSnap.exists()) {
        //             // list.push(docSnap.data())
        //             // setEventParticipants(list)
        //             console.log(docSnap.data());
        //         } else {
        //             console.log('no such data!');
        //         }
        //     } catch (error) {
        //         console.log(error)
        //     }
        // }
        // getEventPartici()


    // }, [agreedEvent])

    // const mapInvites = inviteData.map(i => (`Event: "${i.event}" | From: "${i.invitedBy}"`))

    // console.log('inviteData from dashboard ', inviteData);
    // const handleClick = () => {
    //     if (inviteData.length === 0) return Swal.fire({title: 'no invites available', confirmButtonColor: 'pink'})
    //     const confirmInvite = async () => {

    //         const { value: choice } = await Swal.fire({
    //             title: `Invitations:`,
    //             input: 'select',
    //             inputOptions: {
    //                 'Invitations': {
    //                     ...mapInvites
    //                 }
    //             },
    //             confirmButtonColor: 'pink',
    //             showCancelButton: true,
    //         })
    //         if (choice) {
    //             const eventConfirmed = inviteData[choice]
    //             Swal.fire({
    //                 title: `You have been been added to "The List" \nFor event: \n"${eventConfirmed.event} - ${eventConfirmed.eventDate}"`,
    //                 confirmButtonColor: 'pink'
    //             })
    //             .then((result) => console.log(result.isConfirmed))
    //             .then(() => setParticipantEventId(eventConfirmed?.eventId))
    //             .then(() => setAgreedEvent(prev => !prev))
    //             .catch((err) => console.log(err))
    //         }

    //     }
    //     confirmInvite()
    //     console.log(participantEventId);
    // }
    const styles = {
        color: 'crimson',
        height: '50px',
        width: '50px'
    }

    

    return (
        <>  
            <div>
                <h2 style={{textAlign: 'center', marginBottom: '10px'}}>Welcome to your dashboard <br /></h2>
                <div style={{display:'flex', alignItems:'center', justifyContent:'center'}}>
                    <GrGift id="presentIcon" style={{styles}} />
                </div>
                <h3 style={{textAlign: 'center', marginTop: '10px'}}>{currentUser && currentUser.currentUser.email}</h3>
                
                {/* <div style={{textAlign: 'right', marginRight: '25vw'}}>Check Event Invites &nbsp;<a onClick={handleClick}><TbMailbox size={'35px'} color={'pink'} /></a></div> */}
                <AddEventForm />
            </div>
            
        </>
    )
}