import ADD_SHIPPING from '@/graphql/queries/addShipping.gql'
import GET_PLACES from '@/graphql/queries/getPlaces.gql'
import GET_CONTENT_TYPES from '@/graphql/queries/getContentTypes.gql'
import DELETE_SHIPPING from "@/graphql/queries/deleteShipping.gql"
import GET_SHIPPINGS from "@/graphql/queries/getShippings.gql"
import GET_SHIPPING from "@/graphql/queries/getShipping.gql"
import EDIT_SHIPPING from '@/graphql/queries/editShipping.gql'
import GET_USERS from '@/graphql/queries/getUsers.gql'
import DELETE_USER from '@/graphql/queries/deleteUser.gql'

import { SEND, RECIEVE } from '@/graphql/queries/updateStatus'

export {
    ADD_SHIPPING,
    GET_PLACES,
    GET_CONTENT_TYPES,
    DELETE_SHIPPING,
    GET_SHIPPINGS,
    GET_SHIPPING,
    EDIT_SHIPPING,
    GET_USERS,
    DELETE_USER,
    SEND,
    RECIEVE
}
