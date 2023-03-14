import React, { useState, useEffect, useContext } from "react";

import VoterCard from "@/components/VoterCard/VoterCard";
import Style from "@/styles/voterList.module.css";
import { VotingContext } from "@/context/Voter";

const voterList = () => {
	const { getAllVoterData, voterArray, checkIfWalletIsConnected } =
		useContext(VotingContext);
	useEffect(() => {
		checkIfWalletIsConnected();
		getAllVoterData();
	}, []);
	return (
		<div className={Style.voterList}>
			<VoterCard voterArray={voterArray} />
		</div>
	);
};

export default voterList;
