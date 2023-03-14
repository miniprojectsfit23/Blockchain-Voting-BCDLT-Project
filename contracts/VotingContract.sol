//SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "hardhat/console.sol"; //to see logs in console
import "@openzeppelin/contracts/utils/Counters.sol"; //to keep track of each voter and candidate

contract VotingContract{
	
	using Counters for Counters.Counter;

	Counters.Counter public _voterId;
	Counters.Counter public _candidateId;
	address public votingOrganizer;

	//Candidate Start

	struct Candidate{
		uint256 candidateId;
		string name;
		string age; 
		string image;
		uint256 voteCount;
		address _address;
		string ipfs;
	}

	event CandidateCreate(
		uint256 indexed candidateId,
		string name,
		string age,
		string image,
		uint256 voteCount,
		address _address,
		string ipfs
	);

	address[] public candidateAddress;
	mapping(address => Candidate) public candidates;
	//Candidate End

	//Voter Start
	address[] public votedVoters;
	address[] public votersAddress;

	mapping(address => Voter) public voters;
	struct Voter{
		uint256 voter_voterId;
		string voter_name;
		string voter_image;
		address voter_address;
		uint256 voter_allowed;
		bool voter_voted;
		uint256 voter_vote;
		string voter_ipfs;
	}
	event VoterCreate(
		uint256 indexed voter_voterId,
		string voter_name,
		string voter_image,
		address voter_address,
		uint256 voter_allowed,
		bool voter_voted,
		uint256 voter_vote,
		string voter_ipfs
	);

	//Voter End

	constructor(){
		votingOrganizer = msg.sender;
	}

	//Candidate Functions Start
	function setCandidate(address _address,string memory _age,string memory _name,string memory _image,string memory _ipfs) public{
		require(votingOrganizer == msg.sender,"You are not the organizer");
		_candidateId.increment();
		uint256 candidate_id = _candidateId.current();
		Candidate storage candidate = candidates[_address];
		candidate.age=_age;
		candidate.name=_name;
		candidate.image=_image;
		candidate.voteCount=0;
		candidate._address=_address;
		candidate.ipfs=_ipfs;
		candidateAddress.push(_address);
		emit CandidateCreate(
			candidate_id,
			_name,
			_age,
			_image,
			candidate.voteCount,
			_address,
			_ipfs
		);
	}

	function getCandidate() public view returns(address[] memory){
		return candidateAddress;
	}

	function getCandidateLength() public view returns(uint256){
		return candidateAddress.length;
	}

	function getCandidateData(address _address) public view returns(string memory,string memory,uint256,string memory,uint256,string memory,address){
		return(
			candidates[_address].age,
			candidates[_address].name,
			candidates[_address].candidateId,
			candidates[_address].image,
			candidates[_address].voteCount,
			candidates[_address].ipfs,
			candidates[_address]._address
		);
	} 
	//Candidate Functions End

	//Voter Functions Start

	function voterRight(address _address,string memory _name,string memory _image,string memory _ipfs) public{
		require(votingOrganizer == msg.sender,"You are not the organizer");
		_voterId.increment();
		uint256 voterId = _voterId.current();
		Voter storage voter = voters[_address];
		require(voter.voter_allowed == 0,"You have already voted");
		voter.voter_allowed=1;
		voter.voter_name=_name;
		voter.voter_image=_image;
		voter.voter_address=_address;
		voter.voter_voterId=voterId;
		voter.voter_vote=1000;
		voter.voter_voted=false;
		voter.voter_ipfs=_ipfs;
		votersAddress.push(_address);
		emit VoterCreate(
			voterId,
			_name,
			_image,
			_address,
			voter.voter_allowed,
			voter.voter_voted,
			voter.voter_vote,
			_ipfs
		);
	}

	function vote(address _candidateAddress,uint256 _candidateVoteId) external{
		Voter storage voter = voters[msg.sender];
		require(!voter.voter_voted,"You have already voted");
		require(voter.voter_allowed != 0 ,"You are not allowed to vote");
		voter.voter_voted=true;
		voter.voter_vote=_candidateVoteId;
		votedVoters.push(msg.sender);
		candidates[_candidateAddress].voteCount += voter.voter_allowed;
	}

	function getVoterLength() public view returns(uint256){
		return votersAddress.length;
	}

	function getVoterData(address _address) public view returns(uint256,string memory,string memory,address,string memory,uint256,bool){
		return(
			voters[_address].voter_voterId,
			voters[_address].voter_name,
			voters[_address].voter_image,
			voters[_address].voter_address,
			voters[_address].voter_ipfs,
			voters[_address].voter_allowed,
			voters[_address].voter_voted
		);
	}

	function getVotedVoterList() public view returns (address[] memory){
		return votedVoters;
	}

	function getVoterList() public view returns (address[] memory){
		return votersAddress;
	}

	//Voter Functions End
	function declareResult() public view returns (string memory,string memory,uint256,string memory,uint256,string memory,address){
		require(votingOrganizer == msg.sender,"Only Organizer can declare result");
		uint256 max=0;
		string memory name = candidates[candidateAddress[0]].name;
		string memory age = candidates[candidateAddress[0]].age;
		string memory image = candidates[candidateAddress[0]].image;
		string memory ipfs = candidates[candidateAddress[0]].ipfs;
		uint256 candidateId = candidates[candidateAddress[0]].candidateId;
		uint256 voteCount = candidates[candidateAddress[0]].voteCount;
		address _address = candidates[candidateAddress[0]]._address;
		for(uint256 i=0;i<candidateAddress.length;i++){
			if(candidates[candidateAddress[i]].voteCount > max){
				max = candidates[candidateAddress[i]].voteCount;
				name = candidates[candidateAddress[i]].name;
				candidateId = candidates[candidateAddress[i]].candidateId;
				age = candidates[candidateAddress[i]].age;
				image = candidates[candidateAddress[i]].image;
				ipfs = candidates[candidateAddress[i]].ipfs;
				voteCount = candidates[candidateAddress[i]].voteCount;
				_address = candidates[candidateAddress[i]]._address;
			}
		}
		return(age,name,candidateId,image,voteCount,ipfs,_address);
	}
}