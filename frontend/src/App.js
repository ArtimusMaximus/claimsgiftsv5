import './App.css';
import Navbar from './components/Navbar';
import { Outlet, useParams } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth } from './firebase';
import { useNavigate, useLocation } from 'react-router-dom';
import { useContext, useEffect } from 'react';
import { AuthContext } from './components/context/AuthContext';



function App() {
console.log('~ V 10 27 2022 ~')

  const location = useLocation()
  const navigate = useNavigate()
  const { id } = useParams()
  

  useEffect(() => {
    // if (id !== to userEvents) { redirect to 'an event with this id does not exist' page?}
   
  }, [])
  

  const { dispatch } = useContext(AuthContext)


  const logOut = async () => {
    
    await signOut(auth).then(() => {
      console.log('Successfully logged out!');

      dispatch({ type: 'LOGOUT' })
      
      navigate('/departure')
    })
    .catch((error) => console.log(error))
  }
  
  if (location.pathname === '/logout') logOut()

  return (
    <>
      <Navbar />
      <div className='content-container'> {/*containers for bg's */}
        <div className='content-container2'>
        
          <Outlet />
        </div>
      </div>
    </>
  );
}

export default App;
