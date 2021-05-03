import React, {useState} from 'react';
import './styles.css';

const GWWebView = (props) => {

   //const gwWebContent = props.gwWebContent;
   const gwWebContent = "https://www.beautifulworld.com/asia/india/dal-lake/";

    return(
        <iframe src={gwWebContent} className='gwIframe' 
        referrerPolicy='allow-same-origin'></iframe>
    )
}

export default GWWebView;