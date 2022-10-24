import { getRedirectResult, signInWithRedirect, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { doc, serverTimestamp, setDoc } from "firebase/firestore";
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../firebase";
import { AuthContext } from "./context/AuthContext";
import { FcGoogle } from 'react-icons/fc'
import './oauthlogin.css';




export default () => {
    const { dispatch } = useContext(AuthContext)
    const navigate = useNavigate()
    const provider = new GoogleAuthProvider();
    const [oAuthUser, setoAuthUser] = useState({})
    const [oAuthToken, setoAuthToken] = useState('')

    const redirResults = async () => {
        return getRedirectResult(auth)
            .then((result) => {
                const credential = GoogleAuthProvider.credentialFromResult(result);
                const token = credential.accessToken;
                const user = result.user
                setoAuthToken(token)
                setoAuthUser(user)

                dispatch({ type: 'LOGIN', payload: user })

                setDoc(doc(db, 'users', user.uid), {
                    email: user.email,
                    img: user.photoURL || '',
                    timeStamp: serverTimestamp(),
                    username: user.displayName || ''
                })
                navigate('/dashboard')
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



    console.log(oAuthUser);
    console.log(oAuthToken);
    


    const handleLogin = async () => {
        try {
            await signInWithRedirect(auth, provider)
        } catch (error) {
            if (error) { 
                console.log(error)
            }
        }
    }
    


    return (
        <>
        <div className="oauthtainer">
            <h1>Sign in with Google</h1>
            <button id="oauthButton" onClick={handleLogin}><FcGoogle />&nbsp;&nbsp;Google OAuth2</button>
            <div id="noteTainer">
                <span>Note:</span>
                <span>This will redirect you to choose your email and redirect you back to your dashboard.</span>
            </div>
        </div>
        </>
    )
}