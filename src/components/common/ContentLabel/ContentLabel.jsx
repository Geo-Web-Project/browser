import React, {useState, useEffect} from 'react';

import './styles.css';

const ContentLabel = (props) => {

    const label = props.label;
    const uri = props.uri;

    const hyperlink = props.hyperlink;

    return(
        <div className="label">
            { hyperlink ?
                <a href={uri} target="_blank" rel="noreferrer" >
                    {label.substring(0,30)}
                </a>
                : 
                <span>{label.substring(0,30)}</span>
            }
        </div>
    );

}

export default ContentLabel;
