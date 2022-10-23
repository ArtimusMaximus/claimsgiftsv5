import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import { AuthContext } from "./context/AuthContext";
import './login.css'
import Swal from "sweetalert2";

export default () => {
    const [error, setError] = useState(false)
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    

    const navigate = useNavigate();

    const { dispatch } = useContext(AuthContext)

    const handleSubmit = e => {
        e.preventDefault();
        if (email === '' || password === '') return Swal.fire({ title: 'you must enter both an email and password', confirmButtonColor: 'crimson'}).then(() => setError(false))

        signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                // Signed in 
                const user = userCredential.user;
                dispatch({type:"LOGIN", payload: user})
                
                navigate('/dashboard')
            })
            .catch((error) => {
                setError(true)
                console.log(error);
            });
    }
    
    return (
        <>
            <div className="box">
                <label>Welcome!</label>
                <p>Please login to continue...</p>
                <form onSubmit={handleSubmit}>
                    <div>
                        <input
                            placeholder="email"
                            onChange={e => setEmail(e.target.value)} 
                            onFocus={e => e.target.placeholder = ''} 
                            onBlur={e => e.target.placeholder = 'email'}
                            className="signLoginInputs"
                        />
                    </div>     
                    <div>
                        <input
                            type="password"
                            placeholder="password"
                            onChange={e => setPassword(e.target.value)} 
                            onFocus={e => e.target.placeholder = ''} 
                            onBlur={e => e.target.placeholder = 'password'}
                            className="signLoginInputs"
                        />
                    </div>
                <div>
                    <button type="submit" className="btnInvert">Login</button>
                </div>
                    {error && <span style={{color:'crimson', paddingTop: '15px'}}>Wrong email or password!</span>}
                </form>
                <div className="newuser">
                    <p>New User?</p><p><Link id="signup" to="/signup" style={{textDecoration:'none', fontWeight: '800', color:'aqua'}}>Sign Up</Link></p>
                </div>
            </div>
        </>
    )
}