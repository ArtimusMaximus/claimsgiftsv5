import './App.css';
import Navbar from './components/Navbar';
import { Outlet, Route, Routes } from 'react-router-dom';
import { getAuth, signOut } from 'firebase/auth';
import { useNavigate, useLocation } from 'react-router-dom';


function App() {
  const location = useLocation()
  const navigate = useNavigate()

  const logOut = async () => {
    const auth = getAuth()
    await signOut(auth).then(() => {
      console.log('Successfully logged out!');
      navigate('/')
    })
    .catch((error) => console.log(error))
  }
  
  if (location.pathname === '/logout') logOut()

  return (
    <>
    
      <Navbar />
      <div className='content-container'>

        <Outlet />
      </div>
    </>
  );
}

export default App;
