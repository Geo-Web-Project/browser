import React, {useState, useEffect} from 'react';
import Switch from '@material-ui/core/Switch';
import Typography from '@material-ui/core/Typography';

import GWWebView from './GWWebView';


import './styles.css'
import GWCanvas from './GWCanvas';

const GWContent = (props) => {

    const gwWebContent= props.gwWebContent;

    //Toggle Between Web & 3D Content
    return(
        <div>
            <div className='switch-div'>
                <Typography className='switch-left'>{'Web'}</Typography>
                <Switch
                    color="default"
                    inputProps={{ 'aria-label': 'checkbox with default color' }}
                    style={{position:'absolute', top: '0px'}}
                />
                <Typography className='switch-right'>{'3D'}</Typography>
            </div>

        {/* <GWWebView gwWebContent={gwWebContent} /> */}
        <GWCanvas />

        </div>
    );

}

export default GWContent;
