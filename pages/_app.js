import request from "graphql-request";
import { useRouter } from "next/router";
import { SWRConfig } from "swr";
import "../styles/global.css";

const fetcher = async (QUERY) => {
	const result = await request(
		"https://api-us-east-1.graphcms.com/v2/ckursm70w0eq101y2982b3c14/master",
		QUERY
	);

	return result;
};

function App({ Component, pageProps }) {
	return (
		<SWRConfig
			value={{
				fetcher: fetcher,
				revalidateOnFocus: false,
			}}
		>
			<Component {...pageProps} key={useRouter().route} />
		</SWRConfig>
	);
}

export default App;
