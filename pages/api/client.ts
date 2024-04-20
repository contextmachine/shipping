import { GraphQLClient } from "graphql-request";

export const client = new GraphQLClient("http://hasura.default.svc.cluster.local:8080/v1/graphql", {
    headers: { "x-hasura-admin-secret": "mysecretkey" },
});