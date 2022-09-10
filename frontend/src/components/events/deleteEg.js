import Swal from "sweetalert2"


export const deleteEg = async (itemNames, eg, itemValue) => {
    
    const { value: item } = await Swal.fire({
        title: `Please select ${eg} to remove!`,
        confirmButtonColor: 'crimson',
        input: 'select',
        inputOptions: {
            'Item to remove':
            {...itemNames}
        },
        inputPlaceholder: `Your choices...`
    })
    if (item) {
        itemValue = item

        return item
    }


    
}

// const handleInviteClick = async () => {
//     const eventNames = docData.map(i => i.events.eventName)

//     const { value: event } = await Swal.fire({
//         title: 'Please select event to share:',
//         confirmButtonColor: 'pink',
//         input: 'select',
//         inputOptions: {
//             'Events':
//                 {...eventNames}
//         },
//         inputPlaceholder: 'Your events...'
//     })
//     if (event) {
//         const eName = docData[event].events.eventName
//         const eDate = docData[event].events.eventDate
//         const eventId = docData[event].id
//         const { value: inviteeEmail } = await Swal.fire({
//             title: `Share event "${eName}" with:`,
//             confirmButtonColor: 'pink',
//             input: 'email',
//             inputLabel: '',
//             inputPlaceholder: 'Invitee\'s email'
//         })
//         if (inviteeEmail) {
//             Swal.fire({
//                 title: `Invitation sent to ${inviteeEmail}'s message center.`,
//                 confirmButtonColor: 'pink'
//             })
//             .then((result) => console.log(result.isConfirmed))
//             .then(() => setDidInvite(prev => !prev))
//             .then(() => addDoc(collection(db, "invites"), {
//                 invitee: inviteeEmail.trim().toLowerCase(),
//                 event: eName,
//                 invitedBy: userEmail,
//                 eventDate: eDate,
//                 eventId: eventId
//             }))
//             .then((data) => console.log(data))
//             .catch((err) => console.log(err))
//         }

        
//     } 
// }