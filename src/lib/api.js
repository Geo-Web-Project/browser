import { ApolloClient, InMemoryCache } from "@apollo/client";
import { gql } from "@apollo/client";
import {
  parseGeo,
  parseInfo,
} from "../helpers/gwParser";
import {SUBGRAPH_URL } from "./constants";

const graphClient = new ApolloClient({
  uri: SUBGRAPH_URL,
  cache: new InMemoryCache(),
});

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

const getGeoId = async (lat, lon) => {
  let result = await graphClient.query({
    query: LOCATION_LOOKUP_QUERY,
    variables: { lat, lon },
  });

  let geoId = parseGeo(result);

  return geoId;
};

const getParcelInfo = async (id) => {
  let info = await graphClient.query({
    query: PARCEL_INFO_QUERY,
    variables: { id: id },
  });

  let parcelInfo = parseInfo(info);

  return parcelInfo;
};

export { getGeoId, getParcelInfo };
