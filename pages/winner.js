import React, { useState, useEffect, useContext } from "react";

import { VotingContext } from "../context/Voter";
import Style from "@/styles/winner.module.css";
import Card from "@/components/Card/Card";

const winner = () => {
	const {
		declareResult,
		winner,
		candidateLength,
		setError,
		checkIfWalletIsConnected,
		getNewCandidate,
	} = useContext(VotingContext);
	useEffect(() => {
		getNewCandidate();
		checkIfWalletIsConnected();
		declareResult();
	}, []);
	useEffect(() => {
		// if (winner[0] == "No Winner") {
		// 	setError("Please add Candidates to Declare Result");
		// }
		// if (winner[0] != "No Winner") {
		// 	setError("");
		// }
	});
	return (
		<>
			{winner[0] != "No Winner" && <h1 className={Style.heading}>WINNER</h1>}
			<div className={Style.card}>
				{candidateLength > 0 ? (
					<>
						<div className={Style.card_box}>
							<div className={Style.image}>
								<img src={winner[3]} alt="Candidate Image" />
							</div>
							<div className={Style.card_info}>
								<h2>
									{winner[1]} #{winner[2].toNumber()}
								</h2>
								<p>{winner[0]}</p>
								<p>Address: {winner[6].slice(0, 30)}...</p>
								<p className={Style.total}>Total Votes</p>
							</div>
							<div className={Style.card_vote}>
								<p>{winner[4].toNumber()}</p>
							</div>
						</div>
					</>
				) : (
					<div></div>
				)}
			</div>
		</>
	);
};

export default winner;
