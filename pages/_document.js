import Document, { Html, Head, Main, NextScript } from "next/document";

const MyDocument = (ctx) => {
  return (
    <Html>
      <Head>
        <meta content="#7C3AED" name="theme-color" />

        <link rel="stylesheet" href="https://use.typekit.net/lve1wgr.css" />

        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;500;700&family=Nunito+Sans:wght@400;600;800&family=Ubuntu:wght@300;500;700&family=Work+Sans:wght@300;500;700&display=swap"
          rel="stylesheet"
        ></link>
        <link rel="shortcut icon" href="/favicon.png" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
};

export default MyDocument;
