import React, {useState, useEffect} from 'react';
import Switch from '@material-ui/core/Switch';

import GWWeb from './GWWeb';

const GWContent = (props) => {

    const gwWebContent= props.gwWebContent;

    //Toggle Between Web & 3D Content
    return(
        <div>
        <Switch
            defaultChecked
            color="default"
            inputProps={{ 'aria-label': 'checkbox with default color' }}
            style={{position:'absolute', top: '0px'}}
        />

        <GWWeb gwWebContent={gwWebContent} />

        </div>
    );

}

export default GWContent;
