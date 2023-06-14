import { GraphQLClient } from "graphql-request";

export const client = new GraphQLClient("http://51.250.47.166:8080/v1/graphql", {
    headers: { "x-hasura-admin-secret": "mysecretkey" },
});