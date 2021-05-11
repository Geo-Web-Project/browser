import React, {useEffect, useState} from 'react';
import GWEmpty from '../GWEmpty/GWEmpty';

import './styles.css';

const gwGateway = process.env.REACT_APP_IPFS_GATEWAY;

const GWCanvas = (props) =>{
    
    const gwCanvasContent = props.gwCanvasContent;

    if(gwCanvasContent !== null) {
        return(
            <model-viewer className='gwCanvas' src={gwGateway+gwCanvasContent[0].contentUrl} 
                alt="Lake Boat" auto-rotate camera-controls>
            </model-viewer>
        );
    }
    else {
        return <GWEmpty promptType='gallery' />
    }

}

export default GWCanvas;