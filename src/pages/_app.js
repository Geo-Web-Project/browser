import Head from "next/head";
import "../App.css";
import "../App.scss";
import "@augmented-worlds/system-babylonjs/styles.css";
import "swiper/css";
import "swiper/css/navigation";

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
