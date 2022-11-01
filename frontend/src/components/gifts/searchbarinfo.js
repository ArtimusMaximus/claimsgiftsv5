import Swal from "sweetalert2"

export const searchBarInfo = () => {
    Swal.fire({
        title: 'Search By...',
        confirmButtonColor: 'crimson',
        confirmButtonText: 'Confirmed',
        html: "Filter results by: <br> <ul><li>User email</li><li>User name</li><li>Gift name</li></ul>"
    })
}