import { GiToaster } from "react-icons/gi"
import Swal from "sweetalert2"






const date = new Date(Date.now()).toLocaleString()
const d = date.split(',')[0]
export const propsDate = d.split('/')[2] + '-' + d.split('/')[0] + '-' + d.split('/')[1]

export const SignedIn = Swal.mixin({
    customClass: {
        container: 'position-absolute'
    },
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 8000,
    timerProgressBar: true,

})
