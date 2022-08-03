import React, { useContext, useState, useEffect } from 'react';
import { doc, setDoc, addDoc, collection, updateDoc, arrayUnion, arrayRemove, Timestamp, serverTimestamp, query, where, getDocs, getDoc } from "firebase/firestore"; 
import { AuthContext } from '../context/AuthContext';
import { db } from '../../firebase';
import Events from './Events';
import './addeventform.css';
import Swal from 'sweetalert2';
import { FaEnvelopeOpenText } from 'react-icons/fa'
import { TbMailbox } from 'react-icons/tb'

export default () => {
    const currentUser = useContext(AuthContext)
    const user = currentUser.currentUser.uid
    const userEmail = currentUser.currentUser.email
    const [eventName, setEventName] = useState('')
    const date = new Date(Date.now()).toLocaleString().slice(0, 9)
    const splitDate = date.split('/')
    const propsDate = (splitDate[2].length > 4 ? splitDate[2].slice(0, -1) : splitDate[2]) + '-' + (splitDate[0].length < 2 ? '0' + splitDate[0] + '-' : splitDate[0] + '-') + (splitDate[1].length < 2 ? '0' + splitDate[1] : splitDate[1])
    const [eventDate, setEventDate] = useState(propsDate)
    const [eventOwner, setEventOwner] = useState(currentUser.currentUser.email)
    const [eventRef, setEventRef] = useState(user)
    const [didSubmit, setDidSubmit] = useState(false)
    const [eventParticipants, setEventParticipants] = useState([currentUser.currentUser.email])
    
    ///////////invite/////////
    const [eventsData, setEventsData] = useState([])
    const [didInvite, setDidInvite] = useState(false)
    /////////////check events//////
    const [inviteData, setInviteData] = useState([])
    const [agreedEvent, setAgreedEvent] = useState(false)
    const [participantEventId, setParticipantEventId] = useState([])

    ///////////////////////////// fetch user events ///////////////////////////
   
    const [docData, setDocData] = useState([])
    const q = query(collection(db, "events"), where("events.eventRef", "==", user));
    const queryInvites = query(collection(db, "invites"), where("invitee", "==", userEmail))

    useEffect(() => {
        const getUserEvents = async () => {
            let list = [];
            try {
                const querySnapshot = await getDocs(q);
                
                querySnapshot.forEach((doc) => {
                    list.push({id: doc.id, ...doc.data()})
                    const d = doc.data()
                    // doc.data() is never undefined for query doc snapshots
                    console.log(doc.id, " => ", d);
                });
                setDocData(list)
                setEventsData([...list])
                
            } catch (error) {
                console.log(error)
            }
        }
        getUserEvents()
        const checkInvites = async () => {
            let list2 = [];
            try {
                const querySnapshot = await getDocs(queryInvites)
                querySnapshot.forEach((doc) => {
                    console.log(doc.data())
                    list2.push(doc.data())
                    setInviteData(prev => [...prev, doc.data()])
                })
                
            } catch (error) {
                console.log(error);
            }
        }
        checkInvites()
    }, [didSubmit])
    /////////////////////////////////
    console.log('docData ', docData);
    console.log('eventsData ', eventsData);
    console.log('invite data ', inviteData);

    const handleSubmit = async e => {
        e.preventDefault();
        
        if (eventName === '') {
            return Swal.fire({
                title: 'You must provide an event name!',
                confirmButtonColor: 'pink'
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
                eventParticipants
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
        const eventNames = eventsData.map(i => i.events.eventName)

        const { value: event } = await Swal.fire({
            title: 'Please select event to share:',
            confirmButtonColor: 'pink',
            input: 'select',
            inputOptions: {
                'Events':
                    {...eventNames}
            },
            inputPlaceholder: 'Your events...'
        })
        if(event) {
            const eName = eventsData[event].events.eventName
            const eDate = eventsData[event].events.eventDate
            const eventId = eventsData[event].id
            const { value: inviteeEmail } = await Swal.fire({
                title: `Share event "${eName}" with:`,
                confirmButtonColor: 'pink',
                input: 'email',
                inputLabel: '',
                inputPlaceholder: 'Invitee\'s email'
            })
            if (inviteeEmail) {
                Swal.fire({
                    title: `Invitation sent to ${inviteeEmail}'s message center.`,
                    confirmButtonColor: 'pink'
                })
                .then((result) => console.log(result.isConfirmed))
                .then(() => setDidInvite(prev => !prev))
                .then(() => addDoc(collection(db, "invites"), {
                    invitee: inviteeEmail,
                    event: eName,
                    invitedBy: userEmail,
                    eventDate: eDate,
                    eventId: eventId
                }))
                .then((data) => console.log(data))
                .catch((err) => console.log(err))
            }

            
        } 
    }
    const handleCheckEventClick = () => {
        const mapInvites = inviteData.map(i => (`Event: "${i.event}" | From: "${i.invitedBy}"`))
        if (inviteData.length === 0) return Swal.fire({title: 'no invites available', confirmButtonColor: 'pink'})
        const confirmInvite = async () => {

            const { value: choice } = await Swal.fire({
                title: `Invitations:`,
                input: 'select',
                inputOptions: {
                    'Invitations': {
                        ...mapInvites
                    }
                },
                confirmButtonColor: 'pink',
                showCancelButton: true,
            })
            if (choice) {
                const eventConfirmed = inviteData[choice]
                const eventConfirmedId = inviteData[choice].eventId
                const currentEventParticipants = inviteData[choice]
                console.log('event confirmed id', eventConfirmedId)
                
                Swal.fire({
                    title: `You have been been added to "The List" \nFor event: \n"${eventConfirmed.event} - ${eventConfirmed.eventDate}"`,
                    confirmButtonColor: 'pink'
                })
                .then((result) => console.log(result.isConfirmed))
                .then(() => setAgreedEvent(prev => !prev))
                .catch((err) => console.log(err))

                const addMeToEvent = async () => {
                    let list = []
                    const docRef = doc(db, "events", eventConfirmedId)
                    const docSnap = await getDoc(docRef)
                    if (docSnap.exists()) {
                        console.log('doc data', docSnap.data())
                        list.push(docSnap.data().eventParticipants)
                        setEventParticipants(...list)
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
            }
            

        }
        confirmInvite()
        console.log(participantEventId);
        console.log(eventParticipants);
        
    }

    return (
        <>
            <div className="formContainer">
                <form onSubmit={handleSubmit}>
                    <input value={eventName} name="eventname" placeholder='event name' onChange={e => setEventName(e.target.value)} />
                    <input value={eventDate} type="date" name="eventdate" placeholder='event date' onChange={e => setEventDate(e.target.value)} />
                    <div className="btn">
                        <button type="submit" onClick={e => setDidSubmit(false)}>Add Event</button>
                    </div>
                    <div>
                    <div style={{textAlign: 'right', marginRight: '25vw'}}>Check Event Invites &nbsp;<a onClick={handleCheckEventClick}><TbMailbox size={'35px'} color={'pink'} /></a></div>
                        <div style={{textAlign: 'right', marginRight: '25vw'}}>Invite User to attend &nbsp;<a onClick={handleInviteClick}><FaEnvelopeOpenText size={'35px'} color={'pink'} /></a></div>
                    </div>
                </form>
                
            </div>
            <div style={{display: 'flex', justifyContent: 'center'}}>
                <Events data={docData} />
            </div>
        </>
    )
}