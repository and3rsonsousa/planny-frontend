import Document, { Html, Head, Main, NextScript } from "next/document";

<link rel="stylesheet" href="https://use.typekit.net/lve1wgr.css"></link>;

const MyDocument = (ctx) => {
  return (
    <Html>
      <Head>
        <link
          rel="stylesheet"
          href="https://use.typekit.net/lve1wgr.css"
        ></link>
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
};

export default MyDocument;
