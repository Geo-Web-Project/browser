import React, {useState, useEffect} from 'react';
import {getGeoId, getParcelInfo, getParcelContent} from '../../api/api';

import TitleBar from '../../components/common/TitleBar/TitleBar';
import GWLoader from '../../components/common/Loader/Loader';
import GWAvail from '../../components/common/ContentFiller/Avail';
import GWInfo from '../GeoWebInterface/components/GeoWebInfo/GWInfo';
import GWContent from '../GeoWebInterface/components/GeoWebContent/GWContent';

import './styles.css';

const GeoWebCoordinate = require("js-geo-web-coordinate");
const Gws_mock = require('./Gws_mock.json');


const GWS = () => {

    const initCoordinate = {lat: 0, lon: 0}; //default lat, lon
    const [coordinate, setCoordinate] = useState(initCoordinate);   //gps coordinates {lat, lon}
    const [gwCoord, setGwCoord] = useState(""); //geowebcoordinates as string
    const [rootCId, setRootCId] = useState(null); //rootCid

    const [gwInfo, setGwInfo] = useState(null);
    const [gwContent, SetGwContent] = useState(null);

    const [loading, SetLoading] = useState(true);

    //On Mount
    useEffect( ()=>{
        accessGps();
    }, [] );

    const accessGps = () => {
        
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(showPosition); //Get Position, with callback
        } 
        else {
            console.log("Geolocation is not supported by this browser.");
            setCoordinate({lat: -1, lon: -1});
        }
    }


    const showPosition = (position) => {

        SetLoading(true);

        //hard-coded coordinates for testing
        const latitude = -69.750; 
        const longitude = 71.000;

        //const {latitude, longitude} = position.coords;
        setCoordinate({lat: latitude, lon: longitude}); //Set Lat and Lon state

        const _gwCoord = GeoWebCoordinate.from_gps(longitude, latitude);    //Convert Lon, Lat to GeoWebCoordinate
        setGwCoord(_gwCoord.toString());    

        /* *******************DEMO******************* */
        const _useGws = process.env.REACT_APP_USE_GWS;

        if(_useGws === 'false')
            setPreDetermined();
        else
            getRoootCid(_gwCoord.toString());
        /* ****************************************** */
    }   

    const setPreDetermined = () => {
        setRootCId( Gws_mock.parcelInfo.ceramicUri );
        setGwInfo( Gws_mock.parcelInfo );
        SetGwContent( Gws_mock.parcelContent );

        SetLoading(false);
    }

    const getRoootCid = async (id) => {
        const lookUpId = await getGeoId(id);    //get root ceramic id and parcel id
       
        if(lookUpId.rootCId !== null) {
            setRootCId(lookUpId.rootCId);

            setParcelInfo(lookUpId.parcelId);
            setParcelContent(lookUpId.rootCId);
        }
        else{
            setRootCId(lookUpId.rootCId);
            SetLoading(false);
        }
    }

    const setParcelInfo = async(_docid) => {
        const _parcelInfo = await getParcelInfo(_docid);    //get parcel info and meta-data
        setGwInfo( _parcelInfo );
    }

    const setParcelContent = async(_docid) => {
        const _parcelData = await getParcelContent(_docid); //get parcel content
        SetGwContent( _parcelData );

        SetLoading(false);
    }

    const GeoWeb = () => {
       
        if(rootCId !== null){
            // Returns Info Expandable and Parcel Content
            return (
                <div className="layout-root">
                    <GWInfo gwInfo={gwInfo} gwContentName={gwContent?gwContent.name:""} showPosition={showPosition} />
                    <GWContent gwWebContent={gwContent?gwContent.webContent:null}
                        gwCanvasContent={gwContent?gwContent.mediaContent:null}/>
                </div>
            );
        }
        else{
            return (
                <div className="layout-root">
                    <GWInfo gwInfo={null} gwContentName={"No Parcel Found"} showPosition={showPosition} />
                    <GWAvail />
                </div>
            );
        }
    }


    return(
        <div>
            <TitleBar accessGps={accessGps} />

            { loading ? <GWLoader/> : <GeoWeb /> }

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
