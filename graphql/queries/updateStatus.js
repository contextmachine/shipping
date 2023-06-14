import gql from "graphql-tag"

export const SEND = gql`
  mutation Send(
      $id: uuid!, 
      $status: String = "sended", 
      $sendedAt: String) {
    update_mfb_shipping_shippings_by_pk(
      pk_columns: {id: $id}, 
      _set: {
          status: $status, 
          sendedAt: $sendedAt}) {
      id
    }
  }
`

export const RECIEVE = gql`
  mutation Recieve(
      $id: uuid!, 
      $status: String = "recieved", 
      $recievedAt: String) {
    update_mfb_shipping_shippings_by_pk(
      pk_columns: {id: $id}, 
      _set: {
          status: $status, 
          recievedAt: $recievedAt }) {
      id
    }
  }
`