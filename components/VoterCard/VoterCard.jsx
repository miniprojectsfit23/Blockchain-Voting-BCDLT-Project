import React, { useEffect } from "react";
import Image from "next/image";

import Style from "@/components/Card/Card.module.css";
import images from "@/assets";
import voterCardStyle from "@/components/VoterCard/VoterCard.module.css";

const VoterCard = ({ voterArray }) => {
	useEffect(() => {
		console.log(voterArray);
	}, []);
	return (
		<div className={Style.card}>
			{voterArray && voterArray.length ? (
				""
			) : (
				<div className={Style.message_box}>
					<div className={Style.message}>
						<p>No Voter Data Found</p>
					</div>
				</div>
			)}
			{voterArray.map((el, i) => (
				<div className={Style.card_box}>
					<div className={Style.image}>
						<img src={el[2]} alt="Voter Image" />
					</div>
					<div className={Style.card_info}>
						<h2>
							{el[1]} #{el[0].toNumber()}
						</h2>
						<p>Address: {el[3].slice(0, 30)}...</p>
						<p>Details</p>
						<p className={voterCardStyle.vote_Status}>
							{el[6] == true ? "You Already Voted" : "Not Voted"}
						</p>
					</div>
				</div>
			))}
		</div>
	);
};

export default VoterCard;
