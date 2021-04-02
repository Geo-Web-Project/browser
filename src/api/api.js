import { ApolloClient, InMemoryCache } from '@apollo/client';
import { gql } from '@apollo/client';

const client = new ApolloClient({
  uri: process.env.REACT_APP_GRAPH_URI,
  cache: new InMemoryCache()
});

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

const locationBasedLookup = async () => {

    let result = await client.query({
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

export {locationBasedLookup};