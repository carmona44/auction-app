import { Auction, AuctionStatus } from "../buy/Auction";
import { getHighestBid } from "./highest-bid-helper";

export const checkIsValidBid = (price: string, bidder: string, auction: Auction): boolean => {
  const { currentPrice, highestBid } = getHighestBid(auction);
  const nowMs = Date.now();
  const terminateAtMs = new Date(auction.terminateAt).getTime();

  if (auction.status !== AuctionStatus.ON_GOING || terminateAtMs < nowMs) {
    return false;
  }

  if (bidder === auction.seller.id) {
    return false;
  }

  if (highestBid?.bidder?.id === bidder) {
    return false;
  }

  if (+price <= currentPrice) {
    return false;
  }

  return true;
}
