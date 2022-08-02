import React, { useContext } from 'react';
import Events from './events/Events';
import { eventData } from './events/data';
import { AuthContext } from './context/AuthContext';
import AddEventForm from '../components/events/AddEventForm';
import FetchUserEvents from './events/firebase_crud/FetchUserEvents';


export default () => {
    const currentUser = useContext(AuthContext)

    return (
        <>  
            <div>
                <h3 style={{textAlign: 'center'}}>Welcome to your dashboard <br />{currentUser && currentUser.currentUser.email}</h3>
                <AddEventForm />
                <div>
                    
                </div>
                
            </div>
            
        </>
    )
}