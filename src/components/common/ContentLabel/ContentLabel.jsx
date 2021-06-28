import React, {useState, useEffect} from 'react';

import './styles.css';

const ContentLabel = (props) => {

    const label = props.label;
    const uri = props.uri;

    return(
        <div className="label">
            <a href={uri} target="_blank" rel="noreferrer" >
                {label.substring(0,30)}
            </a>
        </div>
    );

}

export default ContentLabel;
