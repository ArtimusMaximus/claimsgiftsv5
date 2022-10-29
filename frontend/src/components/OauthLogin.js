import { getRedirectResult, signInWithRedirect, GoogleAuthProvider, signInWithPopup, sendEmailVerification, FacebookAuthProvider } from "firebase/auth";
import { doc, DocumentSnapshot, getDoc, serverTimestamp, setDoc } from "firebase/firestore";
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../firebase";
import { AuthContext } from "./context/AuthContext";
import { FcGoogle } from 'react-icons/fc'
import './oauthlogin.css';
import Swal from "sweetalert2";




export default () => {
    const { dispatch } = useContext(AuthContext)
    const navigate = useNavigate()
    const gProvider = new GoogleAuthProvider();
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
                const credential = GoogleAuthProvider.credentialFromResult(result);
                const token = credential.accessToken;
                const user = result.user;

                if (result) {
                    Swal.fire({
                        title: 'Loading...',
                        timer: 1000,
                        didOpen: () => {
                            Swal.showLoading()
                        }
                    })
                }
                
                setoAuthToken(token);
                setoAuthUser(user);

                dispatch({ type: 'LOGIN', payload: user })

                checkForExistingUser(user);

            })
            .catch((error) => {
                //  console.log(error.code)
                //  console.log(error.message)
                //  console.log(error.customData?.email)
            })
    }

    useEffect(() => {
        redirResults();
    }, [])
    

    const handleLogin = async (e) => {
        e.preventDefault()
        // let authP = e.target.name
        
        try {
            // switch(authP) {
            //     case "google":
            //         await signInWithRedirect(auth, gProvider)
            //         break;
            //     case "facebook":
            //         await signInWithRedirect(auth, fbProvider)
            //         break;
            //     default:
            //         console.log('Error, try again.')
            // }
            await signInWithRedirect(auth, gProvider)
            
        } catch (error) {
            if (error) { 
                console.log(error)
            }
        }
    }
    

    return (
        <>
        <div className="oauthTainer">
            <h1>Sign in with Google</h1>
            <button className="oauthButton" name="google" onClick={e => handleLogin(e)}><FcGoogle />&nbsp;&nbsp;Google OAuth2</button>
            {/* <h1>Sign in with Facebook</h1>
            <button className="oauthButton" name="facebook" onClick={e => handleLogin(e)}><FcGoogle />&nbsp;&nbsp;Facebook OAuth2</button> */}
            <div id="noteTainer">
                <span>Note:</span>
                <span>This will redirect you to choose your email and then back to your dashboard.</span>
            </div>
        </div>
        </>
    )
}