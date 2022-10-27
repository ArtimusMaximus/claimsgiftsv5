import React from 'react';
import { Link } from 'react-router-dom';
import { BsInfoCircle } from 'react-icons/bs';
import Swal from 'sweetalert2';
import './events.css'



export default ({ data }) => {
    // console.log(data);
    let inc = 0;

    const showEventInfo = (index) => {
        let eventInfo = data[index].events
        

        Swal.fire({
            title: '<span style="font-style: italic;"><b>Event Details</b></span>',
            html: `<b>Name:</b> ${eventInfo.eventName} <p><b>Date:</b> ${eventInfo.eventDate.slice(5, 10) + '-' + eventInfo.eventDate.slice(0, 4)}</p> <p><b>Creator:</b> ${eventInfo.eventOwner}</p>`,
            confirmButtonColor: 'crimson'
        })

    }
    
    return (
        <>
        <div className='tableContainer'>
            <table className='eventsTable'>
            {data.length > 0 && <thead>
                <tr>
                        <th>Your Events</th>
                        <th className='infoTd'>Event Info</th>
                </tr>
            </thead>
            }
                <tbody>
                
                {data?.map((i, index) => 
                (
                    <tr key={i.id + inc++} className={index % 2 === 0 ? 'firstTableRow' : 'secondTableRow'}>
                        <td className="firsttd"><Link to={`${i.id}`}>{i.events?.eventName}</Link>&nbsp; &nbsp;{i.events?.eventDate}</td>
                        
                        <td className="infoTd"><a onClick={() => showEventInfo(index)}><BsInfoCircle size={'25px'}  /></a></td>
                    </tr>
                ))}
                {data.length === 0 && (<tr colSpan={'2'}><td style={{ display: 'flex', justifyContent:'center', alignItems:'center'}}><h2 style={{marginTop:'0px', marginBottom:'0px', fontStyle: 'italic'}}>Add an event to view here...</h2></td></tr>)}
                </tbody>
            </table>
            
        </div>
        </>
    )
}



// <td id="hostedTd">{i.events?.eventOwner}</td>
// <td id="dateTd">{i.events?.eventDate?.slice(5, 10) + '-' + i.events?.eventDate?.slice(0, 4)}</td>