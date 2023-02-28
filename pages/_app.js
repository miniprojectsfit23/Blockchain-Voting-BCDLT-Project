import "@/styles/globals.css";

import { VotingProvider } from "@/context/Voter";
import Navbar from "@/components/Navbar/Navbar";

export default function App({ Component, pageProps }) {
	return (
		<VotingProvider>
			<div>
				<Navbar />
				<div>
					<Component {...pageProps} />
				</div>
			</div>
		</VotingProvider>
	);
}
