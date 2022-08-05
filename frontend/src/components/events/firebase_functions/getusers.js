

export const getUserEvents = async (setData, appendedInvite, query, qtype) => {
    let list = [];
    try {
        const querySnapshot = await qtype(query);
        
        querySnapshot.forEach((doc) => {
            list.push({id: doc.id, ...doc.data(), appendedInvite})
            const d = doc.data()
            // doc.data() is never undefined for query doc snapshots
            // console.log(doc.id, " => ", d);
        });
        setData(list)
        
    } catch (error) {
        console.log(error)
    }
}