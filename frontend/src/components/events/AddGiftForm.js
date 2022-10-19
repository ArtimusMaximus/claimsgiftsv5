import { arrayUnion, doc, getDocs, onSnapshot, updateDoc, query, collection, where, getDoc, setDoc, Timestamp, arrayRemove } from 'firebase/firestore';
import React, { useContext, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { db } from '../../firebase';
import { AuthContext } from '../context/AuthContext';
import './addgiftform.css';
import Swal from 'sweetalert2'
import Gifts from './Gifts';
import { SlPresent } from 'react-icons/si';
import { FaPaste } from 'react-icons/fa';

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
    const [remObject, setRemObject] = useState('')
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
    

useEffect(() => {
    let list = [];
    
    const getUserEvents = async () => {
        try {
            const docRef = doc(db, 'events', eventId)
            const docSnap = await getDoc(docRef)
            if (docSnap.exists()) {
                setEventData(docSnap.data().events)
                list.push(docSnap.data().eventParticipants)
            } else {
                console.log('must have been no data');
            }
            
        } catch (error) {
            console.log(error);
        }
    }
    getUserEvents()

    // console.log('use effect fired')

    const unsub2 = onSnapshot(doc(db, "events", eventId), doc => {
        // console.log('current doc data ', doc.data());
        const arr = [];
        const list = [];
        arr.push({id: doc.id, ...doc.data().gifts})
        list.push({id: doc.id, ...doc.data().eventParticipants})

        let format = Object.values(arr[0])
        let format2 = Object.values(list[0])
       
        setGiftArray(format.slice(0, -1))
        setEventParticipants(format2.slice(0, -1))
    })
    return () => {
        unsub2() 
    }
    
    // const queryInvites = query(collection(db, "invites"), where("invitee", "==", userEmail))
    
    
    

}, [didSubmit])

// console.log(eventParticipants);

    const handleSubmit = async e => {
        e?.preventDefault();
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
            // console.log(eventRef)
            } catch (error) {
                // console.log(error)
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
            title: eventParticipants && `Event participants: \n${eventParticipants.join(' ')}`,
            
        })
        if(email) {
            // console.log('event participants ' , eventParticipants, email)
            // updatePartici()
            // console.log(eventParticipants)
            Swal.fire({
                title: `User(s) ${email} added to participants!`,
                confirmButtonColor: 'pink',
                // text: `Save user email to friends list?`,
                // showDenyButton: true
            })
            .then((result) => console.log(result))
            .then(() => setEventParticipants(prev => [...prev, email]))    
            // .then(() => updateDoc(eventRef, {
            //     eventParticipants: arrayUnion(...eventParticipants)
            // }))
            // .then(() => setDidSubmit(prev => !prev))
            .catch(err => console.log(err))
            // .then((result) => result.isConfirmed ? setEventParticipants(eventParticipants => [...eventParticipants, email]) : null)
            // friends list add on
        }
       // updatePartici()
    }
    const updatePartici = async () => {
        try {
            await updateDoc(eventRef, {
                eventParticipants: arrayUnion(...eventParticipants)
            })
            } catch (error) {
                console.log(error)
            } 
    }
    updatePartici()
    
    const search = (data) => {
        let keys = ['giftName', 'giftLink', 'requestor']
        return data.filter((item) =>
            keys.some((key) => item[key].toLowerCase().includes(searchQuery))
        )
    }

    const onTheList = eventParticipants.includes(user.email)
    // console.log('event data ', eventData, 'gift array ', giftArray)

    const updateGiftArray = async (remGiftName) => {
        // console.log(remGiftLink);
        // console.log(remGiftName); //works
        // console.log(moddedArray);
        // console.log(remObject);

        try {
            // setDoc(doc(db, 'cities')) is when you provide your own ID item (3rd arg)
            // await updateDoc(eventRef, {
            //     gifts: arrayRemove({
            //         // {
            //         //     giftArray // adds the entire array as a nested array item #10-
            //         // }
            //         giftName: remGiftName, 
            //         giftLink: remGiftLink, 
            //         claimed: isClaimed,
            //         // claimee: requestor,
            //         requestor: requestor, 
            //         giftRef: giftRef
            //         })
            // })
            await updateDoc(eventRef, {
                gifts: (
                    // {
                    //     giftArray // adds the entire array as a nested array item #10-
                    // }
                    // ...giftArray and giftArray being passed seems to do the same thing
                    
                        giftArray.filter(i => i !== remGiftName)
                    // claimed: 'false',
                    // giftLink: 'www.com',
                    // giftName: 'new event to the left window plz',
                    // giftRef: '39yUj2kcdyyeDoPYIfrF',
                    // requestor: 'admin11@aol.com'
                )
            })
            console.log('update gift array fired')
            console.log(remObject);
            // console.log(eventRef)
            } catch (error) {
                console.log(error)
            }
    }
    
    const handleRemove = async () => {
        const yourItems = giftArray.filter(i => currentUser.currentUser.email === i.requestor)
        const items = yourItems.map(i => i.giftName)
        
        const { value: item } = await Swal.fire({
            title: `Please select gift to remove!`,
            confirmButtonColor: 'crimson',
            input: 'select',
            inputOptions: {
                'Item to remove':
                {...items}
            },
            inputPlaceholder: `Your choices...`
        })
        if (item) {
            console.log(item);
            const gift = yourItems[item].giftName
            const eventId = yourItems[item].giftRef
    
            console.log(gift, eventId);

            // const newGiftArray = giftArray.filter(i => i !== giftArray[item])
            // const removedItem = giftArray.filter(i => giftArray[item] !== i)
            const remGiftName = yourItems[item]
            setRemObject(remGiftName)
            console.log(remGiftName);
            

            await Swal.fire({
                title: `Are you sure you want to remove Gift: "${gift}"? (Note: This is irreversible!)`,
                icon: 'warning',
                iconColor: 'crimson',
                showCancelButton: 'true',
                confirmButtonColor: 'crimson'
            })
            .then((result) => {
                if (result.isConfirmed) {
                    updateGiftArray(remGiftName)
                    Swal.fire({
                        title: `Gift: "${gift}" removed!`,
                        confirmButtonColor: 'pink',
                        confirmButtonText: 'Got it!'
                    })
                } else {
                    Swal.fire({
                        title: 'Gift not deleted!',
                        confirmButtonColor: 'green'
                    })
                }
            })
            // .then(() => setGiftArray(newGiftArray))
            // .then(() => setRemGift(removedItem))
            // .then(() => console.log(removedItem))
            // .then(result => result.isConfirmed ? Swal.fire(`${gift} removed!`) : Swal.fire('File remains'))
            // .then(() => setRemObject(remGiftName))
            // .then(() => setModdedArray(newGiftArray), console.log('@set new gift array fired', newGiftArray))
            // .then(() => setRemGiftLink(remGiftName.giftLink))
            // .then(() => setRemGiftName(remGiftName.giftName))
            
            .then(() => console.log('gift array ', giftArray))
            // .then(() => console.log('new gift array ', newGiftArray))
            // .then(() => setDidSubmit(current => !current))

            // .then(() => setDidSubmit(current => !current))
            .catch(err => console.log(err))
            // then setGiftArray()
        }
        // setModdedArray(newGiftArray)
        // setRemGiftLink(remGiftName.giftLink)
        // setRemGiftName(remGiftName.giftName)
        // updateGiftArray()
        setDidSubmit(current => !current)
        
    }
    console.log(giftArray);

    const pasteLink = async (e) => {
        if (e) {
            await navigator.clipboard.readText()
                .then(text => setGiftLink(text))  
        }
    }
    

    
        
    return (
        <>
        {onTheList || user.email === eventData.eventOwner ? (<>
            <div>
                {eventData && <h2>Event: {eventData.eventName}</h2>}
                <div style={{display: 'flex', justifyContent: 'center', alignItems:'center'}}>
                    <span>Add event participants</span>
                    <button className='plusbutton' onClick={sweetModal}>+</button>
                </div>
            </div>
            <div className='formContainer'>
                    <form onSubmit={handleSubmit}>
                        <input value={giftName} name="giftname" placeholder='Gift Name' onChange={e => setGiftName(e.target.value)} />
                        
                        <input value={giftLink} name="giftlink" placeholder='Gift Link' onChange={e => setGiftLink(e.target.value)} />
                        <i id="iconEl" onClick={e => pasteLink(e)}><FaPaste size={'30px'} color={'crimson'} /><label style={{fontSize: '10px'}}>Paste</label></i>
                        <div>
                            <button type="submit">Add Gift</button>
                            <button type="button" name='removeBtn' onClick={handleRemove} className='removeGift'>Remove Gift</button>
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