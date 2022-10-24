import { Link } from "react-router-dom";
import './editprofile.css';
import noProfilePic from './blank-profile.webp'

export default ({currentUser, userData}) => {
    // const user = currentUser.currentUser

    return (
        <>
            <div className="editProfileTainer">
                <Link to={`/dashboard/user/${currentUser.uid}`}><img src={userData.img ? userData.img : noProfilePic}></img></Link>
                <h3>{currentUser && userData.username ? userData.username : currentUser.email}</h3>
            </div>
        </>
    )
}