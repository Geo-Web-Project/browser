import Head from "next/head";
import "../App.css";

export default function App({ Component, pageProps }) {
  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>Geo Web Browser</title>
      </Head>
      <Component {...pageProps} />
    </>
  );
}
