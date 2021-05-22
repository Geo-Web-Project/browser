import React, {useState, useEffect} from 'react';
import './styles.css';

//Page Layout including Title and Background 
const Layout = () => {

    return(
        <div className="layout-div">
            <div className="title-bar">
                <div className="logo" />
                <div className="title-txt">{'Geo Web'}</div>
                <div className="title-caption">{'Browse Earth'}</div>
            </div>
        </div>
    );

}

export default Layout;