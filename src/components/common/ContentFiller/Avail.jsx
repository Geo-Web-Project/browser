import React, {useEffect, useState} from 'react';

import './styles.css';

const GWAvail = (props) => {

    const promptType = props.promptType;

    const prompt1 = `No one has claimed a land parcel that includes your current location!
    Head over to `;
    
    const uri = 'https://cadastre.geoweb.eth.link/';

    const prompt2 = ` to claim it yourself (desktop recommended).`;


    return (
        <div style={{position : 'absolute'}}>
            <div className="avail-img" />
            <div className="empty-txt">
                <span className="txt1"> {prompt1} </span>
                <a href={uri} className="txt2"  target="_blank" rel="noreferrer" >
                    {uri}
                </a>
                <span className="txt3"> {prompt2} </span>
            </div>
            
        </div>
    )

}

export default GWAvail;
