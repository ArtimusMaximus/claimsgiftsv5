import { collection, setDoc, updateDoc, doc, arrayUnion, where, query, onSnapshot } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { BsInfoCircle } from 'react-icons/bs';
import { HiOutlineExternalLink } from 'react-icons/hi'
import Swal from 'sweetalert2';
import { db } from '../../firebase';
import { GrEdit } from 'react-icons/gr'

import './addgiftform.css';
import './gifts.css';


export default ({ giftArray, user }) => {
    // {giftArray && giftArray.map(i => (<ul key={i.giftName}><li><b>Gift: </b>{i.giftName}</li><li><b>Link: </b>{i.giftLink}</li><li><b>Requestor: </b>{i.requestor}</li><b>Claimed: </b><li>{i.claimed ? "claimed" : i.requestor === user.email ? 'Unavailable to requestor!' : "not claimed"}</li></ul>))}
    const [checked, setChecked] = useState(false)
    const [notChecked, setNotChecked] = useState(true)
    const [isClaimed, setIsClaimed] = useState(Boolean)
    const [toggle, setToggle] = useState(true)
    const [show, setShow] = useState(false)
    const [wasEdited, setWasEdited] = useState(false)
    const [newName, setNewName] = useState('')
    const [newLink, setNewLink] = useState('')

    // console.log(giftArray[0]?.giftLink);
    
    const location = useLocation()
    const eventId = location.pathname?.split("/")[2]
    const eventRef = doc(db, 'events', eventId)
    
    let inc = 0;
    

    // console.log(location);

    useEffect(() => {
        // const updateClaimed = async () => {
        //     const docRef = doc(db, "events", eventId)
        //     await updateDoc(docRef, {
        //         gifts: [...giftArray]
        //     })
        // }
        // updateClaimed()
        
        

        
    }, [isClaimed, wasEdited])

    const updateClaimed = async () => {
        const docRef = doc(db, "events", eventId)
        await updateDoc(docRef, {
            gifts: [...giftArray]
        })
    }
    const handleEdit = async (e, index) => {
        e.preventDefault()
        
        
        let name = giftArray[index].giftName
        let link = giftArray[index].giftLink
        let cost = giftArray[index]?.giftCost

        

        const { value : editedText } = await Swal.fire({
            title: 'Edit values...',
            confirmButtonColor: 'crimson',
            html: ` <div style="display: flex; align-items:center; justify-content:center; flex-direction: column;">
                    <label>Item Name</label><input id="textEditIn1" placeholder="${name}" />
                    <label>Item Link</label><input id="textEditIn2" placeholder="${link !== '' ? link : ''}" />
                    <label>Item Cost</label><input id="textEditIn3" placeholder="${cost ? cost : '$'}" />
                    </div>`,
            focusConfirm: false,
            preConfirm: () => {
                return [
                    document.getElementById('textEditIn1').value,
                    document.getElementById('textEditIn2').value,
                    document.getElementById('textEditIn3').value
                ]
            }

        })
        if (editedText) {
            let updatedGiftArr = [...giftArray]
            updatedGiftArr[index].giftName = editedText[0]
            updatedGiftArr[index].giftLink = editedText[1]
            updatedGiftArr[index].giftCost = editedText[2]
            if (editedText[0] === '') {
                updatedGiftArr[index].giftName = name
            }
            if (editedText[1] === '') {
                updatedGiftArr[index].giftLink = link
            }
            if (editedText[2] === '') {
                updatedGiftArr[index].giftCost = cost || '0'
            }

            await updateDoc(eventRef, {
                gifts: (
                    updatedGiftArr
                )
            })
            // setWasEdited(prev => !prev)
        }

    }

    const handleChange = (e) => {
        console.log(e.target.id)
            return Swal.fire({
                title: 'Would you like to claim this gift?',
                inputLabel: 'Email',
                confirmButtonColor: 'crimson',
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
                    confirmButtonColor: 'crimson'
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
                giftArray[e.target.id].claimee = ''

                updateClaimed()
            } else {
                return
            }
            Swal.fire({
                title: `You, "${user.email}" have unclaimed this gift!`,
                confirmButtonColor: 'crimson'
            })
        })
        
    }
    const handleToggle = () => {
        setToggle(prev => !prev)
    }

    const claimedInfo = async (claimee) => {
        // console.log(claimee);
        await Swal.fire({
            title: 'This will reveal who has claimed this item!',
            text: 'Are you sure you want to proceed?',
            confirmButtonColor: 'crimson',
            showCancelButton: true,
            cancelButtonColor: 'grey'
        })
        .then((result) => {
            if (result.isConfirmed && !claimee) {
                Swal.fire({
                    title: `This item has yet to be claimed!`,
                    confirmButtonColor: 'crimson'
                })
            } else if (result.isConfirmed) {
                Swal.fire({
                    title: `Item Claimee: ${claimee}`,
                    confirmButtonColor: 'crimson'
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
            cancelButtonColor: 'grey',
            confirmButtonColor: 'crimson'
        })
        if (text) {

            giftArray[index].giftInfo = text
            console.log(text);

            Swal.fire({
                title: 'Gift Information: ',
                text: `${text}`,
                confirmButtonColor: 'crimson'
            })
            .then(() => updateClaimed())
            .catch(err => err)
        } else {
            return
        }
    }
    const viewGiftInfo = (index) => {
        const giftInfo = giftArray[index].giftInfo
        
        Swal.fire({
            
            inputPlaceholder: 'Item Info...',
            text: `Current Gift Info: ${giftInfo ? `"${giftInfo}"` : '"None"'}`,
            showCancelButton: true,
            cancelButtonColor: 'grey',
            confirmButtonColor: 'crimson'
        })
    }

    const formatGiftLink = (link) => {
        if (link.slice(0, 4).toLowerCase() === 'http') {
            return link
        } else {
            return 'https://' + link
        }
    }
    // console.log(giftArray.map(i => i?.username))

    return (
        <>
        <div className='giftContainer'>
                
            <table>
                <tbody>
                    {giftArray.length !== 0 && <tr id="rowForHeaders">
                        <th>Gift</th>
                        <th>Link</th>
                        <th>User</th>
                        
                        <th colSpan={2}>Info</th>
                    </tr>}
                    {giftArray && giftArray.map((i, index) =>
                        <tr key={i.giftName + inc++} className={index % 2 === 0 ? "firstTableRow" : ''}>
                            {/* <div className="tooltip" style={show ? {display: 'block'} : {display: 'none'} }>{i.giftName}</div> */}
                            <td className="giftNametd">{user.email === i.requestor 
                                ? <a onMouseEnter={() => setShow(true)} onMouseLeave={() => setShow(false)} onClick={() => giftInfo(index)}><BsInfoCircle size={'17px'} /></a>
                                : <a onMouseEnter={() => setShow(true)} onMouseLeave={() => setShow(false)} onClick={() => viewGiftInfo(index)}><BsInfoCircle size={'17px'} /></a>
                                } {<b id={`${index}`}>{i.giftName}</b>}
                                <a className='editSpan'>
                                    {<GrEdit onClick={e => handleEdit(e, index)} />}
                                </a>
                            </td>
                            <td><a rel="noopener noreferrer" href={formatGiftLink(i.giftLink)} target="_blank"><HiOutlineExternalLink size={'25px'} /></a></td>
                            <td className="requesteeTd">
                            <span id="imgDiv">
                                {
                                    i?.img && <div className='imageCropper'><img src={i.img} height={'30px'} /></div>
                                }
                                <span>
                                {
                                    user.email === i.requestor 
                                    ? "You"
                                    : i?.username
                                    ? i.username
                                    : i.requestor
                                }
                                </span>
                            </span>
                                
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
                            <td className='infoButton'>{<a onClick={() => claimedInfo(i.claimee)}><BsInfoCircle size={'20px'} /></a>}</td>
                        </tr>    
                    )}
                    {giftArray.length === 0 && (<tr style={{textAlign: 'left', display: 'flex', justifyContent:'center', alignItems:'center'}}><td style={{marginTop: '200px'}}><h2 style={{marginTop:'0px', fontStyle: 'italic', border: '1px dotted crimson', padding: '5px', borderRadius: '5px'}}>Add a gift and a gift link using the inputs above to get started...</h2></td></tr>)}
                </tbody>
            </table>
            <span className={giftArray.length === 0 ? 'thclaimed' : 'thclaimed2'}>
                Click to reveal your items 'claimed' status
                <label className='switch'>
                    <input className='tog' value={toggle} type="checkbox" defaultChecked={true} onClick={handleToggle} />
                    <span className='slider round'></span>
                </label>
                {toggle ? "(hidden)" : "(revealed)"} 
            </span>
        </div>
        
        </>
    )
}