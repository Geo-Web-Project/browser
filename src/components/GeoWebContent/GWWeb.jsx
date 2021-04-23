import React, {useState} from 'react';
import './styles.css';

const GWWeb = (props) => {

   // const gwWebContent = props.gwWebContent;
    const gwWebContent = "https://wikipedia.org"

    return(
        <iframe src={gwWebContent} className='gwIframe' 
        referrerPolicy='allow-same-origin'></iframe>
    )
}

export default GWWeb;