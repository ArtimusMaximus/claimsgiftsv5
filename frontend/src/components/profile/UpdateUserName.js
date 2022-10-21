import { useState } from "react";
import { doc, updateDoc } from 'firebase/firestore';
import { db } from "../../firebase";
import './updateusername.css';
import { useNavigate } from "react-router-dom";


export default ({ userId }) => {
    let [userName, setUserName] = useState('');
    const navigate = useNavigate();
    const delay = t => new Promise(resolve => setTimeout(resolve, t))

    const handleSubmit = async e => {
        e.preventDefault();
        
        const userRef = doc(db, 'users', userId)

        await updateDoc(userRef, {
            username: userName,
        })
        setUserName('');
        delay(2000)
            .then(() => navigate('/dashboard'))
        
    }

    return (
        <>
            <div className="usernameFormContainer">
                <form onSubmit={handleSubmit}>
                    <div>Add or Update username</div>
                    <input className="usernameIn" type="text" value={userName} onChange={e => setUserName(e.target.value)} />
                    <button type="submit">Save & Return</button>
                </form>
            </div>
        </>
    );
}