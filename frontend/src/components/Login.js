import React, { useState, useContext } from "react";
import './login.css'
import { Link, useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import { AuthContext } from "./context/AuthContext";
import Swal from "sweetalert2";

export default () => {
    const [error, setError] = useState(false)
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    

    const navigate = useNavigate();

    const { dispatch } = useContext(AuthContext)

    const handleSubmit = e => {
        e.preventDefault();
        if (email === '' || password === '') return Swal.fire({ title: 'you must enter BOTH an email AND password', confirmButtonColor: 'crimson'}).then(() => setError(false))

        signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                // Signed in 
                const user = userCredential.user;
                dispatch({type:"LOGIN", payload: user})
                console.log(user)
                navigate('/dashboard')
            })
            .catch((error) => {
                setError(true)
            });
    }
    
    return (
        <>
            <div className="box">
                <label>Welcome!</label>
                <form onSubmit={handleSubmit}>
                    <div>
                        <input
                            placeholder="email"
                            onChange={e => setEmail(e.target.value)} 
                            onFocus={e => e.target.placeholder = ''} 
                            onBlur={e => e.target.placeholder = 'email'}
                        />
                    </div>     
                    <div>
                        <input
                            type="password"
                            placeholder="password"
                            onChange={e => setPassword(e.target.value)} 
                            onFocus={e => e.target.placeholder = ''} 
                            onBlur={e => e.target.placeholder = 'password'}
                        />
                    </div>
                <div>
                    <button type="submit">Login</button>
                </div>
                    {error && <span style={{color:'crimson', paddingTop: '15px'}}>Wrong email or password!</span>}
                </form>
                <div className="newuser" style={{marginTop: 'auto'}}>
                    <p>New User?</p><p><Link to="/signup" style={{textDecoration:'none', fontWeight: '800', color:'aqua'}}>Sign Up</Link></p>
                </div>
            </div>
        </>
    )
}