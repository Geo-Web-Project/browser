import React, {useState, useEffect} from 'react';
import Switch from '@material-ui/core/Switch';

const GWContent = () => {

    //Toggle Between Web & 3D Content
    return(
        <Switch
            defaultChecked
            color="default"
            inputProps={{ 'aria-label': 'checkbox with default color' }}
            style={{position:'relative', top: '0px'}}
        />
    );

}

export default GWContent;
