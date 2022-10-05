import {
  formatValue,
  convertTimestamp,
  calcParcelBalance,
  truncateStr,
} from "./gwUtils";

//parse root ceramic id and parcel id
const parseGeo = (msg) => {
  let _geoId = { licenseOwner: null, parcelId: null };

  try {
    _geoId.parcelId = msg["data"]["geoWebCoordinate"]["parcel"]["id"];
    _geoId.licenseOwner =
      msg["data"]["geoWebCoordinate"]["parcel"]["licenseOwner"];
  } catch (e) {
    console.log(e);
  }

  return _geoId;
};

//parse parcel info document
const parseInfo = (msg, streamId) => {
  let _parcelInfo = {
    id: null,
    licensee: null,
    value: null,
    ceramicId: null,
    ceramicUri: null,
  };

  try {
    let _parcel = msg["data"]["geoWebParcel"];

    _parcelInfo.id = _parcel["id"];
    _parcelInfo.licensee = truncateStr(_parcel["licenseOwner"], 11);
    _parcelInfo.value = formatValue(
      _parcel["currentBid"]["forSalePrice"]
    );
    _parcelInfo.ceramicId = `ceramic://${truncateStr(streamId, 11)}`;
    _parcelInfo.ceramicUri = streamId;
  } catch (e) {
    console.log(e);
  }

  return _parcelInfo;
};

const parseMediaGalleryStream = (msg) => {
  let _mediaStream = null;

  try {
    _mediaStream = msg.map((itemId) => {
      return { streamId: itemId };
    });
  } catch (e) {
    console.log(e);
  }

  return _mediaStream;
};

const parseMediaContent = (data, items) => {
  let _mediaContent = null;

  try {
    if (data.length > 0)
      _mediaContent = data.map((itemId) => {
        return items[itemId]?.getStreamContent();
      });
  } catch (e) {
    console.log(e);
  }

  return _mediaContent;
};

export { parseGeo, parseInfo, parseMediaContent, parseMediaGalleryStream };
