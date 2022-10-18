import React from 'react';
import { Link } from 'react-router-dom';
import './events.css'
import { BsInfoCircle } from 'react-icons/bs';
import Swal from 'sweetalert2';




export default ({ data }) => {
    console.log(data);
    let inc = 0;

    const showEventInfo = (index) => {
        let eventInfo = data[index].events
        console.log(eventInfo);

        Swal.fire({
            title: '<span style="font-style: italic;"><b>Event Details</b></span>',
            html: `<b>Name:</b> ${eventInfo.eventName} <p><b>Date:</b> ${eventInfo.eventDate.slice(5, 10) + '-' + eventInfo.eventDate.slice(0, 4)}</p> <p><b>Creator:</b> ${eventInfo.eventOwner}</p>`,
            
            confirmButtonColor: 'pink'
        })

    }
    
    return (
        <>
        <div className='tableContainer'>
            <table className='eventsTable'>
                <thead>
                    <tr>
                        <th>Your Events</th>
                        <th className="infoTd">Event Info</th>
                        
                    </tr>
                </thead>
                <tbody>
                
                {data?.map((i, index) => 
                (
                    <tr key={i.id + inc++}>
                        <td className="firsttd" ><Link to={`${i.id}`}>{i.events?.eventName}</Link><hr /></td>
                        
                        <td className="infoTd"><a onClick={() => showEventInfo(index)}><BsInfoCircle size={'25px'} /></a></td>
                    </tr>
                ))}
                {data.length === 0 && (<tr style={{textAlign: 'left'}}><td><h1>Add an event to view here</h1></td></tr>)}
                </tbody>
            </table>
            
        </div>
        </>
    )
}



// <td id="hostedTd">{i.events?.eventOwner}</td>
// <td id="dateTd">{i.events?.eventDate?.slice(5, 10) + '-' + i.events?.eventDate?.slice(0, 4)}</td>