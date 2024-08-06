import Layout from '@/src/components/layout/Layout'
import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import  Head  from 'next/head'

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </>
  )
}
