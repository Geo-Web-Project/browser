import React, {useEffect, useState} from 'react';
import GWEmpty from '../GWEmpty/GWEmpty';

import './styles.css';

const gwGateway = process.env.REACT_APP_IPFS_GATEWAY;

const GWCanvas = (props) =>{
    
    const gwCanvasContent = props.gwCanvasContent;

    if(gwCanvasContent !== null) {
        return(
            <model-viewer className='gwCanvas' src={gwGateway+gwCanvasContent[0].contentUrl} 
                shadow-intensity="1" ar ar-modes="webxr scene-viewer quick-look"  
                auto-rotate camera-controls alt="Lake Boat">
                
                <button slot="ar-button" id="ar-button" />

                <div id="ar-prompt">
                    <img id="ar-prompt-img" />
                </div>

                <button id="ar-failure">
                    AR is not tracking!
                </button>

            </model-viewer>
        );
    }
    else {
        return <GWEmpty promptType='gallery' />
    }

}

export default GWCanvas;