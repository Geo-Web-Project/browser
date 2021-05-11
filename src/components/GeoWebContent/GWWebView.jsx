import React, {useState} from 'react';
import './styles.css';

import GWEmpty from '../GWEmpty/GWEmpty';

const GWWebView = (props) => {

   const gwWebContent = props.gwWebContent;

   if(gwWebContent !== null) {
        return(
            < iframe src={gwWebContent} className='gwIframe' 
                referrerPolicy='allow-same-origin' />
        )
   }
   else {
       return <GWEmpty promptType='web' />
   }
}

export default GWWebView;