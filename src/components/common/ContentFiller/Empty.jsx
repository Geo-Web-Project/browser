import React, {useEffect, useState} from 'react';

import './styles.css';

const GWEmpty = (props) => {

    const promptType = props.promptType;

    const prompt = `Enjoy the beauty of empty space...The current land parcel holder has not added [${promptType}] content here yet.`

    return (
        <div style={{position : 'absolute'}}>
            <div className="rect-box" />
            <span className="empty-txt">
                {prompt}
            </span>
        </div>
    )

}

export default GWEmpty;