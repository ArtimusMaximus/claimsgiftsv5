import { useEffect, useState } from "react";
import { doc, getDoc } from 'firebase/firestore';
import { useParams } from "react-router-dom";
import { db } from "../../firebase";
import UpdateUserName from "./UpdateUserName";
import UploadImage from "./UploadImage";
import './profilepage.css';
import Swal from "sweetalert2";


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
                    setUserInfo({ username: docSnap.data().username, img: docSnap.data().img, userEmail: docSnap.data().email })
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
               <h3>{userInfo.userEmail}</h3>
                <UploadImage userId={userId} userInfo={userInfo} />
            </div>
            <hr />
            <div className="container1">
                <UpdateUserName userId={userId} />
            </div>
            <hr />
            <div className="container1">
                <p>Delete account</p>
                <p>reset password</p>
            </div>
        </div>
        
        </>
    );
}