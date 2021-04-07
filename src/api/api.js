import { ApolloClient, InMemoryCache } from '@apollo/client';
import { gql } from '@apollo/client';

import CeramicClient from '@ceramicnetwork/http-client'


const GRAPH_URL = process.env.REACT_APP_GRAPH_URI;
const CERAMIC_URL = process.env.REACT_APP_CERAMIC_URI;


const graphClient = new ApolloClient({
  uri: GRAPH_URL,
  cache: new InMemoryCache()
});

const ceramic = new CeramicClient(CERAMIC_URL)


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
  

const geoLookup = async (id) => {

    let result = await graphClient.query({
        query: LOCATION_LOOKUP_QUERY,
        variables:{id: id}
    })
   
    let rootCID = ""

    try {
      rootCID = result['data']['geoWebCoordinate']['landParcel']['license']['rootCID'];
    }
    catch(e){
        console.error(e);
    }
    
    return rootCID;
}

const parcelInfoLookup = async(id) => {

  let result = await graphClient.query({
    query: PARCEL_INFO_QUERY,
    variables: {id: id}
  })

  return result;

  let rootCID = ""

  try {
    rootCID = result['state']['content']['landParcel']['license']['rootCID'];
  }
  catch(e){
      console.error(e);
  }

  return rootCID;
}

const parcelContentLookup = async(docid) => {

  const doc = await ceramic.loadDocument(docid)
  let parcelContent = "";
  try {
    parcelContent = JSON.stringify(doc['state']['content']);
  }
  catch(e){
      console.error(e);
  }

  return parcelContent; 

}

export {geoLookup, parcelInfoLookup, parcelContentLookup};