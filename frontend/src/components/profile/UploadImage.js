import { useEffect, useState } from "react";
import { db, storage } from "../../firebase";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import blankProfile from './blank-profile.webp'
import './uploadimage.css';
import { doc, updateDoc } from "firebase/firestore";
import Swal from "sweetalert2";



export default ({ userId, userInfo }) => {
    const [file, setFile] = useState('')
    const [data, setData] = useState({})

    const userRef = doc(db, 'users', userId)
    const updateUserImg = async (downloadURL) => {
        // e.preventDefault();
        try {
            await updateDoc(userRef, {
                img: downloadURL
            })
            
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

    
    useEffect(() => {
    
    const uploadFile = () => {
        const name = new Date().getTime() + file.name
        const storageRef = ref(storage, name)

        const uploadTask = uploadBytesResumable(storageRef, file);

        uploadTask.on('state_changed', snapshot => {
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log('upload is ', progress, ' done');
            switch (snapshot.state) {
                case 'paused':
                    console.log('upload paused');
                    break;
                case 'running':
                    console.log('upload running');
                    break;
                default:
                    console.log('default');
            }
        },
        error => {
            console.log(error); // handle errors here
        },
        () => {
            // handle successful uploads here - eg download urls
            getDownloadURL(uploadTask.snapshot.ref)
                .then((downloadURL) => {
                    setData({url: downloadURL})
                    // setData here
                    updateUserImg(downloadURL);
                })
                
        })
    };

    file && uploadFile();

  
    }, [file])
    
    return (
        <>
            <div className="avatarContainer">
                <div>Choose an Avatar</div>
                <div>
                    <img src={data.url ? data.url : userInfo.img !== undefined ? userInfo.img : blankProfile} width="auto" height="125px" style={{borderRadius: '50%'}}/>
                </div>
                <label className="label">
                    <input type='file' id='file' onChange={e => setFile(e.target.files[0])}></input>
                    Upload an image...
                </label>
                
                
            </div>
            
            
        </>
    );

}
// old ternary for line 83 userInfo.img === undefined ? blankProfile : data.url ? data.url : userInfo.img