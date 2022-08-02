// const eventId = 'D7077jsIms7bD6HhNxV2'
// const userRef = doc(db, 'users', currentUser.currentUser.uid, 'events', eventId)
// this worked with adding an events object array to an event specified 

export const handleSubmitGifts = async e => {
    e.preventDefault();
    try {
        // setDoc(doc(db, 'cities')) is when you provide your own ID item (3rd arg)
        await updateDoc(userRef, {
            gifts: arrayUnion({eventName: eventName, eventDate: eventDate, eventOwner: eventOwner})
        })
        console.log(userRef)
    } catch (error) {
        console.log(error)
    }
}

export const handleSubmitUpdateDoc = async e => {
    e.preventDefault();
    
    try {
        const ref = await updateDoc(docRef, {
            eventName: eventName,
            eventDate: eventDate,
            eventOwner: eventOwner
        })
        console.log(ref);
    } catch (error) {
        console.log(error)
    }
}