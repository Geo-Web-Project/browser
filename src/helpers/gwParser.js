
import { formatValue, convertTimestamp, calcParcelBalance, truncateStr} from './gwUtils';

//parse root ceramic id and parcel id
const parseGeo = (msg) => {

    let _geoId = {rootCId: null, parcelId: null}
    
    try {
        _geoId.rootCId = msg['data']['geoWebCoordinate']['landParcel']['license']['rootCID'];
        _geoId.parcelId = msg['data']['geoWebCoordinate']['landParcel']['id']
    }
    catch(e){
        console.log(e);
    }

    return _geoId;
}

//parse parcel info document
const parseInfo = (msg) => {

    let _parcelInfo = {
        id: null,
        licensee: null,
        value: null,
        expiry: null,
        balance: null,
        ceramicId: null,
        ceramicUri: null,
    }
    
    try {
       
        let _landParcel = msg['data']['landParcel'];
        let _license = _landParcel['license']; 

        _parcelInfo.id = _landParcel['id'];
        _parcelInfo.licensee = truncateStr(_license['owner'], 11);
        _parcelInfo.value = formatValue(_license['value']);
        _parcelInfo.expiry = convertTimestamp( _license['expirationTimestamp'] );
        _parcelInfo.balance = calcParcelBalance(_license['expirationTimestamp'], _license['value']);
        _parcelInfo.ceramicId = `ceramic://${truncateStr(_license['rootCID'], 11)}`;
        _parcelInfo.ceramicUri = _license['rootCID'];

    }
    catch(e){
        console.log(e);
    }

    return _parcelInfo;

}

//parse parcel content document
const parseContent = (msg) => {

    let _parcelContent = {
        name: null,
        webContent: null,
        mediaContent: null
    }
    
    try {
        _parcelContent = msg.content;
    }
    catch(e){
        console.log(e);
    }

    return _parcelContent;
}


export {parseGeo, parseInfo, parseContent}