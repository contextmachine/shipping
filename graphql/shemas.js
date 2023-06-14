import {gql} from  'graphql-tag' 

const typeDefs = gql ` 
  type Query { 
    GetPlaces: [Place]
  }

  type Place {
    value: String
  }

` 
export default typeDefs


    // id: ID 
    // login : String 
    // location: String
    // createdAt: String
    // role: String