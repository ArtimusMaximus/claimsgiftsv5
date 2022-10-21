import { useEffect, useState } from "react";
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { useNavigate, useParams } from "react-router-dom";
import { db } from "../../firebase";
import UpdateUserName from "./UpdateUserName";
import UploadImage from "./UploadImage";
import './profilepage.css';

export default () => {
    const params = useParams();
    const userId = params.profile;
    const userRef = doc(db, 'users', userId);
    

    const [userInfo, setUserInfo] = useState({})

    useEffect(() => {
        
        const getUserInfo = async () => {
            const docSnap = await getDoc(userRef)
            if (docSnap.exists()) {
                console.log('Document data: ', docSnap.data())
                setUserInfo({ username: docSnap.data().username, img: docSnap.data().img})
            } else {
                console.log('no data for this user');
            }
        }
        getUserInfo();

    }, [])
    console.log('user Info', userInfo);
    

    return (
        <>
            <div className="container">
                <UploadImage userId={userId} userInfo={userInfo} />
            </div>
            <div className="container1">
                <UpdateUserName userId={userId} />
            </div>
        </>
    );
}