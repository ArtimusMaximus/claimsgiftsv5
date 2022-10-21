import { useState } from "react";
import { doc, updateDoc } from 'firebase/firestore';
import { db } from "../firebase";


export default ({ userId }) => {
    let [userName, setUserName] = useState('');
    let [userImg, setUserImg] = useState('');
    

    const handleSubmit = async e => {
        e.preventDefault();
        
        const userRef = doc(db, 'users', userId)

        await updateDoc(userRef, {
            username: userName,
        })
        setUserName('')
        
    }

    return (
        <>
            <form onSubmit={handleSubmit}>
                <div>Add/Update username</div>
                <input type="text" value={userName} onChange={e => setUserName(e.target.value)} />
                <button type="submit">Save Changes</button>
            </form>
        </>
    );
}