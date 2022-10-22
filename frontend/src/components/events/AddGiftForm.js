import { arrayUnion, doc, getDocs, onSnapshot, updateDoc, query, collection, where, getDoc, setDoc, Timestamp, arrayRemove } from 'firebase/firestore';
import React, { useContext, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { db } from '../../firebase';
import { AuthContext } from '../context/AuthContext';
import './addgiftform.css';
import Swal from 'sweetalert2'
import Gifts from './Gifts';
import { IoRefreshSharp } from 'react-icons/io5';
import { FaPaste } from 'react-icons/fa';
import { MdGroupAdd } from 'react-icons/md'

export default () => {
    const currentUser = useContext(AuthContext)
    const user = currentUser.currentUser
    const location = useLocation()
    const eventId = location.pathname.split("/")[2]
    const [giftName, setGiftName] = useState('');
    const [giftLink, setGiftLink] = useState('');
    const [isClaimed, setIsClaimed] = useState(false);
    const [requestor, setRequestor] = useState(user.email);
    const [userName, setUserName] = useState('')
    const [giftArray, setGiftArray] = useState([]);
    const [remObject, setRemObject] = useState('')
    const [eventData, setEventData] = useState({});
    const [didSubmit, setDidSubmit] = useState(false);
    const [eventParticipants, setEventParticipants] = useState([user.email]);
    const [giftRef] = useState(eventId);
    const [searchQuery, setSearchQuery] = useState('')
    
    const eventRef = doc(db, 'events', eventId) // add gifts to this event
    
    const userRef = doc(db, 'users', user.uid)
    const getUserInfo = async () => {
        const userInfo = await getDoc(userRef)
        if (userInfo.exists) {
            setUserName(userInfo.data().username)
        }
    }
    getUserInfo();
    

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
                        giftRef: giftRef,
                        // username: userName why was this here?
                    }
                )
            })
            // console.log(eventRef)
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
            confirmButtonColor: 'crimson',
            showCancelButton: true,
            cancelButtonColor: 'grey',
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
        let keys = ['giftName', 'requestor', 'username']
        return data.filter((item) =>
            keys.some((key) => item[key]?.toLowerCase().includes(searchQuery.toLowerCase()))
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
            const gift = yourItems[item].giftName
            const eventId = yourItems[item].giftRef

            const remGiftName = yourItems[item]
            setRemObject(remGiftName)
            
            

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
                        confirmButtonColor: 'crimson',
                        confirmButtonText: 'Got it!'
                    })
                } else {
                    Swal.fire({
                        title: 'Gift <b style="font-style: italic;">not</b> deleted!',
                        confirmButtonColor: 'green'
                    })
                }
            })
            .catch(err => console.log(err))
            
        }
        
        setDidSubmit(current => !current)
        
    }
  
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
                {eventData && <h2 style={{marginTop: '10px', marginBottom:'10px'}}>Event: {eventData.eventName}</h2>}
                <div style={{display: 'flex', justifyContent: 'center', alignItems:'center'}}>
                    <span id="addeventparti">Add event participants</span>
                    <MdGroupAdd id="addPartIcon" size={'36px'} onClick={sweetModal} />
                </div>
            </div>
            <div className='formContainer'>
                    <form onSubmit={handleSubmit}>
                        <input className='giftInputs' value={giftName} name="giftname" placeholder='Gift Name' onChange={e => setGiftName(e.target.value)} />
                        
                        <input className='giftInputs' value={giftLink} name="giftlink" placeholder='Gift Link' onChange={e => setGiftLink(e.target.value)} />
                        <i id="iconEl" onClick={e => pasteLink(e)}><FaPaste size={'30px'} color={'pink'} id="pasteicon" /><div>Paste&nbsp;</div></i>
                        <div>
                            <button type="submit" className='btnInvert addGift'>Add Gift</button>
                            <button type="button" name='removeBtn' onClick={handleRemove} className='removeGift btnInvert'>Remove Gift</button>
                        </div>
                    </form> 
            </div>
            <div className='searchContainer'>
                <span>
                    <input className='searchInput' type="text" value={searchQuery} placeholder='Filter Results' onChange={e => setSearchQuery(e.target.value)} />
                    <button id="refreshBtn" onClick={() => setSearchQuery('')} className="btnInvert"><IoRefreshSharp size={'30px'} /></button>
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