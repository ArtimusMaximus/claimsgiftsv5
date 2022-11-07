import React, { useContext } from 'react';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import { AuthContext } from './context/AuthContext';
import { IoMdLogOut } from 'react-icons/io';
import { HiOutlineLogin } from 'react-icons/hi';
import './navbar.css'

 // me-auto nav classname
export default () => {
    const currentUser = useContext(AuthContext);
    const user = currentUser.currentUser;
    const location = useLocation();
    const params = useParams()
    let navigate = useNavigate();
    const lP = location.pathname
    // console.log(params, lP);
    

    return (
        <>
           <div className='navbar'>
                <div className='navtainer'>
                <span className='navbarlinks'>             <Link to={lP === '/departure' ? "/" : "#"} style={{textDecoration: 'none', color: 'White'}}><h3>Claims Gifts</h3><h5>Alpha</h5></Link></span>
                {lP === '/dashboard' && <span><Link className='navbarlinks' to={'/about'}>Info</Link></span>}
                {lP !== '/dashboard' && user       && lP !== '/departure' && lP !== '/' && lP !== '/oauth'  && lP !== '/signup' && <Link to="/dashboard" className='navbarlinks'>Dashboard</Link>}
                {lP !== '/signup'    && lP !== '/' && lP !== '/departure' && lP !== '/' && lP !== '/oauth'  &&                     <Link to="/logout" className='navbarlogout'>Logout <IoMdLogOut style={{display: 'inlineFlex', alignItems: 'center'}} size={'20px'} /></Link>}
                {lP === '/departure' &&                    <Link style={{textDecoration: 'none', color: 'White', marginLeft:'25px'}} to={'/'}><h3>Login    <HiOutlineLogin color='white' cursor={'pointer'} /></h3></Link>}
                </div>
            </div>
        </>
    )
}