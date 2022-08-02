import React, { useContext, useEffect, useState, useRef } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { doc, getDoc, getDocs, where, query, collection } from "firebase/firestore";
import { db } from '../../../firebase';
import Events from '../Events';
import { Link } from 'react-router-dom';


export default () => {
    const currentUser = useContext(AuthContext)
    const user = currentUser.currentUser
    const [docData, setDocData] = useState([])
    
    
    const docRef = doc(db, 'events', user.uid)

    const q = query(collection(db, "events"), where("events.eventRef", "==", user.uid));

    useEffect(() => {
        const getUserEvents = async () => {
            let list = [];
            try {
                const querySnapshot = await getDocs(q);
                
                querySnapshot.forEach((doc) => {
                    list.push({id: doc.id, ...doc.data()})
                    const d = doc.data()
                    // doc.data() is never undefined for query doc snapshots
                    console.log(doc.id, " => ", d);
                });
                setDocData(list)
                
                
            } catch (error) {
                console.log(error)
            }
        }
    
        getUserEvents()
        
    }, [])

    console.log(docData.length);

    return (
        <>
            
        </>
    )
}