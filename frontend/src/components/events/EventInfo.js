import { getAuth } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { useEffect, useState } from "react"
import { BsBoxArrowInRight, BsCardChecklist } from "react-icons/bs";
import { GiShinyOmega } from "react-icons/gi";
import { HiOutlineExternalLink } from "react-icons/hi";
import { Link, useParams } from "react-router-dom"
import Swal from "sweetalert2";
import { auth, db } from "../../firebase";
import { BsInfoCircle } from 'react-icons/bs';
import { MdCallSplit } from 'react-icons/md'
import './eventinfo.css';

export default () => {
    const params = useParams();
    let loc = params.event;
    const [eventId] = useState(loc);
    const [eventsData, setEventsData] = useState([]);
    const [selection, setSelection] = useState('All');
    const user = auth.currentUser
    const date = eventsData?.events?.eventDate
    const dateFormat = date?.slice(5, 7) + '-' + date?.slice(8, 10) + '-' + date?.slice(0,4) 
    


    
    useEffect(() => {
        
        const getEventInfo = async () => {
            const arr = [];
            const docRef = doc(db, 'events', eventId)
            const docSnap = await getDoc(docRef)
            if (docSnap.exists()) {
                const data = docSnap.data()
                console.log(docSnap.data());
                arr.push(data)
                setEventsData(...arr)
            }
        }
        getEventInfo();
        
        
        

    }, [])
    console.log(eventsData);
    // console.log(user);

    const itemsClaimed = eventsData?.gifts // i believe the solution is to pass one arg, and filter the preferred arg 4:00pm
    // const itemsClaimed = eventsData?.gifts?.filter(i => i.claimee === user?.email) // i believe the solution is to pass one arg, and filter the preferred arg 4:00pm
    const itemsSplit =   eventsData?.gifts?.filter(i => i.splittees?.includes(user.email))
    // const splitUsersList = eventsData?.gifts?.map(i => i.splittees)
    // console.log(splitUsersList);
    // const itemsSplit = eventsData?.gifts?.filter(i => i.splittees !== undefined && i.splittees !== '' && i.splittees?.includes(user.email))
    console.log(itemsSplit);
    const claimedGuestsList = itemsClaimed?.map(i => i.requestor)
    const s = [...new Set(claimedGuestsList)]
    // console.log(claimedGuestsList);
    // console.log(s);

    const userKeys = eventsData?.eventParticipants // all users
    const unAccountedFor = userKeys?.filter(i => !s.includes(i))
    // console.log(unAccountedFor);
    // console.log(itemsClaimed);

    const handleChange = (e) => {
        e.preventDefault()
        setSelection(e.target.value)
        console.log(selection);
    }
    const formatGiftLink = (link) => {
        if (link?.slice(0, 4).toLowerCase() === 'http') {
            return link
        } else {
            return 'https://' + link
        }
    }

    const filterData = (eventsData) => {
        let eD = eventsData?.filter(i => i?.claimee === user?.email)
        let iS = eventsData?.filter(i => i?.splittees?.includes(user?.email))

        // iS.forEach(i => i.giftCost = i.giftCost / (i.splittees.length + 1))


        let combinedArr = []
        eventsData && combinedArr.push(...eD, ...iS)
        console.log(combinedArr);

        console.log(eD);
        console.log(iS);

        let s0 = eventsData?.filter(i => i?.claimee === user?.email)
        let s = s0?.filter((gift) => gift?.requestor === selection)
        if (selection === 'All') {
            // console.log(eventsData);

            return combinedArr
        } else if (selection === 'individual') {
            
            // let spl = eventsData?.filter((gift) => gift.splittees !== undefined && gift.splittees !== '' && gift.splittees.includes(user.email))
            return eD
        } else if (selection === 'splits') {
            
            // let spl = eventsData?.filter((gift) => gift.splittees !== undefined && gift.splittees !== '' && gift.splittees.includes(user.email))
            return iS
        } else {
            
            console.log('hit else statement');
            return s
        }
    }
    
    const splitteeList = (arr) => {
       
        let newArr = [...arr]
        
        console.log(newArr);

        Swal.fire({
            title: 'Users you are splitting with:',
            html: `${newArr.map(i => i).join(', ')}`
        })
    }
    
    // we are leaving off where the filter works, now we need to adjust the price for split items. perhaps another parameter for type of incoming data to adjust sum
    let roundDifference;
    let total;
    const mapIt = (data) => {
        const filt = filterData(data)
        console.log(filt);

        const filtSplittees = filt.filter(i => i.splittees !== undefined && i.splittees !== '')
        console.log(filtSplittees);
        const difference = filtSplittees.map(i => Math.round(parseInt(i.giftCost ? i.giftCost : 0)) - (Math.round(parseInt(i.giftCost ? i.giftCost : 0)) / (i.splittees.length + 1)) )
        roundDifference = difference.reduce((a,b) => a + b, 0)
        console.log(Math.round(roundDifference));
        
        
        let sum = filt?.map(i => parseInt(i?.giftCost ? i.giftCost : 0))
        total = sum?.reduce((a, b) => a + b, 0)
        return filt?.map((i, index) => 
                <tr className={index % 2 === 0 ? 'firstRowColor' : ''} key={index}>
                    <td className="itemCol">{i?.giftName}{i?.splittees !== undefined && i?.splittees !== '' && <MdCallSplit color="crimson" size={'25px'} />}</td>
                    <td className="forPersonCol">{i?.username || i?.requestor}</td>
                    <td className="linkCol">{i?.giftLink !== '' && <a href={formatGiftLink(i?.giftLink)} target="_blank"><HiOutlineExternalLink size={'25px'} /></a>}</td>
                    <td className="costCol">
                        {i?.splittees !== undefined && i?.splittees !== '' && <a onClick={() => splitteeList(i?.splittees)}><BsInfoCircle size={'20px'} /></a>}
                        {i?.splittees !== undefined && i?.splittees !== '' && parseInt(i.giftCost ? i.giftCost : 0) + ' split by' + '(' + (i?.splittees?.length + 1) + ') '}
                        {selection === 'splits' && i?.splittees !== undefined && i?.splittees !== '' || selection === 'All' && i?.splittees !== undefined && i?.splittees !== '' ? Math.round(parseInt(i?.giftCost ? i.giftCost : 0) / (i?.splittees?.length + 1)) : i?.giftCost ? i.giftCost : 0}$
                    </td>
                </tr>
            )
    }
    const guestList = () => {
        return Swal.fire({
            title:'Entire Guest List:',
            html:`${userKeys.map((i) => `<p style="margin:3px;">${i}</p>`).join('')} <h2 style="margin:3px; margin-top: 7px;">User gifts unaccounted for:</h2> ${unAccountedFor.filter(i => i !== user.email).map(i => `<p style="margin:3px;"> ${i}</p>`).join('')}`,
            confirmButtonColor:'crimson'
        })
    }
    
   
    

    return (
        <>
            <div className="eventInfoTainer">
                <h2>Event Summary: </h2>
                {eventsData && <h5>"{eventsData.events?.eventName}" on {dateFormat}</h5>}
                {eventsData && <h5 style={{textAlign: 'center'}} className="whiteBgOpacity">Event created by "{eventsData.events?.eventOwner}"</h5>}
                <Link to={`/dashboard/${loc}`} style={{textDecoration: 'none', color: 'crimson'}}>Go to this event <BsBoxArrowInRight size={'30px'} color={'crimson'} /></Link>
                
                <div id="dropDownTainer">
                    <label className="whiteBgOpacity" style={{padding: '3px', borderRadius: '4px', marginLeft: '3px'}}>Filter by: </label>
                    <select className="eInfoSelect" onChange={e => handleChange(e)}>
                        <optgroup label="Users">
                            <option value="All">All gift claims</option>
                            <option value="individual">Individual gift claims</option>
                            {eventsData?.eventParticipants?.map(i => <option key={i} value={`${i}`}>{i}</option>)}
                            <option value="splits">Items you are splitting</option>
                        </optgroup>
                    </select>
                    <span className="whiteBgOpacity" style={{marginRight: '5px', padding: '3px', borderRadius: '4px'}}><label>Guest List</label><a onClick={guestList}><BsCardChecklist size={'30px'} color={'crimson'} style={{marginLeft: '3px'}} /></a></span>
                </div>
                <div className={`${(itemsClaimed?.length === 0) ? 'noData' : 'hideTainer'}`}><h2>You have not claimed any gifts for this event!</h2></div>
            </div>    
                <div className={`tableTainer ${(itemsClaimed?.length === 0) && 'hideTainer'}`}>
                    
                    <table>
                        <tbody>
                            <tr>
                                <th>Gifts claimed for this event</th>
                                <th>For person</th>
                                <th>Gift Link</th>
                                <th>Est. total spent</th>
                            </tr>
                            {/* <tr>
                                <td>A</td>
                                <td>B</td>
                                <td>C</td>
                                <td>D</td>
                            </tr> */}
                            
                            {/* {itemsClaimed?.map((i, index) => <tr key={index}><td>{i.giftName}</td><td>{i.username || i.requestor}</td><td>{i.giftLink}</td><td>{i.giftCost}$</td></tr>)} */}
                            {eventsData && mapIt(itemsClaimed)}
                            
                            <tr ><td colSpan={'4'}><span className="total">Overall est. Total: {Math.round(total - roundDifference)}$</span></td></tr>
                        </tbody>
                    </table>
                </div>
            
        </>
    )
}