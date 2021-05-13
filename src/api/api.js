
//  Imports
import { ApolloClient, InMemoryCache } from '@apollo/client';
import { gql } from '@apollo/client';

import CeramicClient from '@ceramicnetwork/http-client';

import {parseGeo, parseInfo, parseContent} from '../helpers/gwParser';

//  Refer Environment Variables
const GRAPH_URL = process.env.REACT_APP_GRAPH_URI;
const CERAMIC_URL = process.env.REACT_APP_CERAMIC_URI;


//  Instantiate Apollo & Ceramic Clients
const graphClient = new ApolloClient({
  uri: GRAPH_URL,
  cache: new InMemoryCache()
});

const ceramic = new CeramicClient(CERAMIC_URL)


//  GraphQL Queries
const LOCATION_LOOKUP_QUERY = 
  gql`
    query GeoWebCoordinate($id: String){
      geoWebCoordinate(id: $id) {
      id
      landParcel {
          id
          license {
            id
            rootCID
          }
        }
      }
    }`

const PARCEL_INFO_QUERY = 
  gql`
    query LandParcel($id: String) {
      landParcel(id: $id) {
        id
        license {
          rootCID
          owner
          value
          expirationTimestamp
        }
      }
    }`
  

//  Get Ceramic, parcel IDs 
const getGeoId = async (id) => {

    let result = await graphClient.query({
        query: LOCATION_LOOKUP_QUERY,
        variables:{id: id}
    })
    
    let geoId = parseGeo(result);
    
    return geoId;
}

//  Get Parcel Info 
//  input: parcelId (Eg: '0x2D')
//  output: {  id: , license: , ceramicId: , value: , expiry: }
const getParcelInfo = async(id) => {

  let info = await graphClient.query({
    query: PARCEL_INFO_QUERY,
    variables: {id: id}
  })

  let parcelInfo = parseInfo(info);

  return parcelInfo;

}

const getParcelContent = async(docid) => {

  let doc = null;
  
  try{
    doc = await ceramic.loadStream(docid);
  }
  catch(e){
    console.log(e);
  }

  let parcelContent = parseContent(doc);
  
  /*
  // const queries = [{
  //   docId: 'kjzl6cwe1jw...14',
  //   paths: ['/state/content', '/b/c']
  // }]
  // const docMap = await ceramic.multiQuery(queries)
  */

  return parcelContent; 

}


export {getGeoId, getParcelInfo, getParcelContent};
