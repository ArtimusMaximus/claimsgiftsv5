import { arrayUnion, doc, onSnapshot, updateDoc, getDoc } from 'firebase/firestore';
import React, { useEffect, useContext, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { auth, db } from '../../firebase';
import Swal from 'sweetalert2'
import Gifts from './Gifts';
import { BsBoxArrowInRight, BsInfoCircle } from 'react-icons/bs';
import { IoRefreshSharp } from 'react-icons/io5';
import { FaPaste } from 'react-icons/fa';
import { MdGroupAdd } from 'react-icons/md'
import { AuthContext } from '../context/AuthContext';
import emailjs from '@emailjs/browser';
import { searchBarInfo } from './searchbarinfo';
import './addgiftform.css';





export default () => {
    // const currentUser = useContext(AuthContext) // development
    // const user = currentUser.currentUser // development
    const user = auth.currentUser // production version
    const location = useLocation();
    const eventId = location.pathname.split("/")[2]

    const [giftName, setGiftName] = useState('');
    const [giftLink, setGiftLink] = useState('');
    const [giftCost, setGiftCost] = useState('');
    const [remObject, setRemObject] = useState('');
    const [userData, setUserData] = useState({
        username: '',
        img: ''
    });
    const [searchQuery, setSearchQuery] = useState('');
    const [giftArray, setGiftArray] = useState([]);
    const [eventData, setEventData] = useState({});
    const [isClaimed, setIsClaimed] = useState(false);
    const [didSubmit, setDidSubmit] = useState(false);
    const [requestor, setRequestor] = useState(user.email);
    const [eventParticipants, setEventParticipants] = useState([user.email]);
    const [chosen, setChosen] = useState(1000)
    const [giftRef] = useState(eventId);
    const [inFocus, setInFocus] = useState(false)

    
    
    
    const eventRef = doc(db, 'events', eventId) // add gifts to this event
    
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
    const userRef = doc(db, 'users', user.uid)
    const getUserInfo = async () => {
        const userInfo = await getDoc(userRef)
        if (userInfo.exists) {
            setUserData({
                username: userInfo.data().username || '',
                img: userInfo.data().img || '',
                userEmail: userInfo.data().email
            })
        } else {
            console.log('no data');
        }
    }
    getUserInfo()

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
// console.log(giftArray);

    const handleSubmit = async e => {
        let defaultCost = 0
        
        e?.preventDefault();
        if (giftName === '') return Swal.fire({ title: 'Must enter a gift name!', confirmButtonColor:'crimson' })
        
        try {
            // setDoc(doc(db, 'cities')) is when you provide your own ID item (3rd arg)
            // if (userName === '') ?? wtf is this ; don't game and debug
            await updateDoc(eventRef, {
                gifts: arrayUnion(
                    {
                        giftName: giftName, 
                        giftLink: giftLink, 
                        claimed: isClaimed, 
                        requestor: requestor, 
                        giftRef: giftRef,
                        username: userData.username,
                        img: userData.img,
                        giftCost: giftCost !== '' ? giftCost : defaultCost
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
            setGiftCost('')
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
        if (email) {
            // console.log('event participants ' , eventParticipants, email)
            // updatePartici()
            // console.log(eventParticipants)
            Swal.fire({
                title: `User(s) ${email} added to participants!`,
                confirmButtonColor: 'crimson',
                // text: `Save user email to friends list?`,
                // showDenyButton: true
            })
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
    
    const search = (data, choice) => {
        let keys = ['giftName', 'requestor', 'username']

        if(choice === 1000) { // all
            return data.filter(i => keys.some((key) => i[key].toLowerCase().includes(searchQuery.toLowerCase())))
        } else if (choice === 201) {
            return data.filter((i => i?.giftCost >= choice && keys.some((key) => i[key].toLowerCase().includes(searchQuery.toLowerCase()))))
        } else  if (choice === 'yourClaims') {
            return data.filter((i) => i?.claimee === user.email && keys.some((key) => i[key]?.toLowerCase().includes(searchQuery.toLowerCase())))
        } else  if (choice === 'yourSplits') {
            return data.filter((i) => i?.splittees !== undefined && i.splittees !== '' && i.splittees.includes(user.email) && keys.some((key) => i[key]?.toLowerCase().includes(searchQuery.toLowerCase())))
        } else if (choice) {
            return data.filter((i => i?.giftCost >= choice - 25 && i?.giftCost <= choice && keys.some((key) => i[key].toLowerCase().includes(searchQuery.toLowerCase()))))
        // } else  if (!choice) {
        //     console.log('!choice fired');
        //     return data.filter((item) =>
        //     keys.some((key) => item[key]?.toLowerCase().includes(searchQuery.toLowerCase())))
        }
    }
// i believe we are going to need to combine these twon functions
// later that day... I believe you are correct
    // const dollarAmount = (data, choice) => {
    //     if(choice === 1000) {
    //         return data.filter(i => i.giftCost <= choice)
    //     }
    //     if (choice) { // all
    //         return data.filter((i => i.giftCost >= choice - 25 && i.giftCost <= choice))
    //     }  
    // }
    const handleSelect = e => {
        e.preventDefault();
        
        if (!e.target.value) {
            return 
            
        } else {
            switch
            (e.target.value) {
                case '25':
                    setChosen(25)
                    break;
                case '50':
                    setChosen(50)
                    break;
                case '75':
                    setChosen(75)
                    break;
                case '100':
                    setChosen(100)
                    break;
                case '125':
                    setChosen(125)
                    break;
                case '150':
                    setChosen(150)
                    break;
                case '175':
                    setChosen(175)
                    break;
                case '200':
                    setChosen(200)
                    break;
                case '201':
                    setChosen(201)
                    break;
                case '1000':
                    setChosen(1000)
                    break;
                case 'yourClaims':
                    setChosen('yourClaims')
                    break;
                case 'yourSplits':
                    setChosen('yourSplits')
                    break;
                default:
                    setChosen(100000)
                }
        }
        
    }
    
    const onTheList = eventParticipants.includes(user.email)

    const updateGiftArray = async (remGiftName) => {
        try {
            await updateDoc(eventRef, {
                gifts: (
                        giftArray.filter(i => i !== remGiftName)
                )
            })
            // console.log(eventRef)
            } catch (error) {
                console.log(error)
            }
    }
    
    const handleRemove = async () => {
        const yourItems = giftArray.filter(i => user.email === i.requestor)
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
            const giftIsClaimed = yourItems[item].claimed

            const remGiftName = yourItems[item]
            setRemObject(remGiftName)
            let mes = 'Send the claimee an automated email regarding the removal of the gift they formerly claimed?'

            let warningMessage;
            switch
                (giftIsClaimed) {
                    case true:
                        warningMessage = `Wait! Someone has claimed this gift, item: "${gift}" may have already been purchased! Are you sure you want to delete this? (Note: This is irreversible!)`
                        break;
                    default:
                        warningMessage = `Are you sure you want to remove Gift: "${gift}"? (Note: This is irreversible!)`
                }
            await Swal.fire({
                title: `${warningMessage}`,
                icon: 'warning',
                iconColor: 'crimson',
                showCancelButton: 'true',
                confirmButtonColor: 'crimson'
            })
            .then(async (result) => {
                if (result.isConfirmed) {
                    updateGiftArray(remGiftName)
                    const { value: email } = await Swal.fire({
                        title: `Gift: "${gift}" removed!`,
                        confirmButtonColor: 'crimson',
                        confirmButtonText: 'Got it!',
                        input: giftIsClaimed ? 'checkbox' : '',
                        inputValue: 1,
                        html: giftIsClaimed ? `${mes}` : ``,
                    })
                    if (email && giftIsClaimed) {
                        let tex = ''
                        const { value: text } = await Swal.fire({
                            title: 'Notes to user in automated email...',
                            input: 'textarea',
                            inputPlaceholder: 'E.G. Someone else already bought this item for my cat/dog',
                            showCancelButton: true,
                            cancelButtonText: 'Skip',
                            confirmButtonColor: 'crimson',
                            confirmButtonText: 'Send'
                        })
                        if (text) {
                            tex = text
                        }


                        let claimeeEmail = remGiftName?.claimee
                        let eName = eventData.eventName
                        let eDate = eventData.eventDate
                        let userE = remGiftName.requestor
        
                        let tempParam = {
                            from_name: remGiftName.requestor,
                            event_name: eName,
                            event_date: eDate,
                            to_email: claimeeEmail,
                            from_email: userE,
                            gift_name: gift,
                            message: tex
                        }
                        const templateID = 'template_l4kp685';
                        const publicKey = 'C0U6FhGhn-2kWm9SD';
                        const handleEmail = async () => {
                            await emailjs.send('default_service', templateID, tempParam, publicKey)
                                .then((res) => console.log('Success ', res.status, res.text))
                                .catch(err => console.log(err))
                        }
                        Swal.fire({
                            title: 'Email sent!',
                            html: `With your message: "${tex}"`,
                            confirmButtonColor: 'crimson'
                        })
                        .then(() => handleEmail())
                    }
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
                {eventData && <h2 style={{marginTop: '10px', marginBottom:'5px'}}>Event: {eventData.eventName}</h2>}
                <span id="eventBreakDown"><Link to={`/dashboard/eventinfo/${eventId}`} style={{textDecoration: 'none', color: 'crimson'}}>Go to event summary<BsBoxArrowInRight size={'30px'} color={'crimson'} /></Link></span>
                <div style={{display: 'flex', justifyContent: 'center', alignItems:'center'}}>
                    <span id="addeventparti">Add event participants</span>
                    <MdGroupAdd id="addPartIcon" size={'36px'} onClick={sweetModal} />
                </div>
            </div>
            <div className='formContainer'>
                    <form onSubmit={handleSubmit}>
                        <input className='giftInputs giftNameIn' value={giftName} name="giftname" placeholder='Gift Name' onChange={e => setGiftName(e.target.value)} />
                        <br />
                        <input className='giftInputs giftIns40' value={giftLink} name="giftlink" placeholder='Gift Link' onChange={e => setGiftLink(e.target.value)} />
                        <i id="iconEl" onClick={e => pasteLink(e)}><FaPaste size={'30px'} color={'pink'} id="pasteicon" /><div>Paste&nbsp;</div></i>
                        <br />
                        <input  className='giftInputs giftIns40' type='number' value={giftCost} name="giftcost" placeholder='Gift Cost' onChange={e => setGiftCost(e.target.value)} />
                        
                        <div>
                            
                            <button type="submit" className='btnInvert addGift'>Add Gift</button>
                            <button type="button" name='removeBtn' onClick={handleRemove} className='removeGift btnInvert'>Remove Gift</button>
                        </div>
                    </form> 
            </div>
            <div className='searchContainer'>
                <span id="filterSpan">
                   <a onClick={searchBarInfo}><BsInfoCircle size={'25px'} /></a><input className='searchInput' type="text" onFocus={() => setInFocus(true)} onBlur={() => setInFocus(false)} value={searchQuery} placeholder='Filter Results' onChange={e => setSearchQuery(e.target.value)} />
                    <button id="refreshBtn" onClick={() => setSearchQuery('')} className="btnInvert"><IoRefreshSharp size={'30px'} /></button>
                <select id="selectValue" name="cost" onFocus={() => setInFocus(true)} onBlur={() => setInFocus(false)} onChange={e =>handleSelect(e)}>
                    <optgroup label="Filter Choices">
                        <option value="1000">All Items</option>
                        <option value="25">Up to 25$</option>
                        <option value="50">25 to 50$</option>
                        <option value="75">50 to 75$</option>
                        <option value="100">75 to 100$</option>
                        <option value="125">100 to 125$</option>
                        <option value="150">125 to 150$</option>
                        <option value="175">150 to 175$</option>
                        <option value="200">175 to 200$</option>
                        <option value="201">200$ and up</option>
                        <option value="yourClaims">Your claims</option>
                        <option value="yourSplits">Your splits</option>
                    </optgroup>
                </select>
                </span>
                
            </div>
            <Gifts giftArray={giftArray && search(giftArray, chosen)} user={user} inFocus={inFocus}/>
        </>) : (
            <div style={{textAlign: 'center'}}>
                <h1>You must be added to the event list to participate!</h1>
            </div>
        )}
        </>
    )
}