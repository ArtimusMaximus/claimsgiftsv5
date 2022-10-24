import './loggedout.css';
import { HiOutlineLogin } from 'react-icons/hi';
import { BiMailSend } from 'react-icons/bi'
import { Link } from 'react-router-dom';



export default () => {
    return (
        <>
            <div className='hTainer'>
                <h1>Thanks for visiting Claims Gifts!</h1>
                <h2>You have successfully logged out...</h2>
                <h4>Invite a friend</h4>
                <h4>Questions comments or concerns? <Link to={'mailto:'}><BiMailSend color='red' cursor={'pointer'} /></Link></h4>
                <h4>Return to Login Page    <Link to={'/login'}><HiOutlineLogin color='red' cursor={'pointer'} /></Link></h4>
            </div>
        </>
    )
}