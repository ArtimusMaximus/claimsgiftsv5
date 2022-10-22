import { useState } from "react";
import emailjs from '@emailjs/browser';
import './emailjs.css'


export default () => {
   
    const templateID = 'template_db6c98h'
    const publicKey = 'C0U6FhGhn-2kWm9SD'

    const [templateParams, setTemplateParams] = useState({
        from_name: 'username',
        event_name: '',
        to_email: 'bankscheesecake@yahoo.com',
        personal_message: '',
        invite_link: '',
        
    })

    const handleEmail = async () => {
        await emailjs.send('default_service', templateID, templateParams, publicKey)
            .then((res) => console.log('Success ', res.status, res.text))
            .catch(err => console.log(err))
    }



    return (
        <>
            <div className="emailjsTainer">
                <div>Invite user via email</div>
                <button onClick={handleEmail}>Send E</button>
            </div>
        </> 
    )
}