import React from "react";
import Image from "next/image";

import images from "@/assets";
import Style from "@/components/Card/Card.module.css";

const Card = ({ candidateArray, giveVote }) => {
	return (
		<div className={Style.card}>
			{candidateArray.map((el, i) => (
				<div className={Style.card_box}>
					<div className={Style.image}>
						{/* <img src={el[3]} alt="Candidate Image" /> */}
						<Image
							src={images.upload}
							objectFit="contain"
							alt="Candidate Image"
						/>
					</div>
					<div className={Style.card_info}>
						<h2>
							{el[1]} #{el[2].toNumber()}
						</h2>
						<p>Age: {el[0]}</p>
						<p>Address: {el[6].slice(0, 30)}...</p>
						<p className={Style.total}>Total Votes</p>
					</div>
					<div className={Style.card_vote}>
						<p>{el[4].toNumber()}</p>
					</div>
					<div className={Style.card_button}>
						<button
							onClick={() => giveVote({ id: el[2].toNumber(), address: el[6] })}
						>
							Give Vote
						</button>
					</div>
				</div>
			))}
		</div>
	);
};

export default Card;
