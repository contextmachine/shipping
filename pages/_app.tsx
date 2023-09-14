import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import { useEffect } from "react"
import { ApolloProvider } from '@apollo/client'

import client from "@/graphql/appolo-client"
import { createGlobalStyle } from 'styled-components'


const GlobalStyles = createGlobalStyle`
.ant-picker-panel-container {
    flex: 1;
    display: flex;
    flex-direction: column;

    .ant-picker-panels {
      flex: 1;
      display: flex;

      .ant-picker-panel:not(:first-child) {
        display: none;
      }

      :first-child {
        button.ant-picker-header-next-btn {
          visibility: visible !important;
        }
        button.ant-picker-header-super-prev-btn {
          visibility: hidden !important;
        }
      }
    }
`


export default function App({ Component, pageProps }: AppProps) {
    useEffect(() => {
        require('bootstrap/dist/js/bootstrap.bundle.min.js')
    })

    return (
        <ApolloProvider client={client}>
            <GlobalStyles />
            <Component {...pageProps} />
        </ApolloProvider>
    )
}



