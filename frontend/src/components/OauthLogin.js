import { getRedirectResult, signInWithRedirect, GoogleAuthProvider, signInWithPopup, sendEmailVerification, FacebookAuthProvider, OAuthProvider } from "firebase/auth";
import { doc, DocumentSnapshot, getDoc, serverTimestamp, setDoc } from "firebase/firestore";
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../firebase";
import { AuthContext } from "./context/AuthContext";
import { FcGoogle } from 'react-icons/fc'
import { HiOutlineLogin } from 'react-icons/hi';
import { AiOutlineYahoo } from 'react-icons/ai';
import { Link } from 'react-router-dom';
import Swal from "sweetalert2";
import './oauthlogin.css';



export default () => {
    const { dispatch } = useContext(AuthContext)
    const navigate = useNavigate()
    const gProvider = new GoogleAuthProvider();
    const yProvider = new OAuthProvider('yahoo.com')
    // const fbProvider = new FacebookAuthProvider();
    const [oAuthUser, setoAuthUser] = useState({})
    const [oAuthToken, setoAuthToken] = useState('')

    const checkForExistingUser = async (user) => {
        
        const userRef = doc(db, 'users', user.uid)
        const docSnap = await getDoc(userRef)
        if (docSnap.exists()) {
            // console.log('already exists!!!!!!');
            let timerInterval;
            



            navigate('/dashboard')
        } else {
            // console.log('doesnt exist yet');
            await setDoc(doc(db, 'users', user.uid), {
                email: user.email,
                emailVerified: true,
                img: user.photoURL || '',
                timeStamp: serverTimestamp(),
                username: user.displayName || '',
            })
            navigate('/dashboard')
        }
    }
    

    const redirResults = async () => {
        
        await getRedirectResult(auth)
            .then((result) => {
                // const credential = GoogleAuthProvider.credentialFromResult(result);
                // const token = credential.accessToken;
                const user = result.user;
                console.log(user);

                if (result) {
                    Swal.fire({
                        title: 'Loading...',
                        timer: 10000,
                        didOpen: () => {
                            Swal.showLoading()
                        }
                    })
                }
                
                // setoAuthToken(token);
                setoAuthUser(user);

                dispatch({ type: 'LOGIN', payload: user })

                checkForExistingUser(user);
                
            })
            .catch((error) => {
                 console.log(error.code)
                 console.log(error.message)
                 console.log(error.customData?.email)
            })
    }


    useEffect(() => {
        redirResults();
    }, [])
    

    const handleLogin = async (e) => {
        e.preventDefault()
        let authP = e.target.name
        
        try {
            switch(authP) {
                case "google":
                    await signInWithRedirect(auth, gProvider)
                    break;
                case "yahoo":
                    await signInWithRedirect(auth, yProvider)
                    break;
                default:
                    console.log('Error, try again.')
            }
            // await signInWithRedirect(auth, gProvider)
            
        } catch (error) {
            if (error) { 
                console.log(error)
            }
        }
    }
    

    return (
        <>
        <div className="oauthTainer">
            <h1 style={{marginBottom:'10px', textAlign: 'center'}}>Passwordless credentials</h1>
            
            <button className="oauthButton" name="google" onClick={e => handleLogin(e)}><FcGoogle />&nbsp;&nbsp;Google OAuth2</button>
            <button className="oauthButton" name="yahoo" onClick={e => handleLogin(e)}><AiOutlineYahoo color="purple" />&nbsp;&nbsp;yahoo! OAuth2</button>
            {/* <h1>Sign in with Facebook</h1>
            <button className="oauthButton" name="facebook" onClick={e => handleLogin(e)}><FcGoogle />&nbsp;&nbsp;Facebook OAuth2</button> */}
            <div id="noteTainer">
                <span>Note:</span>
                <span>This will redirect you to choose your email and then back to your dashboard.</span>
            </div>
            <div id="redir">
                <h4>Return to Login Page    <Link to={'/'}><HiOutlineLogin color='red' cursor={'pointer'} /></Link></h4>
            </div>
        </div>
        </>
    )
}