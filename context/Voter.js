import React, { useState, useEffect } from "react";
import Web3Modal from "web3modal";
import { ethers } from "ethers";
import { Web3Storage } from "web3.storage";
import axios from "axios";
import { useRouter } from "next/router";
import shortUUID from "short-uuid";

import { VotingAddress, VotingAddressABI } from "./constants.js";

const uuid = shortUUID("0123456789");
const apiToken =
	"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweEUxOGU3Nzc5NWZhQTMwNzRkYTFGMUY5M2RCQWMyNGYzNTA4MjkwOWEiLCJpc3MiOiJ3ZWIzLXN0b3JhZ2UiLCJpYXQiOjE2NzUwMDA4ODc4MTgsIm5hbWUiOiJCbG9ja2NoYWluIEUtVm90aW5nIn0.nJMCnnKebdDMab6MVLWpdB0sTo8EdryoIo7tnLXyvgo";
const client = new Web3Storage({ token: apiToken });

const fetchContract = (signerOrProvider) =>
	new ethers.Contract(VotingAddress, VotingAddressABI, signerOrProvider);

export const VotingContext = React.createContext();
class dummy {
	toNumber() {
		return 0;
	}
}
export const VotingProvider = ({ children }) => {
	const router = useRouter();

	//Candidate Data Start
	const [currentAccount, setCurrentAccount] = useState("");
	const [candidateLength, setCandidateLength] = useState("");
	const pushCandidate = [];
	const candidateIndex = [];
	const [candidateArray, setCandidateArray] = useState(pushCandidate);
	const [winner, setWinner] = useState([
		"No Winner",
		"",
		new dummy(),
		"",
		new dummy(),
		"",
		"",
	]);
	//Candidate Data End

	const [error, setError] = useState("");

	//Voter Data Start
	const pushVoter = [];
	const [voterArray, setVoterArray] = useState(pushVoter);
	const [voterLength, setVoterLength] = useState("");
	const [voterAddress, setVoterAddress] = useState([]);
	//Voter Data End

	//Check if Metamask exists
	const checkIfWalletIsConnected = async () => {
		if (!window.ethereum) {
			return setError("Please install Metamask and Reload this page");
		}
		const account = await window.ethereum.request({ method: "eth_accounts" });
		if (account.length) {
			setCurrentAccount(account[0]);
		} else {
			setError("Please install Metamask and Reload this page");
		}
	};

	//Connect Metamask
	const connectWallet = async () => {
		if (!window.ethereum) {
			return setError("Please install Metamask and Reload this page");
		}
		const account = await window.ethereum.request({
			method: "eth_requestAccounts",
		});
		setCurrentAccount(account[0]);
	};

	//upload voter image to ipfs
	const uploadToIPFS = async (type, image) => {
		try {
			const ext = image.name.split(".").pop();
			var fileName = "";
			if (type === "candidate") {
				fileName = `CandidateImg_${uuid.new()}.${ext}`;
			} else if (type === "voter") {
				fileName = `VoterImg_${uuid.new()}.${ext}`;
			} else {
				return setError("Type of IPFS file mismatch");
			}
			const newFile = new File([image], fileName, { type: image.type });
			const cid = await client.put([newFile], {
				name: fileName,
			});
			const url = `https://${cid}.ipfs.w3s.link/${fileName}`;
			return url;
		} catch (error) {
			setError("Error Uploading file to IPFS");
		}
	};
	//returns owner
	const getOwner = async () => {
		//Connecting Smart Contract
		const web3modal = new Web3Modal();
		const connection = await web3modal.connect();
		const provider = new ethers.providers.Web3Provider(connection);
		const signer = provider.getSigner();
		const contract = fetchContract(signer);

		const owner = await contract.votingOrganizer();
		return owner;
	};

	//VOTER SECTION----------------------------------------------
	//Create Voter
	const createVoter = async (formInput, fileUrl, router) => {
		try {
			const { name, address, position } = formInput;
			if (!name || !address || !position) {
				return setError("Input Data is not complete");
			}
			//Connecting Smart Contract
			const web3modal = new Web3Modal();
			const connection = await web3modal.connect();
			const provider = new ethers.providers.Web3Provider(connection);
			const signer = provider.getSigner();
			const contract = fetchContract(signer);

			const data = JSON.stringify({ name, address, position, image: fileUrl });
			const fileName = `Voter_${uuid.new()}.json`;
			const fileNew = new File([data], fileName);
			const cid = await client.put([fileNew], {
				name: fileName,
			});
			const url = `https://${cid}.ipfs.dweb.link/${fileName}`;
			const voter = await contract.voterRight(address, name, fileUrl, url);
			voter.wait();
			router.push("/voterList");
		} catch (error) {
			setError("Error in Creating Voter");
		}
	};
	//Get Voter Data
	const getAllVoterData = async () => {
		try {
			//Connecting Smart Contract
			const web3modal = new Web3Modal();
			const connection = await web3modal.connect();
			const provider = new ethers.providers.Web3Provider(connection);
			const signer = provider.getSigner();
			const contract = fetchContract(signer);

			//Voter List
			const voterListData = await contract.getVoterList();
			setVoterAddress(voterListData);
			voterListData.map(async (el) => {
				const singleVoterData = await contract.getVoterData(el);
				pushVoter.push(singleVoterData);
			});
			//Voter Length
			const voterList = await contract.getVoterLength();
			setVoterLength(voterList.toNumber());
		} catch (error) {
			setError("Error in Getting Voter Data");
		}
	};
	//Give Vote
	const giveVote = async (id) => {
		try {
			const voterAddress = id.address;
			const voterId = id.id;
			//Connecting Smart Contract
			const web3modal = new Web3Modal();
			const connection = await web3modal.connect();
			const provider = new ethers.providers.Web3Provider(connection);
			const signer = provider.getSigner();
			const contract = fetchContract(signer);

			const votedList = await contract.vote(voterAddress, voterId);
			console.log(votedList);
		} catch (error) {
			const er = error.message;
			const erSubstr = er.substr(er.indexOf("with reason string '") + 20);
			setError(erSubstr.substr(0, erSubstr.indexOf("'")));
		}
	};

	//CANDIDATE SECTION----------------------------------------------
	//Create Candidate
	const setCandidate = async (candidateForm, fileUrl, router) => {
		try {
			const { name, address, age } = candidateForm;
			if (!name || !address || !age) {
				return setError("Input Data is not complete");
			}
			//Connecting Smart Contract
			const web3modal = new Web3Modal();
			const connection = await web3modal.connect();
			const provider = new ethers.providers.Web3Provider(connection);
			const signer = provider.getSigner();
			const contract = fetchContract(signer);

			const data = JSON.stringify({ name, address, image: fileUrl, age });
			const fileName = `Candidate_${uuid.new()}.json`;
			const fileNew = new File([data], fileName);
			const cid = await client.put([fileNew], {
				name: fileName,
			});
			const url = `https://${cid}.ipfs.dweb.link/${fileName}`;
			const candidate = await contract.setCandidate(
				address,
				age,
				name,
				fileUrl,
				url
			);
			candidate.wait();
			router.push("/");
		} catch (error) {
			console.log(error);
			setError("Error in Creating Voter");
		}
	};
	//Get Candidate Data
	const getNewCandidate = async () => {
		try {
			//Connecting Smart Contract
			const web3modal = new Web3Modal();
			const connection = await web3modal.connect();
			const provider = new ethers.providers.Web3Provider(connection);
			const signer = provider.getSigner();
			const contract = fetchContract(signer);
			//All Candidates
			const allCandidates = await contract.getCandidate();
			allCandidates.map(async (el) => {
				const singleCandidateData = await contract.getCandidateData(el);
				pushCandidate.push(singleCandidateData);
				candidateIndex.push(singleCandidateData[2].toNumber());
			});
			//Candidate Length
			const allCandidateLength = await contract.getCandidateLength();
			setCandidateLength(allCandidateLength.toNumber());
		} catch (error) {
			setError("Error in Getting Candidate Data");
		}
	};
	//Declare Result
	const declareResult = async () => {
		try {
			//Connecting Smart Contract
			const web3modal = new Web3Modal();
			const connection = await web3modal.connect();
			const provider = new ethers.providers.Web3Provider(connection);
			const signer = provider.getSigner();
			const contract = fetchContract(signer);
			//Candidate Length
			const winner = await contract.declareResult();
			setWinner(winner);
		} catch (error) {
			setWinner(["Error", "", new dummy(), "", new dummy(), "", ""]);
			const er = error.message;
			const erSubstr = er.substr(er.indexOf('with reason string "') + 20);
			setError(erSubstr.substr(0, erSubstr.indexOf('"')));
		}
	};
	return (
		<VotingContext.Provider
			value={{
				checkIfWalletIsConnected,
				connectWallet,
				uploadToIPFS,
				createVoter,
				getAllVoterData,
				giveVote,
				setCandidate,
				getNewCandidate,
				declareResult,
				getOwner,

				error,
				voterArray,
				voterLength,
				voterAddress,
				currentAccount,
				candidateLength,
				candidateArray,
				setError,
				winner,
			}}
		>
			{children}
		</VotingContext.Provider>
	);
};
