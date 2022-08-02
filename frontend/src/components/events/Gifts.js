import { collection, setDoc, updateDoc, doc, arrayUnion } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import Swal from 'sweetalert2';
import { db } from '../../firebase';
import './addgiftform.css'

export default ({ giftArray, user }) => {
    // {giftArray && giftArray.map(i => (<ul key={i.giftName}><li><b>Gift: </b>{i.giftName}</li><li><b>Link: </b>{i.giftLink}</li><li><b>Requestor: </b>{i.requestor}</li><b>Claimed: </b><li>{i.claimed ? "claimed" : i.requestor === user.email ? 'Unavailable to requestor!' : "not claimed"}</li></ul>))}
    const [checked, setChecked] = useState(true)
    const [notChecked, setNotChecked] = useState(false)
    const [isClaimed, setIsClaimed] = useState(Boolean)
    const location = useLocation()
    const eventId = location.pathname.split("/")[2]
    console.log(eventId);
    console.log(checked)
    let inc = 0;
    

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
                    
                    giftArray[e.target.id].claimed = true
 
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
                
                giftArray[e.target.id].claimed = false
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


    
    console.log(giftArray);

    return (
        <div className='giftContainer'>
                
            <table>
                <tbody>
                    <tr>
                        <th>Gift Name</th>
                        <th>Gift Link</th>
                        <th>Requestor</th>
                        <th>Claimed</th>
                    </tr>
                    {giftArray.map((i, index) => 
                        <tr key={i.giftName + inc++}>
                            <td>{i.giftName}</td>
                            <td>{i.giftLink}</td>
                            <td>
                                {
                                    user.email === i.requestor 
                                    ? "You" 
                                    : i.requestor 
                                }
                            </td>
                            <td>
                                {
                                    !user.email === i.requestor 
                                    ? '?¿' 
                                    : i.claimed
                                    ?  <input className='cb' id={index} type="checkbox" value={checked} disabled={user.email === i.requestor ? false : true} checked={checked} onChange={e => handleUnclaim(e)} />
                                    :  <input className='cb' id={index} type="checkbox" value={notChecked} checked={notChecked} onChange={e => handleChange(e)} />
                                }
                            </td>
                        </tr>    
                    )}      
                </tbody>
            </table>
        
        </div>
    )
}