//  Imports
import { ApolloClient, InMemoryCache } from "@apollo/client";
import { gql } from "@apollo/client";

import CeramicClient from "@ceramicnetwork/http-client";

import {
  parseGeo,
  parseInfo,
  parseContent,
  parseMediaContent,
  parseMediaGalleryStream,
} from "../helpers/gwParser";

//  Refer Environment Variables
const GRAPH_URL = process.env.NEXT_PUBLIC_GRAPH_URI;
const CERAMIC_URL = process.env.NEXT_PUBLIC_CERAMIC_URI;

//  Instantiate Apollo & Ceramic Clients
const graphClient = new ApolloClient({
  uri: GRAPH_URL,
  cache: new InMemoryCache(),
});

const ceramic = new CeramicClient(CERAMIC_URL);

//  GraphQL Queries
const LOCATION_LOOKUP_QUERY = gql`
  query GeoWebParcels($lat: String $lon: String) {
    geoWebParcels(
      where: {
        bboxE_gte: $lon
        bboxW_lte: $lon
        bboxS_lte: $lat
        bboxN_gte: $lat
      }
    ) {
      id
      licenseOwner
    }
  }
`;

const PARCEL_INFO_QUERY = gql`
  query Parcel($id: String) {
    geoWebParcel(id: $id) {
      id
      licenseOwner
      currentBid {
        forSalePrice
      }
    }
  }
`;

//  Get Ceramic, parcel IDs
const getGeoId = async (lat, lon) => {
  let result = await graphClient.query({
    query: LOCATION_LOOKUP_QUERY,
    variables: { lat, lon },
  });

  let geoId = parseGeo(result);

  return geoId;
};

//  Get Parcel Info
//  input: parcelId (Eg: '0x2D')
//  output: {  id: , licensee: , value: , ceramicId: , ceramicUri:}
const getParcelInfo = async (id, streamId) => {
  let info = await graphClient.query({
    query: PARCEL_INFO_QUERY,
    variables: { id: id },
  });

  let parcelInfo = parseInfo(info, streamId);

  return parcelInfo;
};

export { getGeoId, getParcelInfo };
