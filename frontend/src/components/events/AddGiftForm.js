import { arrayUnion, doc, getDocs, onSnapshot, updateDoc, query, collection, where, getDoc, setDoc, Timestamp } from 'firebase/firestore';
import React, { useContext, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { db } from '../../firebase';
import { AuthContext } from '../context/AuthContext';
import './addgiftform.css'
import Swal from 'sweetalert2'
import Gifts from './Gifts';

export default () => {
    const currentUser = useContext(AuthContext)
    const user = currentUser.currentUser
    const location = useLocation()
    const eventId = location.pathname.split("/")[2]
    const [giftName, setGiftName] = useState('');
    const [giftLink, setGiftLink] = useState('');
    const [isClaimed, setIsClaimed] = useState(false);
    const [requestor, setRequestor] = useState(user.email);
    const [giftArray, setGiftArray] = useState([]);
    const [eventData, setEventData] = useState({});
    const [didSubmit, setDidSubmit] = useState(false);
    const [eventParticipants, setEventParticipants] = useState([user.email]);
    const [giftRef] = useState(eventId);
    const [searchQuery, setSearchQuery] = useState('')
    
    const eventRef = doc(db, 'events', eventId) // add gifts to this event
    const q = query(collection(db, "events"), where("gifts", "array-contains", "claimed"));
    const q1 = query(collection(db, "events"), where("eventParticipants", "array-contains", user.email));
    const q2 = query(collection(db, "events"), where("events.eventRef", "==", user.uid));
    const q3 = query(collection(db, "events"), 
        where("eventParticipants", "array-contains", user.email),
        where("giftsEventRef", "==", eventId)
    );
    
    
    
    const [rtEvents, setRtEvents] = useState([])

useEffect(() => {
    let list = [];
    
    const getUserEvents = async () => {
        try {
            // const querySnapshot = await getDocs(q)
            
            // querySnapshot.forEach((doc) => {
            //     list.push({id: doc.id, ...doc.data()})
            //     console.log(doc.id, "=>", doc.data())
            // })
            const docRef = doc(db, 'events', eventId)
            const docSnap = await getDoc(docRef)
            if (docSnap.exists()) {
                
                // list.push({events: docSnap.data().events, gifts: docSnap.data().gifts})
                console.log(docSnap.data().gifts)
                // setGiftArray(docSnap.data().gifts)
                setEventData(docSnap.data().events)
                console.log(docSnap.data().eventParticipants)
                list.push(docSnap.data().eventParticipants)
                setEventParticipants(...list)
                
                // list.push(docSnap.data().events.eventOwner)
                // setParticipantEmail([...list])
                
                
            } else {
                console.log('must have been no data');
            }
            
        } catch (error) {
            console.log(error);
        }
    }
    getUserEvents()

    // const unsubscribe = onSnapshot(q1, (querySnapshot) => {
    //     let events = [];
    //     querySnapshot.docs.forEach((doc) => {
    //         events.push({id: doc.id, ...doc.data().gifts})
    //         console.log(doc.data());
            
    //     })
        
    //     //set events
    //     let format = Object.values(events[0])
    //     let f = format.slice(0, -1)
    //     console.log(format);
    //     console.log(f);
    //     setGiftArray(f)
    //     setRtEvents(events)
    //     console.log(giftArray);
    //     console.log('realtime events', rtEvents);
    // }, (error) => {
    //     console.log(error);
    // })
    // return () => {
    //     unsubscribe()
    // }
    const unsub2 = onSnapshot(doc(db, "events", eventId), doc => {
        console.log('current doc data ', doc.data());
        const arr = [];
        arr.push({id: doc.id, ...doc.data().gifts})
        
        let format = Object.values(arr[0])
        console.log(format);

        setGiftArray(format.slice(0, -1))
    })
    return () => {
        unsub2()
    }
    
    
    
    

}, [didSubmit])


    const handleSubmit = async e => {
        e.preventDefault();
        if (giftName === '') return Swal.fire({title:'Must enter a gift name!', confirmButtonColor:'pink'}) 
        try {
            // setDoc(doc(db, 'cities')) is when you provide your own ID item (3rd arg)
            await updateDoc(eventRef, {
                gifts: arrayUnion(
                    {
                        giftName: giftName, 
                        giftLink: giftLink, 
                        claimed: isClaimed, 
                        requestor: requestor, 
                        giftRef: giftRef
                    }
                )
            })
            console.log(eventRef)
            } catch (error) {
                console.log(error)
            }
            setDidSubmit(current => !current)
            setGiftName('')
            setGiftLink('')
        }
 
    const sweetModal = async () => {
        const { value: email } = await Swal.fire({
            title: 'Enter new participant email',
            input: 'email',
            inputLabel: 'Email',
            confirmButtonColor: 'pink',
            showCancelButton: true,
            cancelButtonColor: 'crimson',
            inputPlaceholder: 'Enter email address here',
            title: eventParticipants && `Event participants: \n${eventParticipants.join(' ')}`
        })
        if(email) {
            
            console.log('event participants ' , eventParticipants)

            Swal.fire({
                title: `User(s) ${email} added to participants!`,
                confirmButtonColor: 'pink',
                // text: `Save user email to friends list?`,
                // showDenyButton: true
            })
            .then((result) => console.log(result))
            .then(() => setEventParticipants(prevList => [...prevList, email]))
            // .then(() => updateDoc(eventRef, {
            //     eventParticipants: arrayUnion(...eventParticipants)
            // }))
            
            .catch(err => console.log(err))
            // .then((result) => result.isConfirmed ? setEventParticipants(eventParticipants => [...eventParticipants, email]) : null)
            // friends list add on
            
        }
        
    }
    const updatePartici = async () => {
        
        try {
            // setDoc(doc(db, 'cities')) is when you provide your own ID item (3rd arg)
            await updateDoc(eventRef, {
                eventParticipants: arrayUnion(...eventParticipants)
            })
            
            console.log(eventRef)
            console.log(eventParticipants);
            } catch (error) {
                console.log(error)
            } 
    }
    updatePartici()

    console.log(giftArray)

    const search = (data) => {
        let keys = ['giftName', 'giftLink', 'requestor']
        return data.filter((item) =>
            keys.some((key) => item[key].toLowerCase().includes(searchQuery))
        )
    }

    console.log(user.email)
    console.log(eventData);
    
    const onTheList = eventParticipants.includes(user.email)
    console.log(onTheList)
    // const checkEmail = async () => {
    //     const currentUserEmail = user.email
    //     const onTheList = eventParticipants.includes(currentUserEmail)
    //     try {
    //         await onTheList
    //         if(onTheList) {
    //             setVerifyOnList(true)
    //         }
    //     } catch (error) {
    //         console.log(error)
    //     }
    // }
    // checkEmail()

    
        
    return (
        <>
        {onTheList || user.email === eventData.eventOwner ? (<>
            <div>
                {eventData && <h2>Event: {eventData.eventName}</h2>}
                <div style={{display: 'flex', justifyContent: 'right', marginRight: '24vw'}}>
                    <span style={{display: 'flex', alignItems:'center'}}>Add event participants</span>
                    <button className='plusbutton' onClick={sweetModal}>+</button>
                </div>
            </div>
            <div className='formContainer'>
                    <form onSubmit={handleSubmit}>
                        <input value={giftName} name="giftname" placeholder='Gift Name' onChange={e => setGiftName(e.target.value)} />
                        <input value={giftLink} name="giftlink" placeholder='Gift Link' onChange={e => setGiftLink(e.target.value)} />
                        <div>
                            <button type="submit">Add Gift</button>
                        </div>
                    </form> 
            </div>
            <div className='searchContainer'>
                <span>
                    <input type="text" value={searchQuery} placeholder='filter results' onChange={e => setSearchQuery(e.target.value)} />
                    <button onClick={() => setSearchQuery('')}>Clear</button>
                </span>
            </div>
            <Gifts giftArray={giftArray && search(giftArray)} user={user} />
        </>) : (
            <div style={{textAlign: 'center'}}>
                <h1>You must be added to the event list to participate!</h1>
            </div>
        )}
        </>
    )
}