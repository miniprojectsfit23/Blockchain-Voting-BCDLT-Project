import React, { useState, useEffect, useCallback, useContext } from "react";
import { useRouter } from "next/router";
import { useDropzone } from "react-dropzone";
import Image from "next/image";

import { VotingContext } from "@/context/Voter";
import Style from "@/styles/allowedVoters.module.css";
import images from "@/assets";
import Button from "../components/Button/Button";
import Input from "../components/Input/Input";

const candidateRegistrations = () => {
	const [fileUrl, setFileUrl] = useState(null);
	const [candidateForm, setCandidateForm] = useState({
		name: "",
		address: "",
		age: "",
	});

	const router = useRouter();
	const {
		uploadToIPFS,
		setCandidate,
		candidateArray,
		getNewCandidate,
		checkIfWalletIsConnected,
	} = useContext(VotingContext);

	//Voter Image Drop
	const onDrop = useCallback(async (acceptedFile) => {
		const url = await uploadToIPFS("candidate", acceptedFile[0]);
		setFileUrl(url);
	});

	const { getRootProps, getInputProps } = useDropzone({
		onDrop,
		accept: "image/*",
		maxSize: "5000000",
	});

	useEffect(() => {
		checkIfWalletIsConnected();
		getNewCandidate();
	}, []);

	//JSX
	return (
		<div className={Style.createVoter}>
			<div>
				{fileUrl && (
					<div className={Style.voterInfo}>
						<img src={fileUrl} alt="Candidate Image"></img>
						<div className={Style.voterInfo_paragraph}>
							<p>
								Name: &nbsp; <span>{candidateForm.name}</span>
							</p>
							<p>
								Add: &nbsp; <span>{candidateForm.address.slice(0, 20)}</span>
							</p>
							<p>
								Age: &nbsp; <span>{candidateForm.age}</span>
							</p>
						</div>
					</div>
				)}
				{!fileUrl && (
					<div className={Style.sideInfo}>
						<div className={Style.sideInfo_box}>
							<h4>Create Candidate For Voting</h4>
							<p>
								Blockchain Powered E-Voting
								<br />
								<br /> Brought to you by Group 19 BEITB
							</p>
							<p className={Style.sideInfo_para}>Contract Candidate</p>
						</div>
						<div className={Style.car}>
							{candidateArray.map((el, i) => (
								<div key={i + 1} className={Style.card_box}>
									<div className={Style.image}>
										{/* <img src={el[3]} alt="Candidate Photo" /> */}
										<Image
											src={images.upload}
											height={50}
											width={50}
											objectFit="contain"
											alt="Candidate Image"
										/>
									</div>
									<div className={Style.card_info}>
										<p>
											{el[1]} #{el[2].toNumber()}
										</p>
										<p>{el[0]}</p>
										<p>Address: {el[6].slice(0, 10)}...</p>
									</div>
								</div>
							))}
						</div>
					</div>
				)}
			</div>
			<div className={Style.voter}>
				<div className={Style.voter_container}>
					<h1>Create New Candidate</h1>
					<div className={Style.voter_container_box}>
						<div className={Style.voter_container_box_div}>
							<div {...getRootProps()}>
								<input {...getInputProps()} />
								<div className={Style.voter_container_box_div_info}>
									<p>Upload File: JPG, PNG, GIF, WEBM Max 10MB</p>
									<div className={Style.voter_container_box_div_image}>
										{fileUrl ? (
											<img
												src={fileUrl}
												width={150}
												height={150}
												objectFit="contain"
												alt="File Upload"
											/>
										) : (
											<Image
												src={images.upload}
												width={150}
												height={150}
												objectFit="contain"
												alt="File Upload"
											/>
										)}
									</div>
									<p>Drag & Drop File</p>
									<p>or Browse Media on your device</p>
								</div>
							</div>
						</div>
					</div>
				</div>
				<div className={Style.input_container}>
					<Input
						inputType="text"
						title="Name"
						placeholder="Candidate Name"
						handleClick={(e) =>
							setCandidateForm({ ...candidateForm, name: e.target.value })
						}
					/>
					<Input
						inputType="text"
						title="Address"
						placeholder="Candidate Address"
						handleClick={(e) =>
							setCandidateForm({ ...candidateForm, address: e.target.value })
						}
					/>
					<Input
						inputType="text"
						title="Age"
						placeholder="Candidate Age"
						handleClick={(e) =>
							setCandidateForm({ ...candidateForm, age: e.target.value })
						}
					/>
					<div className={Style.Button}>
						<Button
							btnName="Authorize Candidate"
							handleClick={() => setCandidate(candidateForm, fileUrl, router)}
						/>
					</div>
				</div>
			</div>
			<div className={Style.createdVoter}>
				<div className={Style.createdVoter_info}>
					<Image
						src={images.creator}
						alt="User Photo"
						width={150}
						height={150}
						objectFit="contain"
					/>
					<p>Notice For User</p>
					<p>
						Organizer <span>0x5FbDB2315678afecb367f032d93F642f64180aa3</span>
					</p>
					<p>Only Organizer of the Voting Contract can Create Candidates</p>
				</div>
			</div>
		</div>
	);
};

export default candidateRegistrations;
