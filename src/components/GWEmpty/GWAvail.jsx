import React, {useEffect, useState} from 'react';

import './styles.css';

const GWAvail = (props) => {

    const promptType = props.promptType;

    const prompt = `No one has claimed a land parcel that includes your current location!

    Head over to https://geoweb.eth.link/ to claim it yourself (desktop recommended).`

    return (
        <div style={{position : 'absolute'}}>
            <div className="avail-img" />
            <span className="empty-txt">
                {prompt}
            </span>
        </div>
    )

}

export default GWAvail;