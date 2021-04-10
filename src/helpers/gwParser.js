
import {convertTimestamp, calcParcelValue} from './gwUtils';

const parseGeo = (msg) => {

    let _geoId = {rootCId: null, parcelId: null}

    try {
        _geoId.rootCId = msg['data']['geoWebCoordinate']['landParcel']['license']['rootCID'];
        _geoId.parcelId = msg['data']['geoWebCoordinate']['landParcel']['id']
    }
    catch(e){
        console.error(e);
    }

    return _geoId;
}

const parseInfo = (msg) => {

    let _parcelInfo = {
        id: null,
        license: null,
        ceramicId: null,
        value: null,
        expiry: null
    }

    try {

        _parcelInfo.id = msg['data']['id'];
        _parcelInfo.licensee = msg['data']['license']['owner'];
        _parcelInfo.ceramicId = msg['data']['license']['rootCID'];
        _parcelInfo.value = msg['data']['license']['value'];
        _parcelInfo.expiry = convertTimestamp( msg['data']['license']['expirationTimestamp'] );
        
    }
    catch(e){
        console.error(e);
    }

    return _parcelInfo;

}

const parseContent = (msg) => {
    let _parcelContent = msg['state']['next']['content'];

    return _parcelContent;
}


export {parseGeo, parseInfo, parseContent}