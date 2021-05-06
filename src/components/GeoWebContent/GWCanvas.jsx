import React, {useEffect, useState} from 'react';
import GWEmpty from '../GWEmpty/GWEmpty';

import './styles.css';

const GWCanvas = () =>{

    let gwGateway = "https://dweb.link/ipfs/";

    //const mediaData = [{ name: 'Lake Boat',
    //                     src: 'QmSJZ2DvrLz2hBeduYiPTsSmCXViZrbj1cc2V3mud8kX6N'
    //}];

    const mediaData = null;

    if(mediaData !== null) {
        return(
            <model-viewer className='gwCanvas' src={gwGateway+mediaData[0].src} 
                alt="Lake Boat" auto-rotate camera-controls>
            </model-viewer>
        );
    }
    else {
        return <GWEmpty promptType='gallery' />
    }

}

export default GWCanvas;