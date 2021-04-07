import React, {useState, useEffect} from 'react';
import {geoLookup, parcelInfoLookup, parcelContentLookup} from '../../api/api';

const GeoWebCoordinate = require("js-geo-web-coordinate");


const GPS = () => {

    const initCoordinate = {lat: 0, lon: 0}; //default lat, lon
    const [coordinate, setCoordinate] = useState(initCoordinate);   //gps coordinates {lat, lon}
    const [gwCoord, setGwCoord] = useState(""); //geowebcoordinates as string
    const [rootCid, setRootCid] = useState(""); //rootCid
    const [gwContent, SetGwContent] = useState("");

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

        const latitude = 34.114669; 
        const longitude = 74.869795;

        //const {latitude, longitude} = position.coords;
        setCoordinate({lat: latitude, lon: longitude}); //Set Lat and Lon state

        const _gwCoord = GeoWebCoordinate.from_gps(longitude, latitude);    //Convert Lon, Lat to GeoWebCoordinate
        setGwCoord(_gwCoord.toString());
        
        getRoootCid(_gwCoord.toString());
    }   

    const getRoootCid = async (id) => {
        const _rootCid = await geoLookup(id);
        setRootCid(_rootCid);
        
        let _dcid = "kjzl6cwe1jw1496nwnopkd13637zk4c46g94um9bonlaghgti5ekwsckzibd5mk";
        getParcelInfo(_dcid);
        getParcelContent(_dcid);
    }

    const getParcelInfo = async(_docid) => {
        const _parcelInfo = await parcelInfoLookup(_docid);
        console.log(_parcelInfo);
    }

    const getParcelContent = async(_docid) => {
        const _parcelData = await parcelContentLookup(_docid);
        SetGwContent(_parcelData);
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
            <br/>
            <span>{gwContent}</span>
        </div>
    );
    
}

export default GPS;
