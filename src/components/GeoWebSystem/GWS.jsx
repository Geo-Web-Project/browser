import React, {useState, useEffect} from 'react';
import {getGeoId, getParcelInfo, getParcelContent} from '../../api/api';

import Layout from '../Layout/Layout';
import GWLoader from '../Loader/gwLoader';
import GWInfo from '../GeoWebInfo/GWInfo';
import GWContent from '../GeoWebContent/GWContent';

import './styles.css';

const GeoWebCoordinate = require("js-geo-web-coordinate");


const GWS = () => {

    const initCoordinate = {lat: 0, lon: 0}; //default lat, lon
    const [coordinate, setCoordinate] = useState(initCoordinate);   //gps coordinates {lat, lon}
    const [gwCoord, setGwCoord] = useState(""); //geowebcoordinates as string
    const [rootCId, setRootCId] = useState(""); //rootCid
    const [gwInfo, setGwInfo] = useState(null);
    const [gwContent, SetGwContent] = useState(null);

    const [loading, SetLoading] = useState(true);

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

        //hard-coded coordinates for testing
        const latitude = 34.114669; 
        const longitude = 74.869795;

        //const {latitude, longitude} = position.coords;
        setCoordinate({lat: latitude, lon: longitude}); //Set Lat and Lon state

        const _gwCoord = GeoWebCoordinate.from_gps(longitude, latitude);    //Convert Lon, Lat to GeoWebCoordinate
        setGwCoord(_gwCoord.toString());    
        
        getRoootCid(_gwCoord.toString());
    }   

    const getRoootCid = async (id) => {
        const lookUpId = await getGeoId(id);    //get root ceramic id and parcel id
        
        setRootCId(lookUpId.rootCId);

        setParcelInfo(lookUpId.parcelId);
        setParcelContent(lookUpId.rootCId);
    }

    const setParcelInfo = async(_docid) => {
        const _parcelInfo = await getParcelInfo(_docid);    //get parcel info and meta-data
        setGwInfo( _parcelInfo );
    }

    const setParcelContent = async(_docid) => {
        const _parcelData = await getParcelContent(_docid); //get parcel content
        SetGwContent( _parcelData );

        //SetLoading(false);
    }


    return(
        <div>
            <Layout />

            { loading ? <GWLoader/> : (
                <div className="layout-root">
                    <GWInfo gwInfo={gwInfo} gwContentName={gwContent?gwContent.name:""}/>
                    <GWContent gwWebContent={gwContent?gwContent.webContent:""}/>
                </div>  )
            }

            {/*Display Mock Data*/}
            {/* <div style={{position: "absolute", top: '20%', color: 'white', width:'50%'}}>
                <span>{'lat : ' + coordinate.lat}</span>
                <br/>
                <span>{'lon : ' +coordinate.lon}</span>
            </div> */}

        </div>
    );
    
}

export default GWS;
