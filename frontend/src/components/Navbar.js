import React from 'react';
import { Link } from 'react-router-dom';
import { getAuth, signOut } from 'firebase/auth';



 // me-auto nav classname
export default () => {
    const styles = {
       
        textDecoration: 'none', 
        color:'white',
        fontWeight: '900',
        fontSize: '3vw',
        padding: '10px',
        
    }

    return (
        <>
           <div className='' style={{background: 'pink', height: '15vh', display: 'flex', alignItems:'center', justifyContent: 'center', width: '100vw', overflow: 'hidden'}}>
                <Link to="/" style={{textDecoration: 'none', color: 'White'}}><h3>Claims Gifts</h3></Link>
                <Link to="/dashboard" style={styles}>Dashboard</Link>
                <Link to="/invite" style={styles}>Invite</Link>
                <Link to="/event" style={styles}>Search</Link>
                <Link to="/logout" style={styles}>Logout</Link>
            </div>
        </>
    )
}