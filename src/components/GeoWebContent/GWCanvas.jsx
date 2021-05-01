import React, {useEffect, useState} from 'react';

import './styles.css';

const GWCanvas = () =>{

    let gwGateway = "https://dweb.link/ipfs/";
    let _cid= "QmSJZ2DvrLz2hBeduYiPTsSmCXViZrbj1cc2V3mud8kX6N"

    return(
        <model-viewer className='gwCanvas' src={gwGateway+_cid} alt="Lake Boat" 
            auto-rotate camera-controls>
        </model-viewer>
    );

}

export default GWCanvas;