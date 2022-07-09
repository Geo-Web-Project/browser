import React, {useState, useEffect} from 'react';
import {getGeoId, getParcelInfo, getParcelContent} from '../../api/api';

import TitleBar from '../../components/common/TitleBar/TitleBar';
import GWLoader from '../../components/common/Loader/Loader';
import GWAvail from '../../components/common/ContentFiller/Avail';
import GWInfo from '../GeoWebInterface/components/GeoWebInfo/GWInfo';
import GWContent from '../GeoWebInterface/components/GeoWebContent/GWContent';

import {
    NETWORK_ID,
    CERAMIC_URL,
    IPFS_BOOTSTRAP_PEER,
    IPFS_PRELOAD_NODE,
} from "../../lib/constants";

import { CeramicClient } from "@ceramicnetwork/http-client";
import { EthereumAuthProvider } from "@ceramicnetwork/blockchain-utils-linking";
//import { getResolver as getKeyResolver } from "key-did-resolver";
//import { DID } from "dids";
//import { Ed25519Provider } from "key-did-provider-ed25519";

import { useMultiAuth } from "@ceramicstudio/multiauth";

//import { Contracts } from "@geo-web/sdk/dist/contract/types";

import { getIpfs, providers } from "ipfs-provider";
//import { IPFS } from "ipfs-core";

import { useBasicProfileStreamManager } from "../../lib/stream-managers/BasicProfileStreamManager";

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

    const [parcelIndexStreamId, setParcelIndexStreamId] = useState(null);

    const [assetContentManager, setAssetContentManager] = useState(null);

    const basicProfileStreamManager = useBasicProfileStreamManager(assetContentManager);

    const parcelContent = basicProfileStreamManager ? basicProfileStreamManager.getStreamContent() : null;

    const ceramic = new CeramicClient(CERAMIC_URL);
    //const didProvider = new Ed25519Provider(sessionSeed);

    /*
    const didKey = new DID({
      provider: didProvider,
      resolver: {
        ...getKeyResolver(),
      },
      parent: `did:pkh:${accountId.toString()}`,
    });
    await didKey.authenticate();

    // Check or request capability from user
    
    const cacao = await getOrSetCacao(
      didKey,
      accountId,
      authState.connected.provider.state.provider
    );

    const didKeyWithCap = didKey.withCapability(cacao);
    await didKeyWithCap.authenticate();

    ceramic.did = didKeyWithCap;
    setCeramic(ceramic);
    */

    //On Mount
    useEffect( ()=>{
        accessGps();
    }, [] );

    useEffect(() => {
        (async () => {
          if (ceramic == null || !ceramic.did) {
            console.error("Ceramic instance not found");
            return;
          }
    
          setAssetContentManager(null);
    
          if (selectedParcelId && licenseOwner) {
            const assetId = new AssetId({
              chainId: `eip155:${NETWORK_ID}`,
              assetName: {
                namespace: "erc721",
                reference: licenseContract.address.toLowerCase(),
              },
              tokenId: new BN(selectedParcelId.slice(2), "hex").toString(10),
            });
    
            const accountId = new AccountId({
              chainId: `eip155:${NETWORK_ID}`,
              address: licenseOwner,
            });
    
            const model = new DataModel({
              ceramic,
              aliases: GeoWebModel,
            });
    
            const _assetContentManager = new AssetContentManager(
              ceramic,
              model,
              `did:pkh:${accountId.toString()}`,
              assetId
            );
            setAssetContentManager(_assetContentManager);
    
            const doc = await _assetContentManager.getIndex();
            setParcelIndexStreamId(doc.id.toString());
          } else {
            setAssetContentManager(null);
            setParcelIndexStreamId(null);
          }
        })();
      }, [ceramic, selectedParcelId, licenseOwner]);

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
        // Mt. Rainer
        //const latitude = 46.785802;
        //const longitude = -121.735557;

        //Doge Pool
        //const latitude = 12.823911;
        //const longitude = 80.075334;

        //const latitude = 0;
        //const longitude = 0;

        const {latitude, longitude} = position.coords;
        setCoordinate({lat: latitude, lon: longitude}); //Set Lat and Lon state
        
        const _gwCoord = GeoWebCoordinate.from_gps(longitude, latitude);    //Convert Lon, Lat to GeoWebCoordinate
        setGwCoord(_gwCoord.toString());    

        /* *******************DEMO******************* */
        const _useGws = process.env.REACT_APP_USE_GWS;

        if(_useGws === 'false')
            setPreDetermined();
        else
            getParcelId(_gwCoord.toString());
        /* ****************************************** */
    }   

    const setPreDetermined = () => {
        setRootCId( Gws_mock.parcelInfo.ceramicUri );
        setGwInfo( Gws_mock.parcelInfo );
        SetGwContent( Gws_mock.parcelContent );
        //setParcelContent(Gws_mock.parcelInfo.ceramicUri);

        SetLoading(false);
    }

    const getParcelId = async (id) => {

        const lookUpId = await getGeoId(id);    //get root parcel id
       
        if(lookUpId.rootCId !== null) {
            //setRootCId(lookUpId.rootCId);

            setParcelInfo(lookUpId.parcelId);
            setParcelContent(lookUpId.rootCId);
        }
        else{
            setRootCId(lookUpId.rootCId);
            SetLoading(false);
        }
    }

    const setRootCid = async() => {

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
                    <GWInfo gwInfo={gwInfo} gwContentName={gwContent?gwContent.name:""} />
                    <GWContent gwWebContent={gwContent?gwContent.webContent:null}
                        gwCanvasContent={gwContent?gwContent.mediaContent:null}/>
                </div>
            );
        }
        else{
            return (
                <div className="layout-root">
                    <GWInfo gwInfo={null} gwContentName={"No Parcel Found"} />
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
