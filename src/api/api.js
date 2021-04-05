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


const LOCATION_LOOKUP_QUERY = gql`
    query {
            geoWebCoordinate(id: "364436565199400") {
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


const geoLookup = async () => {

    let result = await graphClient.query({
        query: LOCATION_LOOKUP_QUERY
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


const parcelLookup = async(docid) => {

  const doc = await ceramic.loadDocument(docid)
  //console.log(doc); 
  return doc;

}

export {geoLookup, parcelLookup};