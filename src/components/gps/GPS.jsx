import React, {useState, useEffect} from 'react';
import {geoLookup, parcelLookup} from '../../api/api';

const GeoWebCoordinate = require("js-geo-web-coordinate");


const GPS = () => {

    const initCoordinate = {lat: 0, lon: 0}; //default lat, lon
    const [coordinate, setCoordinate] = useState(initCoordinate);   //gps coordinates {lat, lon}
    const [gwCoord, setGwCoord] = useState(""); //geowebcoordinates as string
    const [rootCid, setRootCid] = useState(""); //rootCid

    //On Mount
    useEffect( ()=>{
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(showPosition); //Get Position, with callback
        } else {
            console.log("Geolocation is not supported by this browser.");
            setCoordinate({lat: -1, lon: -1});
        }
    }, [] );


    const showPosition = (position) => {

        const {latitude, longitude} = position.coords;
        setCoordinate({lat: latitude, lon: longitude}); //Set Lat and Lon state

        const _gwCoord = GeoWebCoordinate.from_gps(longitude, latitude);    //Convert Lon, Lat to GeoWebCoordinate
        setGwCoord(_gwCoord.toString());
        
        getRoootCid();
    }   

    const getRoootCid = async () => {
        const _rootCid = await geoLookup();
        setRootCid(_rootCid);

        getParcel('kjzl6cwe1jw147y87g1r5kxffmrzvdw9bihqergw7um43frrd9ykqet6dsu3s8s');
    }

    const getParcel = async(_docid) => {

        const _parcelData = await parcelLookup(_docid);
        console.log(_parcelData);
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
