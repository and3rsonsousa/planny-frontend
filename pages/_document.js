import { useState } from "react";
import Document, { Html, Head, Main, NextScript } from "next/document";

const MyDocument = (ctx) => {
	return (
		<Html>
			<Head>
				<meta content="#7C3AED" name="theme-color" />

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
