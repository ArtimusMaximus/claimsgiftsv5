import './loggedout.css';
import { HiOutlineLogin } from 'react-icons/hi';
import { BiMailSend } from 'react-icons/bi'
import { Link } from 'react-router-dom';

const MailTo = ({ mailto }) => {
    return (
        <Link 
            to={'#'} 
            onClick={e => {
                window.location.href = mailto;
                e.preventDefault();
            }}
        >
            <BiMailSend color='red' cursor={'pointer'} /></Link>
    )
}





export default () => {
    return (
        <>
            <div className='hTainer'>
                <h1>Thanks for visiting Claims Gifts!</h1>
                <h2>You have successfully logged out...</h2>
                <h4>Questions comments or concerns? <MailTo mailto='mailto:claimsgifts@gmail.com' /></h4>
                <h4>Return to Login Page    <Link to={'/'}><HiOutlineLogin color='red' cursor={'pointer'} /></Link></h4>
            </div>
        </>
    )
}