import React, { useContext, useState, useEffect } from 'react';
import { doc, setDoc, addDoc, collection, updateDoc, arrayUnion, arrayRemove, Timestamp, serverTimestamp, query, where, getDocs } from "firebase/firestore"; 
import { AuthContext } from '../context/AuthContext';
import { db } from '../../firebase';
import Events from './Events';
import './addeventform.css';
import Swal from 'sweetalert2';



export default () => {
    const currentUser = useContext(AuthContext)
    const user = currentUser.currentUser.uid
    const [eventName, setEventName] = useState('')
    const date = new Date(Date.now()).toLocaleString().slice(0, 9)
    const splitDate = date.split('/')
    const propsDate = splitDate[2] + '-' + (splitDate[0].length < 2 ? '0' + splitDate[0] + '-' : splitDate[0] + '-') + splitDate[1]
    const [eventDate, setEventDate] = useState(propsDate)
    const [eventOwner, setEventOwner] = useState(currentUser.currentUser.email)
    const [eventRef, setEventRef] = useState(user)
    const [didSubmit, setDidSubmit] = useState(false)
    const [eventParticipants] = useState([])

    

    ///////////////////////////// fetch user events ///////////////////////////
    const [docData, setDocData] = useState([])
    const q = query(collection(db, "events"), where("events.eventRef", "==", user));

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
                console.log(currentUser.currentUser)
            } catch (error) {
                console.log(error)
            }
        }
        getUserEvents()
    }, [didSubmit])
    /////////////////////////////////
console.log(propsDate);
    

    const handleSubmit = async e => {
        e.preventDefault();
        
        
        if (eventName === '') {
            Swal.fire({
                title: 'must provide an event name!'
            })
        }
        
        try {
            const docRef = await addDoc(collection(db, 'events'), {
                events: {
                    eventName: eventName,
                    eventDate: eventDate,
                    eventOwner: eventOwner,
                    eventRef: eventRef,
                    eventParticipants: eventParticipants
                    
                }
            });
            console.log(docRef);
            setEventName('')
            setEventDate(propsDate)
            setDidSubmit(true)
        } catch (error) {
            console.log(error);
        }
    }

    // const handleDelete = async e => {
    //     e.preventDefault();
    //     <form onSubmit={handleDelete}>
    //             <button type="submit">Delete</button>
    //         </form>
        
    // }
    

    

    return (
        <>
        <div className="formContainer">
            <form onSubmit={handleSubmit}>
                <input value={eventName} name="eventname" placeholder='event name' onChange={e => setEventName(e.target.value)} />
                <input value={eventDate} type="date" name="eventdate" placeholder='event date' onChange={e => setEventDate(e.target.value)} />
                <div className="btn">
                    <button type="submit" onClick={e => setDidSubmit(false)}>Add Event</button>
                </div>
            </form>
            
        </div>
        <div style={{display: 'flex', justifyContent: 'center'}}>
            <Events data={docData} />
        </div>
        </>
    )
}