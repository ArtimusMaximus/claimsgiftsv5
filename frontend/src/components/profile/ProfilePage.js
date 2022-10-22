import { useEffect, useState } from "react";
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { useNavigate, useParams } from "react-router-dom";
import { db } from "../../firebase";
import UpdateUserName from "./UpdateUserName";
import UploadImage from "./UploadImage";
import './profilepage.css';
import Swal from "sweetalert2";
import Emailjs from "../emailjs/Emailjs";

export default () => {
    const params = useParams();
    const userId = params.profile;
    const userRef = doc(db, 'users', userId);
    const [userInfo, setUserInfo] = useState({})

    useEffect(() => {
        
        const getUserInfo = async () => {
            const docSnap = await getDoc(userRef)

            try {
                if (docSnap.exists()) {
                    setUserInfo({ username: docSnap.data().username, img: docSnap.data().img })
                }
            } catch(error) {
                if (error) {
                    Swal.fire({
                        title: 'Error',
                        text: 'Please try again!',
                        confirmButtonColor: 'crimson'
                    })
                }
                
            }

        }
        getUserInfo();

    }, [])
    
    

    return (
        <>
        <div className="containAll">
            <div className="container">
                <UploadImage userId={userId} userInfo={userInfo} />
            </div>
            <div className="container1">
                <UpdateUserName userId={userId} />
            </div>
        </div>
        
        </>
    );
}