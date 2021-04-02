import React, {useState, useEffect} from 'react';

import {locationBasedLookup} from '../../api/api';

const GeoWebCoordinate = require("js-geo-web-coordinate");

const GPS = () => {

    const initCoordinate = {lat: 0, lon: 0}
    const [coordinate, setCoordinate] = useState(initCoordinate);
    const [gwCoord, setGwCoord] = useState("");
    const [rootCid, setRootCid] = useState("");


    useEffect( ()=>{
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(showPosition);
        } else {
            console.log("Geolocation is not supported by this browser.");
            setCoordinate({lat: -1, lon: -1});
        }
    }, [] );


    const showPosition = (position) => {
        const {latitude, longitude} = position.coords;
        setCoordinate({lat: latitude, lon: longitude});

        const _gwCoord = GeoWebCoordinate.from_gps(longitude, latitude);
        setGwCoord(_gwCoord.toString());
        
        getRoootCid();
    }   

    const getRoootCid = async () => {
        const _rootCid = await locationBasedLookup();
        setRootCid(_rootCid);
    }


    return(
        <div>
            <span>{coordinate.lat}</span>
            <br/>
            <span>{coordinate.lon}</span>
            <br/>
            <span>{gwCoord}</span>
            <br/>
            <span>{rootCid}</span>
        </div>
    );
    
}

export default GPS;