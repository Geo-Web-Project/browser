import React, {useState, useEffect} from 'react';
import './styles.css';

const Layout = () => {

    return(
        <div className="layout-div">
            <div className="title-bar">
                <div className="logo" />
                <div className="title-txt">{'Geo Web'}</div>
                <div className="title-caption">{'Browse Earth'}</div>
            </div>
            <div className="bg-img" />
        </div>
    );

}

export default Layout;