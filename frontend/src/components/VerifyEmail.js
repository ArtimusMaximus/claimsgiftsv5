import { useEffect } from 'react';
import { useParams } from 'react-router-dom'
import './verifyemail.css'



export default () => {
    const params = useParams();
    
    useEffect(() => {
        console.log(params.location);
    }, [])
    
    
    
    return (
        <>
            <div className="verifyTainer"><h1>Thank you for verifying your email!</h1>
                <button>Click here to continue</button>
            </div>
        </>
    )
}