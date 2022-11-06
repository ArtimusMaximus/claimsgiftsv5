import { collection, setDoc, updateDoc, doc, arrayUnion, where, query, onSnapshot } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { BsFileBreakFill, BsInfoCircle } from 'react-icons/bs';
import { HiOutlineExternalLink } from 'react-icons/hi';
import Swal from 'sweetalert2';
import { db } from '../../firebase';
import { GrEdit } from 'react-icons/gr'
import { MdCallSplit } from 'react-icons/md';
import './addgiftform.css';
import './gifts.css';



export default ({ giftArray, user, inFocus }) => {
    // {giftArray && giftArray.map(i => (<ul key={i.giftName}><li><b>Gift: </b>{i.giftName}</li><li><b>Link: </b>{i.giftLink}</li><li><b>Requestor: </b>{i.requestor}</li><b>Claimed: </b><li>{i.claimed ? "claimed" : i.requestor === user.email ? 'Unavailable to requestor!' : "not claimed"}</li></ul>))}
    const [checked, setChecked] = useState(false)
    const [notChecked, setNotChecked] = useState(true)
    const [isClaimed, setIsClaimed] = useState(Boolean)
    const [toggle, setToggle] = useState(true)
    const [splittable, setSplittable] = useState(false)
    const [show, setShow] = useState(false)
    const [wasEdited, setWasEdited] = useState(false)
    const [newName, setNewName] = useState('')
    const [newLink, setNewLink] = useState('')
    const [claimeeArray, setClaimeeArray] = useState([])

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
        
        // console.log(inFocus);
        
        setClaimeeArray(giftArray)

        
    }, [isClaimed, wasEdited])

    console.log(giftArray);

    const handleEdit = async (e, index) => {
        console.log(e.target);
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

    const updateClaimed = async () => {
        
        const docRef = doc(db, "events", eventId)
        await updateDoc(docRef, {
            gifts: [...giftArray]
        })
    }

    const handleClaim = async (e) => {
        console.log(e.target.id)
            return Swal.fire({
                title: 'Would you like to claim this gift?',
                confirmButtonColor: 'crimson',
                showCancelButton: true,
                cancelButtonColor: 'gray',
            })
            .then( async (result) => {
            if (result.isConfirmed) {
                
                setChecked(current => !current)

                giftArray[e.target.id].claimed = true
                giftArray[e.target.id].claimee = user.email
                
               updateClaimed()
               setIsClaimed(true)
            } else {
                return
            }
            if (giftArray[e.target.id].splittable === false || giftArray[e.target.id].splittable === undefined) {

            const { value: split } = await Swal.fire({
                    title: `${user.email} has claimed this gift!`,
                    confirmButtonColor: 'crimson',
                    text: 'Allow others to split?',
                    input: 'checkbox',
                    inputValue: 0
                })
                if (split) {
                    giftArray[e.target.id].splittable = true
                    console.log(split, typeof split);
                    setSplittable(true)
                    updateClaimed()
                }
            }            
            })
            .catch((error) => console.log(error))
        }
    const handleUnclaim = (e) => {
        let msg;
        switch
            (giftArray[e.target.id].splittable) {
                case true:
                    msg = '(This will remove all splittees)'
                    break;
                default:
                    msg = ''
            }
        return Swal.fire({
            title: 'You have this gift claimed, would you like to unclaim it?',
            html: `${msg}`,
            showCancelButton: true,
            confirmButtonColor: 'crimson'
        })
        .then((result) => {
            if (result.isConfirmed) {
                
                // const filterOutClaimee = claimeeArray[e.target.id].filter(i => i === user.email)
                // console.log(filterOutClaimee);

                giftArray[e.target.id].claimee = '' // this needs to change to an updated array filtering out the unclaimer
                giftArray[e.target.id].claimed = false
                giftArray[e.target.id].splittable = false
                giftArray[e.target.id].splittees = ''

                updateClaimed()
                setIsClaimed(false)
                setNotChecked(current => !current)
            } else {
                return
            }
            Swal.fire({
                title: `You, "${user.email}" have unclaimed this gift!`,
                confirmButtonColor: 'crimson'
            })
        })
        
    }
    const handleSplit = async (e) => {
        console.log(e.target.id);
        console.log(e.target);
        let num = parseInt(e.target.id.slice(5))
        console.log(num);
        const claimee = giftArray[num]?.claimee
        let existingSplittees = giftArray[num]?.splittees
        if (num && claimee && user.email === claimee) {
            return await Swal.fire({
                title: 'You are the initial item claimee. To remove the option to split with others, unclaim this item!',
                icon: 'warning',
                confirmButtonColor: 'crimson',
                confirmButtonText: 'Confirmed'
            })
        } else if (existingSplittees?.includes(user.email)) {
            const { value: remove } = await Swal.fire({
                title: 'You are already on the splittee list, would you like to remove yourself from this list?',
                confirmButtonColor: 'crimson',
                showCancelButton: true,
                input: 'checkbox',
                inputValue: 0,

            })
            if (remove === 1) {
                const filterYourselfOut = existingSplittees.filter(i => i !== user.email)
                console.log(filterYourselfOut);
                giftArray[num].splittees = filterYourselfOut
                updateClaimed();
            }
        } else {
            const { value: confirmSplit } = await Swal.fire({
                title: `${claimee} has claimed this item and is allowing for others to split.`,
                html: `Would you like to split this item with ${claimee} and potential others?`,
                confirmButtonColor: 'crimson',
                input: 'checkbox',
                inputValue: 0,
                showCancelButton: true
    
            })
            if (confirmSplit) {
                let arr = [];
                
                console.log(existingSplittees);
                if (existingSplittees !== undefined && existingSplittees !== '') {
                    arr.push(...giftArray[num]?.splittees, user.email)
                } else {
                    arr.push(user.email)
                }
                
                
                giftArray[num].splittees = arr
                console.log(giftArray[num]?.splittees);
                updateClaimed();
            }
        }
    }



    const handleToggle = () => {
        setToggle(prev => !prev)
    }

    const claimedInfo = async (claimee, splittees) => {
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
                    title: `Item Claimee(s): ${splittees?.length >= 1 ? claimee + ', ' : claimee} ${splittees === undefined || splittees === '' ? '' : splittees?.map(i => i).join(', ')} `,
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
    // console.log(inFocus);

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
                            
                            <td className="giftNametd">{user.email === i.requestor 
                                ? <a onClick={() => giftInfo(index)}><BsInfoCircle size={'17px'} /></a>
                                : <a onClick={() => viewGiftInfo(index)}><BsInfoCircle size={'17px'} /></a>
                                } {<b id={`${index}`}>{i.giftName}</b>}
                                <a className='editSpan' onClick={e => handleEdit(e, index)}>
                                    {user.email === i.requestor && <GrEdit  />}
                                </a>
                            </td>
                            <td className='giftLinkTd'>{i.giftLink !== '' && <a rel="noopener noreferrer" href={formatGiftLink(i.giftLink)} target="_blank"><HiOutlineExternalLink size={'25px'} /></a>}</td>
                            <td className="requesteeTd">
                            <span id="imgDiv">
                                {
                                    i?.img && <div className='imageCropper'><img src={i.img} height={'30px'} style={{borderRadius: '50%'}} /></div>
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
                                    : i.claimed && i.splittable
                                    ?  <><input className='cb' id={index} type="checkbox" value={checked} disabled={i.claimee.includes(user.email) ? false : true} checked={i.claimed} onChange={e => handleUnclaim(e)} /><a className="splitLink" onClick={e => handleSplit(e)} id={'split' + index}><MdCallSplit  color={'crimson'} width={'25px'} /></a></>
                                    : i.claimed && !i.splittable
                                    ? <input className='cb' id={index} type="checkbox" value={checked} disabled={i.claimee.includes(user.email) ? false : true} checked={i.claimed} onChange={e => handleUnclaim(e)} />
                                    : <input className='cb' id={index} type="checkbox" value={notChecked} checked={i.claimed} onChange={e => handleClaim(e)} />
                                    
                                }
                                
                            </td>
                            <td className='infoButton'>{<a onClick={() => claimedInfo(i.claimee, i.splittees)}><BsInfoCircle size={'20px'} /></a>}</td>
                        </tr>    
                    )}
                    {giftArray.length === 0 && !inFocus && (<tr style={{textAlign: 'left', display: 'flex', justifyContent:'center', alignItems:'center'}}><td style={{marginTop: '200px'}}><h2 style={{marginTop:'0px', fontStyle: 'italic', border: '1px dotted crimson', padding: '5px', borderRadius: '5px'}}>Add a gift and a gift link using the inputs above to get started...</h2></td></tr>)}
                    {giftArray.length === 0 && inFocus && (<tr style={{textAlign: 'left', display: 'flex', justifyContent:'center', alignItems:'center'}}><td style={{marginTop: '200px'}}><h2 style={{marginTop:'0px', fontStyle: 'italic', border: '1px dotted crimson', padding: '5px', borderRadius: '5px'}}>Nothing matches your search...</h2></td></tr>)}
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