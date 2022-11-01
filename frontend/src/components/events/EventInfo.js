import { doc, getDoc } from "firebase/firestore";
import { useEffect, useState } from "react"
import { BsBoxArrowInRight, BsCardChecklist } from "react-icons/bs";
import { GiShinyOmega } from "react-icons/gi";
import { HiOutlineExternalLink } from "react-icons/hi";
import { Link, useParams } from "react-router-dom"
import Swal from "sweetalert2";
import { auth, db } from "../../firebase";
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
                arr.push(data)
                setEventsData(...arr)
            }
        }
        getEventInfo();

    }, [])
    console.log(eventsData);
    console.log(user);

    const itemsClaimed = eventsData?.gifts?.filter(i => i.claimee === user?.email)
    const claimedGuestsList = itemsClaimed?.map(i => i.requestor)
    const s = [...new Set(claimedGuestsList)]
    console.log(claimedGuestsList);
    console.log(s);

    const userKeys = eventsData?.eventParticipants // all users
    const unAccountedFor = userKeys?.filter(i => !s.includes(i))
    console.log(unAccountedFor);
    console.log(itemsClaimed);

    const handleChange = (e) => {
        e.preventDefault()
        setSelection(e.target.value)
        console.log(selection);
    }
    const formatGiftLink = (link) => {
        if (link.slice(0, 4).toLowerCase() === 'http') {
            return link
        } else {
            return 'https://' + link
        }
    }

    const filterData = (eventsData) => {
        let s = eventsData?.filter((gift) => gift?.requestor === selection)
        if (selection === 'All') {
            return eventsData
        } else {
            return s
        }
    }
    console.log(filterData(eventsData?.eventParticipants))
    
    let total;
    const mapIt = (data) => {
        const filt = filterData(data)
        
        let sum = filt?.map(i => parseInt(i.giftCost))
        total = sum?.reduce((a, b) => a + b, 0)
        return filt?.map((i, index) => <tr className={index % 2 === 0 ? 'firstRowColor' : ''} key={index}><td>{i.giftName}</td><td>{i.username || i.requestor}</td><td>{i.giftLink !== '' && <a href={formatGiftLink(i.giftLink)} target="_blank"><HiOutlineExternalLink size={'25px'} /></a>}</td><td>{i.giftCost}$</td></tr>)
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
                <h2>Event Breakdown: </h2>
                {eventsData && <h3>{eventsData.events?.eventName} on {dateFormat}</h3>}
                {eventsData && <h5 style={{textAlign: 'center'}}>Event created by "{eventsData.events?.eventOwner}"</h5>}
                <Link to={`/dashboard/${loc}`} style={{textDecoration: 'none', color: 'crimson'}}>Go to this event <BsBoxArrowInRight size={'30px'} color={'crimson'} /></Link>
                
                <div id="dropDownTainer">
                    <label style={{backgroundColor: 'white', padding: '3px', borderRadius: '4px', marginLeft: '3px'}}>Filter by: </label>
                    <select className="eInfoSelect" onChange={e => handleChange(e)}>
                        <optgroup label="Users">
                            <option value="All">All User gifts you have claimed</option>
                            {eventsData?.eventParticipants?.map(i => <option key={i} value={`${i}`}>{i}</option>)}
                        </optgroup>
                    </select>
                    <span style={{marginRight: '5px', backgroundColor: 'white', padding: '3px', borderRadius: '4px'}}><label>Guest List</label><a onClick={guestList}><BsCardChecklist size={'30px'} color={'crimson'} style={{marginLeft: '3px'}} /></a></span>
                </div>
                <div className={`${(itemsClaimed?.length === 0) ? 'noData' : 'hideTainer'}`}><h2>You have not claimed any gifts for this event!</h2></div>
                <div className={`tableTainer ${(itemsClaimed?.length === 0) && 'hideTainer'}`}>
                    
                    <table>
                        <tbody>
                            <tr>
                                <th>Gifts claimed for this event</th>
                                <th>For person</th>
                                <th>Gift Link</th>
                                <th>Estimated total spent</th>
                            </tr>
                            {/* <tr>
                                <td>A</td>
                                <td>B</td>
                                <td>C</td>
                                <td>D</td>
                            </tr> */}
                            
                            {/* {itemsClaimed?.map((i, index) => <tr key={index}><td>{i.giftName}</td><td>{i.username || i.requestor}</td><td>{i.giftLink}</td><td>{i.giftCost}$</td></tr>)} */}
                            {mapIt(itemsClaimed)}
                            
                            <tr ><td colSpan={'4'}><span className="total">Estimated Total: {total}$</span></td></tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    )
}