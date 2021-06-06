import React, {useState, useEffect} from 'react';
import './styles.css';

//Page Layout including Title and Background 
const TitleBar = (props) => {

    const accessGps = props.accessGps;

    return(
        <div className="layout-div">
            <div className="title-bar">
                <div className="logo" />
                <div className="title-txt">{'Geo Web'}</div>
                <div className="title-caption">{'Browse Earth'}</div>
                <div className="gps-location" onClick={()=>accessGps()}></div>
            </div>
        </div>
    );

}

export default TitleBar;