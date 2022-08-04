import React from 'react';
import { Link } from 'react-router-dom';
import './events.css'




export default ({ data }) => {
    
    
    return (
        <>
            <table className='eventsTable'>
                <thead>
                <tr>
                    <th>Your Events</th>
                    <th>Hosted by</th>
                    <th>Event Date</th>
                </tr>
                </thead>
                <tbody>
                
                {data?.map(i => 
                (
                    <tr key={i.id}>
                        <td className="firsttd"><Link to={`${i.id}`}>{i.events.eventName}</Link></td>
                        <td>{i.events.eventOwner}</td>
                        <td>{i.events.eventDate.slice(5, 10) + '-' + i.events.eventDate.slice(0, 4)}</td>
                    </tr>
                ))}
                {data.length === 0 && (<tr style={{textAlign: 'left'}}><td>Add an event to view here</td></tr>)}
                </tbody>
            </table>
            <div>
                
            </div>
        </>
    )
}