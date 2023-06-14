import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import { useEffect } from "react"
import { ApolloProvider } from '@apollo/client'

// import client from "@/graphql/apollo-client"
import client from "@/graphql/appolo-client"

export default function App({ Component, pageProps }: AppProps) {
    useEffect(() => {
        require('bootstrap/dist/js/bootstrap.bundle.min.js')
    })

    return (
        <ApolloProvider client={client}>
            <Component {...pageProps} />
        </ApolloProvider>
    )
}




