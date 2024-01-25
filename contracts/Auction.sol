// SPDX-License-Identifier: BSD-3-Clause-Clear

pragma solidity >=0.8.13 <0.9.0;

import { euint32, FHE } from "@fhenixprotocol/contracts/FHE.sol";
import "./ConfAddress.sol";

struct HistoryEntry {
    euint32 amount;
    bool refunded;
}

contract Auction {
    address payable public auctioneer;
    mapping(address => HistoryEntry) internal auctionHistory;
    euint32 internal ezero;
    euint32 internal highestBid;
    Eaddress internal defaultAddress;
    Eaddress internal highestBidder;
    euint32 internal eMaxEuint32;
    uint256 public auctionEndTime;

    // mapping(address => euint32) public auctionHistory;
    // euint32 public ezero;
    // euint32 public highestBid;
    // Eaddress internal defaultAddress;
    // Eaddress internal highestBidder;
    // euint32 public eMaxEuint32;
    // uint256 public auctionEndTime;

    // When auction is ended this will contain the PLAINTEXT winner address
    address public winnerAddress;

    event AuctionEnded(address winner, uint32 bid);

    constructor(uint256 biddingTime) payable {
        auctioneer = payable(msg.sender);
        auctionEndTime = block.timestamp + biddingTime;
        ezero = FHE.asEuint32(0);
        highestBid = ezero;
        for (uint i = 0; i < 5; i++) {
            defaultAddress.values[i] = ezero;
            highestBidder.values[i] = ezero;
        }

        eMaxEuint32 = FHE.asEuint32(0xFFFFFFFF);
    }

    function updateHistory(address payable addr, euint32 currentBid) internal returns (euint32) {
        // Check for overflow, if such, just don't change the actualBid
        // NOTE: overflow is most likely an abnormal action so the funds WON'T be refunded!
        if (!FHE.isInitialized(auctionHistory[addr].amount)) {
            HistoryEntry memory entry;
            entry.amount = currentBid;
            entry.refunded = false;
            auctionHistory[addr] = entry;
            return auctionHistory[addr].amount;
        }

        // Checking overflow here is optional as in real-life percision would be accounted for.
        ebool hadOverflow = (eMaxEuint32 - currentBid).lt(auctionHistory[addr].amount);
        euint32 actualBid = FHE.select(hadOverflow, ezero, currentBid);

        // Add the actual bid to the previous bid
        // If there was no bid it will work because the default value of uint32 is encrypted 02
        auctionHistory[addr].amount = auctionHistory[addr].amount + actualBid;
        return auctionHistory[addr].amount;
    }

    function bid() public payable {
        require(block.timestamp <= auctionEndTime, "Auction has ended");
        require((msg.value / (10 ** 18)) < 0xFFFFFFFF, "Max bid is 4294967295wei");

        euint32 newBid = updateHistory(payable(msg.sender), FHE.asEuint32((msg.value / (10 ** 18))));
        // Can't update here highestBid directly because we need and indication whether the highestBid was changed
        // if we will change here the highestBid
        // we will have an edge case when the current bid will be equal to the highestBid
        euint32 newHeighestBid = FHE.max(newBid, highestBid);

        Eaddress memory eaddr = ConfAddress.toEaddress(payable(msg.sender));
        ebool wasBidChanged = newHeighestBid.gt(highestBid);

        highestBidder = ConfAddress.conditionalUpdate(wasBidChanged, highestBidder, eaddr);
        highestBid = newHeighestBid;
    }

    function wasEnded() internal view returns (bool) {
        return winnerAddress != address(0);
    }

    function endAuction() public {
        require(msg.sender == auctioneer, "Only auctioneer can end the auction");
        // require(block.timestamp >= auctionEndTime, "Auction has not ended yet");
        require(!wasEnded(), "Auction already ended");
        winnerAddress = ConfAddress.unsafeToAddress(highestBidder);
        // The cards can be revealed now, we can safely reveal the bidder
        emit AuctionEnded(winnerAddress, FHE.decrypt(highestBid));
    }

    function redeemFunds() public payable {
        require(wasEnded(), "Winner isn't yet announced");
        require(winnerAddress != msg.sender, "A winner can't redeem his bid");
        require(!auctionHistory[msg.sender].refunded, "Already refunded");

        uint32 bidAmount = FHE.decrypt(auctionHistory[msg.sender].amount);

        require(bidAmount != 0, "Nothing to refund");

        uint256 toBeRedeemed = uint256(bidAmount) * (10 ** 18);

        auctionHistory[msg.sender].refunded = false;

        payable(msg.sender).transfer(toBeRedeemed);
    }
}
