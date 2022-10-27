import React, { useContext, useEffect, useState } from "react";
import './login.css'
import { Link, useNavigate } from "react-router-dom";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../firebase";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { AuthContext } from "./context/AuthContext";
import Swal from "sweetalert2";
import './signup.css'

export default () => {
    const navigate = useNavigate();
    const [error, setError] = useState(false)
    const [passMatchError, setPassMatchError] = useState(false)
    const [passMatchErrorMessage, setPassMatchErrorMessage] = useState('')
    const [errorMessage, setErrorMessage] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPass, setConfirmPass] = useState('')

    const errorStyles = {
        
        color:'crimson', 
        paddingTop: '15px',
        
    }

    // useEffect(() => {
       
        
    // }, [])
    
    const { dispatch } = useContext(AuthContext)

    const handleAdd = async (e) => {
        setErrorMessage('')
        e.preventDefault();

        if (email === '') {
            Swal.fire({
                title: 'An email must be provided!',
                confirmButtonColor: 'crimson',
                icon: 'info',
            })
            return
        }

        if (password !== confirmPass) {
            setPassMatchError(true)
            setPassMatchErrorMessage('Both password fields must match!')
            return
        }
        // password.length !== 6 ? setError(minLengthErrMessage) : console.log('k');
        
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

            dispatch({ type:"SIGNUP", payload: res.user })
            navigate('/dashboard')
        } catch (error) {
            console.log(error)
            setError(true)
            switch
                (error.code) {
                    case "auth/email-already-in-use":
                        setErrorMessage('This email has already been registered!')
                        break;
                    case "auth/weak-password":
                        setErrorMessage('Six character minimum password length!')
                        break;
                    default:
                        console.log('An unexpected error occured, please try again!');
                }
        }
    }

    return (
        <>
            <div className="box">
                <label>Welcome!</label>
                <p>Please sign up to continue...</p>
                <form onSubmit={handleAdd}>
                    <div>
                        <input 
                            name="email" 
                            type="email" 
                            placeholder="email" 
                            onChange={e => setEmail(e.target.value)}
                            onFocus={e => e.target.placeholder = ''} 
                            onBlur={e => e.target.placeholder = 'email'}
                            className="signLoginInputs"
                        />
                    </div>
                    <div>
                        <input className="signLoginInputs" name="password" type="password" placeholder="password" onChange={e => setPassword(e.target.value)} />
                    </div>
                    <div>
                        <input className="signLoginInputs" name="password" type="password" placeholder="confirm password" onChange={e => setConfirmPass(e.target.value)} />
                    </div>
                    <div>
                        <button>Sign Up</button>
                    </div>
                    {error && <span style={errorStyles}>{errorMessage} </span>}
                    {/* {passMatchError && <p style={errorStyles}>{errorMessage} </p>} */}
                    {passMatchError && <span style={errorStyles}>{passMatchErrorMessage} </span>}
                </form>
                <div className="newuser">
                    <p>Already have an account?</p><p><Link id="login" to="/" style={{textDecoration:'none', fontWeight: '800', color:'aqua'}}>Login</Link></p>
                </div>
            </div>
        </>
    )
}