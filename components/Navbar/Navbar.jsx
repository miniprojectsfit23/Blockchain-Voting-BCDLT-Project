import React, { useState, useContext, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { AiFillLock, AiFillUnlock } from "react-icons/ai";

import { VotingContext } from "@/context/Voter";
import Style from "@/components/Navbar/Navbar.module.css";
import logo from "@/assets/logo.png";

const Navbar = () => {
	const { connectWallet, error, currentAccount, getOwner, candidateLength } =
		useContext(VotingContext);
	const [openNav, setOpenNav] = useState(false);
	const [owner, setOwner] = useState();
	getOwner().then((res) => {
		setOwner(res);
	});
	const openNavigation = () => {
		if (openNav) {
			setOpenNav(false);
		} else if (!openNav) {
			setOpenNav(true);
		}
	};

	return (
		<div className={Style.navbar}>
			{error === "" ? (
				""
			) : (
				<div className={Style.message_box}>
					<div className={Style.message}>
						<p>{error}</p>
					</div>
				</div>
			)}
			<div className={Style.navbar_box}>
				<div className={Style.title}>
					<Link href={{ pathname: "/" }}>
						<Image src={logo} alt="logo" height={80} width={160} />
					</Link>
				</div>
				<div className={Style.connect}>
					{currentAccount ? (
						<div>
							<div className={Style.connect_flex}>
								<button onClick={() => openNavigation()}>
									{currentAccount.slice(0, 10)}...
								</button>
								{currentAccount && (
									<span>
										{openNav ? (
											<AiFillUnlock onClick={() => openNavigation()} />
										) : (
											<AiFillLock onClick={() => openNavigation()} />
										)}
									</span>
								)}
							</div>
							{openNav && (
								<div className={Style.navigation}>
									<p>
										<Link href={{ pathname: "/" }}>Home</Link>
									</p>
									<p>
										<Link href={{ pathname: "/candidateRegistrations" }}>
											Candidate Registration
										</Link>
									</p>
									<p>
										<Link href={{ pathname: "/allowedVoters" }}>
											Voter Registration
										</Link>
									</p>
									<p>
										<Link href={{ pathname: "/voterList" }}>Voter List</Link>
									</p>
									{currentAccount - owner == 0 && candidateLength > 0 && (
										<p>
											<Link href={{ pathname: "/winner" }}>Declare Result</Link>
										</p>
									)}
								</div>
							)}
						</div>
					) : (
						<button onClick={() => connectWallet()}>Connect Wallet</button>
					)}
				</div>
			</div>
		</div>
	);
};

export default Navbar;
