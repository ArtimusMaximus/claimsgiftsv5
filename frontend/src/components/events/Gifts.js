import { collection, setDoc, updateDoc, doc, arrayUnion, where, query, onSnapshot } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import {BsInfoCircle} from 'react-icons/bs'
import Swal from 'sweetalert2';
import { db } from '../../firebase';

import './addgiftform.css';
import './gifts.css';


export default ({ giftArray, user }) => {
    // {giftArray && giftArray.map(i => (<ul key={i.giftName}><li><b>Gift: </b>{i.giftName}</li><li><b>Link: </b>{i.giftLink}</li><li><b>Requestor: </b>{i.requestor}</li><b>Claimed: </b><li>{i.claimed ? "claimed" : i.requestor === user.email ? 'Unavailable to requestor!' : "not claimed"}</li></ul>))}
    const [checked, setChecked] = useState(false)
    const [notChecked, setNotChecked] = useState(true)
    const [isClaimed, setIsClaimed] = useState(Boolean)
    const [toggle, setToggle] = useState(true)

    // console.log(giftArray[0]?.giftLink);
    
    const location = useLocation()
    const eventId = location.pathname?.split("/")[2]
    
    let inc = 0;
    console.log(giftArray);
    console.log(user);

    // console.log(location);

    useEffect(() => {
        // const updateClaimed = async () => {
        //     const docRef = doc(db, "events", eventId)
        //     await updateDoc(docRef, {
        //         gifts: [...giftArray]
        //     })
        // }
        // updateClaimed()
        

        
    }, [isClaimed])

    const updateClaimed = async () => {
        const docRef = doc(db, "events", eventId)
        await updateDoc(docRef, {
            gifts: [...giftArray]
        })
    }

    const handleChange = (e) => {
        console.log(e.target.id)
            return Swal.fire({
                title: 'Would you like to claim this gift?',
                inputLabel: 'Email',
                confirmButtonColor: 'pink',
                showCancelButton: true,
                cancelButtonColor: 'gray'
            })
            .then((result) => {
                if (result.isConfirmed) {
                    setIsClaimed(true)
                    
                    setChecked(current => !current)
                    
                    giftArray[e.target.id].claimed = true
                    giftArray[e.target.id].claimee = user.email
 
                    updateClaimed()
                } else {
                    return
                }
                Swal.fire({
                    title: `${user.email} has claimed this gift!`,
                    confirmButtonColor: 'pink'
                })
                
            })
            .catch((error) => console.log(error))
        }
    const handleUnclaim = (e) => {
        return Swal.fire({
            title: 'You have this gift claimed, would you like to unclaim it?',
            showCancelButton: true,
            confirmButtonColor: 'crimson'
        })
        .then((result) => {
            if (result.isConfirmed) {
                setIsClaimed(false)
                setNotChecked(current => !current)
                
                giftArray[e.target.id].claimed = false
                giftArray[e.target.id].claimee = user.email

                updateClaimed()
            } else {
                return
            }
            Swal.fire({
                title: `You, "${user.email}" have unclaimed this gift!`,
                confirmButtonColor: 'pink'
            })
        })
        
    }
    const handleToggle = () => {
        setToggle(prev => !prev)
        console.log(toggle);
    }

    const claimedInfo = async (claimee) => {
        await Swal.fire({
            title: 'This will reveal who has claimed this item!',
            text: 'Are you sure you want to proceed?',
            confirmButtonColor: 'pink',
            showCancelButton: true,
            cancelButtonColor: 'red'
        })
        .then((result) => {
            if (result.isConfirmed && !claimee) {
                Swal.fire({
                    title: `This item has yet to be claimed!`,
                    confirmButtonColor: 'pink'
                })
            } else if (result.isConfirmed) {
                Swal.fire({
                    title: `Item Claimee: ${claimee}`,
                    confirmButtonColor: 'pink'
                })
            } else {
                return
            }
        })
    }
    const giftInfo = async (index) => {
        const giftInfo = giftArray[index].giftInfo
        
        const { value: text } = await Swal.fire({
            input: 'textarea',
            inputLabel: 'Item details e.g. size, color, quantity...',
            color: 'black',
            inputPlaceholder: 'Item Info...',
            text: `Current Gift Info: ${giftInfo ? `"${giftInfo}"` : '"None"'}`,
            showCancelButton: true,
            cancelButtonColor: 'red',
            confirmButtonColor: 'pink'
        })
        if (text) {

            giftArray[index].giftInfo = text
            console.log(text);

            Swal.fire({
                title: 'Gift Information: ',
                text: `${text}`,
                confirmButtonColor: 'pink'
            })
            .then(() => updateClaimed())
            .catch(err => err)
        } else {
            return
        }

        
    }


    return (
        <div className='giftContainer'>
                
            <table>
                <tbody>
                    <tr>
                        <th>Gift Name</th>
                        <th>Gift Link</th>
                        <th>Requestee</th>
                        <th className='thclaimed'>
                            Claimed Status:
                            <label className='switch'>
                                <input className='tog' value={toggle} type="checkbox" defaultChecked={true} onClick={handleToggle} />
                                <span className='slider round'></span>
                            </label>
                            {toggle ? "hide" : "reveal"}
                        </th>
                    </tr>
                    {giftArray && giftArray.map((i, index) =>
                        <tr key={i.giftName + inc++}>
                            <td>{i.giftName} {user.email === i.requestor && <a onClick={() => giftInfo(index)}><BsInfoCircle size={'15px'} /></a>}</td>
                            <td><a rel="noopener noreferrer" href={i.giftLink} target="_blank">{i.giftLink.length > 15 ? i.giftLink.slice(0, 14) + '...' : i.giftLink}</a></td>
                            <td>
                                {
                                    user.email === i.requestor 
                                    ? "You" 
                                    : i.requestor 
                                }
                            </td>
                            <td className='cbtd'>
                                {
                                    user.email === i.requestor && toggle 
                                    ? '?¿' 
                                    : i.claimed
                                    ?  <input className='cb' id={index} type="checkbox" value={checked} disabled={user.email === i.claimee ? false : true} checked={i.claimed} onChange={e => handleUnclaim(e)} />
                                    :  <input className='cb' id={index} type="checkbox" value={notChecked} checked={i.claimed} onChange={e => handleChange(e)} />
                                    
                                }
                                
                            </td>
                            <td className='infoButton'>{<a onClick={() => claimedInfo(i.claimee)}><BsInfoCircle /></a>}</td>
                        </tr>    
                    )}      
                </tbody>
            </table>
        
        </div>
    )
}