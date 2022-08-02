import React, { useContext, useState } from "react";
import './login.css'
import { Link, useNavigate } from "react-router-dom";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../firebase";
import { doc, setDoc, addDoc, collection, serverTimestamp } from "firebase/firestore";
import { AuthContext } from "./context/AuthContext";

export default () => {
    const navigate = useNavigate();
    const [error, setError] = useState(false)
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    

    const { dispatch } = useContext(AuthContext)

    const handleAdd = async (e) => {
        e.preventDefault();
        
        try {
            const res = await createUserWithEmailAndPassword(auth, email, password)
            // this returns a user object, regardless of applying it right away with
            // .then(userCredential) => {const user = userCredential}
            // it is attached to your variable! res.user
            await setDoc(doc(db, 'users', res.user.uid), {
                email,
                password,
                timeStamp: serverTimestamp(),
                
            })
            dispatch({type:"SIGNUP", payload: res.user})
            navigate('/dashboard')
        } catch (error) {
            console.log(error)
            setError(true)
        }
    }

    return (
        <>
            <div className="box">
                <label>Welcome!</label>
                <form onSubmit={handleAdd}>
                    <div>
                        <input 
                            name="email" 
                            type="email" 
                            placeholder="email" 
                            onChange={e => setEmail(e.target.value)}
                            onFocus={e => e.target.placeholder = ''} 
                            onBlur={e => e.target.placeholder = 'email'}
                        />
                    </div>
                    <div>
                        <input name="password" type="password" placeholder="password" onChange={e => setPassword(e.target.value)} />
                    </div>
                    <div>
                        <input name="password" type="password" placeholder="confirm password" onChange={e => setPassword(e.target.value)} />
                    </div>
                    <div>
                        <button>Sign Up</button>
                    </div>
                    {error && <span style={{color:'crimson', paddingTop: '15px'}}>Passwords must match!</span>}
                </form>
                <div className="newuser" style={{marginTop: 'auto'}}>
                    <p>Already have an account?</p><p><Link to="/" style={{textDecoration:'none', fontWeight: '800', color:'aqua'}}>Login</Link></p>
                </div>
            </div>
        </>
    )
}