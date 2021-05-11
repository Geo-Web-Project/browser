import React, {useState, useEffect} from 'react';

import './styles.css';

const GWLoader = () => {

    return(

        <div className="lds-ripple">
            <div></div>
            <div></div>
        </div>

    );
}

export default GWLoader;