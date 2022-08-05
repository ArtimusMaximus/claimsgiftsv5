import React, { useContext, useState, useEffect } from 'react';
import { doc, setDoc, addDoc, collection, updateDoc, arrayUnion, arrayRemove, Timestamp, serverTimestamp, query, where, getDocs, getDoc, onSnapshot } from "firebase/firestore"; 
import { AuthContext } from '../context/AuthContext';
import { db } from '../../firebase';
import Events from './Events';
import './addeventform.css';
import Swal from 'sweetalert2';
import { FaEnvelopeOpenText } from 'react-icons/fa'
import { TbMailbox } from 'react-icons/tb'
import { getUserEvents } from './firebase_functions/getusers';

export default () => {
    const currentUser = useContext(AuthContext)
    const user = currentUser.currentUser.uid
    const userEmail = currentUser.currentUser.email
    const [eventName, setEventName] = useState('')
    const date = new Date(Date.now()).toLocaleString().slice(0, 9)
    const splitDate = date.split('/')
    const propsDate = (splitDate[2].length > 4 ? splitDate[2].slice(0, -1) : splitDate[2]) + '-' + (splitDate[0].length < 2 ? '0' + splitDate[0] + '-' : splitDate[0] + '-') + (splitDate[1].length < 2 ? '0' + splitDate[1] : splitDate[1])
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
    
    //setDocData , q1, appendedInvite

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

        // const checkInvites = async () => { // fetching invite documents
        //     let list2 = [];
        //     try {
        //         const querySnapshot = await getDocs(queryInvites)
        //         querySnapshot.forEach((doc) => {
        //             // console.log(doc.data())
        //             list2.push(doc.data())
        //             setInviteData(prev => [...prev, doc.data()])
        //         })
                
        //     } catch (error) {
        //         console.log(error);
        //     }
        // }
        // checkInvites()

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
   
    console.log(inviteData);
  
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
            confirmButtonColor: 'pink',
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
                    invitee: inviteeEmail.trim().toLowerCase(),
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

                // console.log(qSnap);
                // console.log(userBlobId);
                // if (userBlobId) { // if querySnap for blob is empty
                //     const createEventBlob = async () => {
                //         const docRef = await addDoc(collection(db, "eventBlob"), {owner: user, ...blobData});
                        
                //         console.log('docRef.id ', docRef.id);
                //         console.log('docData inside setEventBlob ', docData);
                //         console.log('docRef inside setEventBlob ', docRef);
                //         console.log('CREATE EVENT BLOB FIRED');
                //     }
                //     createEventBlob()
                // } else {
                //     // update blob
                //     const updateBlob = async () => {
                //         const blobRef = doc(db, "eventBlob", userBlobId);
                //         await updateDoc(blobRef, {
                //             blobData: arrayUnion(blobData)
                //         })
                //         console.log('Update Blob FIRED!');
                //     }
                    
                //     return updateBlob()
                //     setDidSubmit(prev => !prev)

                // }
                
                
                
                
                

            }
            
            

        }
        confirmInvite()

        
        console.log(participantEventId);
        console.log(eventParticipants);
        console.log(docData)
        

        
        
    }

    return (
        <>
            <div className="formContainer">
                <form onSubmit={handleSubmit}>
                    <input value={eventName} name="eventname" placeholder='event name' onChange={e => setEventName(e.target.value)} />
                    <input value={eventDate} type="date" name="eventdate" placeholder='event date' onChange={e => setEventDate(e.target.value)} />
                    <div className="btn">
                        <button type="submit" onClick={() => setDidSubmit(false)}>Add Event</button>
                    </div>
                    <div>
                    <div style={{textAlign: 'right', marginRight: '25vw'}}>Check Event Invites &nbsp;<a onClick={handleCheckEventClick}><TbMailbox size={'35px'} color={'pink'} /></a></div>
                        <div style={{textAlign: 'right', marginRight: '25vw'}}>Invite User to attend &nbsp;<a onClick={handleInviteClick}><FaEnvelopeOpenText size={'35px'} color={'pink'} /></a></div>
                    </div>
                </form>
                
            </div>
            <div style={{display: 'flex', justifyContent: 'center'}}>
                <Events data={docData}   /> {/* lastly: send event blob here*/} {/* docData was the original */}
            </div>
        </>
    )
}