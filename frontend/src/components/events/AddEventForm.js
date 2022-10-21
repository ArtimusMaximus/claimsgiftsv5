import React, { useContext, useState, useEffect } from 'react';
import { doc, setDoc, addDoc, collection, updateDoc, arrayUnion, arrayRemove, Timestamp, serverTimestamp, query, where, getDocs, getDoc, onSnapshot, deleteDoc } from "firebase/firestore"; 
import { AuthContext } from '../context/AuthContext';
import { db } from '../../firebase';
import Events from './Events';
import './addeventform.css';
import Swal from 'sweetalert2';
import { FaEnvelopeOpenText } from 'react-icons/fa'
import { TbMailbox } from 'react-icons/tb'
import { getUserEvents } from './firebase_functions/getusers';
import { deleteEg } from './deleteEg';

export default () => {
    const currentUser = useContext(AuthContext)
    const user = currentUser.currentUser.uid
    const userEmail = currentUser.currentUser.email
    const [eventName, setEventName] = useState('')
    const date = new Date(Date.now()).toLocaleString().slice(0, 9)
    const splitDate = date?.split('/')
    const propsDate = (splitDate[2]?.length > 4 ? splitDate[2]?.slice(0, -1) : splitDate[2]) + '-' + (splitDate[0]?.length < 2 ? '0' + splitDate[0] + '-' : splitDate[0] + '-') + (splitDate[1]?.length < 2 ? '0' + splitDate[1] : splitDate[1])
    const [eventDate, setEventDate] = useState(propsDate)
    const [eventOwner, setEventOwner] = useState(userEmail)
    const [eventRef, setEventRef] = useState(user)
    const [didSubmit, setDidSubmit] = useState(false)
    const [eventParticipants, setEventParticipants] = useState([userEmail])
    
    
    
    ///////////invite/////////
    const [eventsData, setEventsData] = useState([])
    const [didInvite, setDidInvite] = useState(false)
    ///////////real time events ////////
    
    
    /////////////check events//////
    const [inviteData, setInviteData] = useState([])
    const [agreedEvent, setAgreedEvent] = useState(false)
    const [participantEventId, setParticipantEventId] = useState([])
    const [appendedInvite, setAppendedInvite] = useState([])

    ///////////////////////////// fetch user events ///////////////////////////
   
    const [docData, setDocData] = useState([])
    const q = query(collection(db, "events"), where("events.eventRef", "==", user)); /* original query */
    const q1 = query(collection(db, "events"), where("eventParticipants", "array-contains", userEmail));
    const queryInvites = query(collection(db, "invites"), where("invitee", "==", userEmail))
    

    useEffect(() => {
        const getUserEvents = async () => {
            let list = [];
            
            try {
                const querySnapshot = await getDocs(q1);
                querySnapshot.forEach((doc) => {
                    list.push({id: doc.id, ...doc.data(), appendedInvite})
                    const d = doc.data()
                    // doc.data() is never undefined for query doc snapshots
                    // console.log(doc.id, " => ", d);
                });
                setDocData(list)

                
            } catch (error) {
                console.log(error)
            }
        }
        getUserEvents()

        const unsubscribe = onSnapshot(queryInvites, querySnapshot => {
            let invites = [];
            querySnapshot.docs.forEach((doc) => {
                invites.push({id: doc.id, ...doc.data()})
                
            });
            setInviteData(invites)
            

        }, error => console.log(error))

        return () => {
            unsubscribe()
        }

    }, [didSubmit])
    
    /////////////////////////////////
  
    const handleSubmit = async e => {
        e.preventDefault();
        if (eventName === '') {
            return Swal.fire({
                title: '<span style="font-style: italic;">You must provide an <span style="text-decoration: underline;">event name!</span></span>',
                confirmButtonColor: 'crimson'
            })
        }
        try {
            const docRef = await addDoc(collection(db, 'events'), {
                events: {
                    eventName: eventName,
                    eventDate: eventDate,
                    eventOwner: eventOwner,
                    eventRef: eventRef,
                },
                eventParticipants,
            });
            console.log(docRef);
            setEventName('')
            setEventDate(propsDate)
            setDidSubmit(true)
        } catch (error) {
            console.log(error);
        }
    }

    const handleInviteClick = async () => {
        const eventNames = docData.map(i => i.events.eventName)

        const { value: event } = await Swal.fire({
            title: 'Please select event to share:',
            confirmButtonColor: 'crimson',
            input: 'select',
            inputOptions: {
                'Events':
                    {...eventNames}
            },
            inputPlaceholder: 'Your events...'
        })
        if(event) {
            const eName = docData[event].events.eventName
            const eDate = docData[event].events.eventDate
            const eventId = docData[event].id
            const { value: inviteeEmail } = await Swal.fire({
                title: `Share event "${eName}" with:`,
                confirmButtonColor: 'crimson',
                input: 'email',
                inputLabel: '',
                inputPlaceholder: 'Invitee\'s email'
            })
            if (inviteeEmail) {
                Swal.fire({
                    title: `Invitation sent to ${inviteeEmail}'s message center.`,
                    confirmButtonColor: 'crimson'
                })
                .then((result) => console.log(result.isConfirmed))
                .then(() => setDidInvite(prev => !prev))
                .then(() => addDoc(collection(db, "invites"), {
                    invitee: inviteeEmail.trim().toLowerCase(),
                    event: eName,
                    invitedBy: userEmail,
                    eventDate: eDate,
                    eventId: eventId,
                }))
                .then((data) => console.log(data))
                .catch((err) => console.log(err))
            }  
        } 
    }
    const handleCheckEventClick = () => {
        console.log(inviteData)
        console.log(docData);

        const filtAcceptedInvites = inviteData.filter(i => !i.acceptedInvite === true)
        
        const mapInvites = filtAcceptedInvites.map(i => (`Event: "${i.event}" | From: "${i.invitedBy}"`))
        if (filtAcceptedInvites.length === 0) return Swal.fire({title: '<b style="font-style: italic">No invites available!</b>', confirmButtonColor: 'crimson'})

        const confirmInvite = async () => {

            const { value: choice } = await Swal.fire({
                title: `Invitations:`,
                input: 'select',
                inputOptions: {
                    'Invitations': {
                        ...mapInvites
                    }
                },
                confirmButtonColor: 'crimson',
                showCancelButton: true,
            })
            if (choice) {
                console.log(choice)
                
                const eventConfirmed = filtAcceptedInvites[choice]
                const eventConfirmedId = filtAcceptedInvites[choice].eventId
                const inviteDocId = filtAcceptedInvites[choice].id
                console.log(filtAcceptedInvites[choice])
                console.log(inviteDocId);
                
                console.log('event confirmed id', eventConfirmedId)

                const fixedDate = eventConfirmed.eventDate.slice(5) + '-' + eventConfirmed.eventDate.slice(0, 4)
                
                Swal.fire({
                    title: `You have been been added to "The List" \nFor event: \n"${eventConfirmed.event}" \n${fixedDate}`,
                    confirmButtonColor: 'crimson'
                })
                .then((result) => console.log(result.isConfirmed))
                // .then(() => setAgreedEvent(true))
                .then(() => updateDoc(doc(db, 'invites', inviteDocId),
                { acceptedInvite: true }
                ))
                .catch((err) => console.log(err))

                const addMeToEvent = async () => {
                    let list = []
                    const docRef = doc(db, "events", eventConfirmedId)
                    const docSnap = await getDoc(docRef)
                    if (docSnap.exists()) {
                        console.log('docSnap .data()', docSnap.data())
                        list.push(docSnap.data().eventParticipants)
                        setEventParticipants(prev => prev, ...list)
                    } else {
                        console.log('no such doc!');
                    }
                    console.log(list)
                }
                addMeToEvent()

                const updateEventPartici = async () => {
                    const updatedParticiRef = doc(db, "events", eventConfirmedId)
                    await updateDoc(updatedParticiRef, {
                        eventParticipants: arrayUnion(...eventParticipants)
                    })
                }
                updateEventPartici()

                const getSingleDoc = async () => {
                    let arr = [];
                    const singleDocRef = doc(db, "events", eventConfirmedId)
                    const docSnap = await getDoc(singleDocRef)
                    if (docSnap.exists()) {
                        console.log(docSnap.data())
                        arr.push({id: docSnap.id, ...docSnap.data()})
                        setAppendedInvite(docSnap.data())
                        setDocData(prev => [...prev, {id: docSnap.id, ...docSnap.data()}])
                    }
                }
                getSingleDoc()
            }
        }
        confirmInvite()
    }

    const handleRemoveEvent = async (e) => {
        e.preventDefault()
        const userOwnedEvents = docData.filter(i => i.events.eventOwner === userEmail)
        const eventsToRemove = userOwnedEvents.map(i => i.events.eventName)
        const eventsToRemoveId = userOwnedEvents.map(i => i.id)
        console.log(userOwnedEvents.map(i => i));
        
       
        const { value: selection } = await Swal.fire({
            title: `Please select event to remove!`,
            html: 'Note: you can only remove events that <b style="font-style: italic;">you</b> have created...',
            confirmButtonColor: 'crimson',
            input: 'select',
            inputOptions: 
                {...eventsToRemove},
            inputPlaceholder: `Events to remove...`
        })
        if (selection) {
            console.log(selection);
            console.log(eventsToRemove[selection]);
            console.log(eventsToRemoveId[selection]);

            Swal.fire({
                title: 'Removing this event cannot be undone!',
                text: 'Other users that are participating in this event will be affected!',
                icon: 'warning',
                confirmButtonText: 'Yes, Proceed',
                showCancelButton: true,
                cancelButtonColor: 'crimson',
            })
            .then(result => { 
                if (result.isConfirmed) {
                    deleteDoc(doc(db, 'events', eventsToRemoveId[selection]))
                } else if (result.isDenied) {
                    return
                }
            })
            .then(() => setDidSubmit(prev => !prev))
            .catch(err => console.log(err))

        }
    }

    return (
        <>
            <div className="formContainer">
                <form onSubmit={handleSubmit}>
                    <input className="eventNameDate" value={eventName} name="eventname" placeholder='event name' onChange={e => setEventName(e.target.value)} />
                    <input className="eventNameDate" value={eventDate} type="date" name="eventdate" placeholder='event date' onChange={e => setEventDate(e.target.value)} />
                    <div style={{display: 'flex', justifyContent: 'center'}}>
                        <button type="submit" className='addEvent btnInvert' onClick={() => setDidSubmit(false)}>Add Event</button>
                        <button type="button" name='removeBtn' onClick={e => handleRemoveEvent(e)} className='removeEvent btnInvert'>Remove Event</button>
                    </div>
                    <div>
                    <div style={{textAlign: 'right', marginRight: '25vw'}}>Check Event Invites &nbsp;<a onClick={handleCheckEventClick}><TbMailbox size={'35px'} color={'#dc143c'} /></a></div>
                        <div style={{textAlign: 'right', marginRight: '25vw'}}>Invite User to attend &nbsp;<a onClick={handleInviteClick}><FaEnvelopeOpenText size={'35px'} color={'#dc143c'} /></a></div>
                    </div>
                </form>
                
            </div>
            
                <Events data={docData}   /> {/* lastly: send event blob here*/} {/* docData was the original */}
            
        </>
    )
}