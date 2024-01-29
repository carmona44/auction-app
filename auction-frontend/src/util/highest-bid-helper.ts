import { Bid } from "../bid/bid"
import { Auction } from "../buy/Auction";

export const getHighestBid = (auction: Auction): { currentPrice: number, highestBid: Bid | undefined } => {
  const bids: Bid[] = auction.bids;
  let currentPrice: number = 0;
  let highestBid: Bid | undefined = undefined;

  if (!bids?.length) {
    return { currentPrice: auction.startPrice, highestBid };
  }

  highestBid = bids[0];
  currentPrice = highestBid.price;
  if (!highestBid.isMaximum) {
    return { currentPrice, highestBid };
  }

  const secondHighestBid: Bid | undefined = bids[1];
  if (secondHighestBid) {
    currentPrice = secondHighestBid.price + 1;
    return { currentPrice, highestBid };
  }

  currentPrice = highestBid.price;
  return { currentPrice, highestBid };

}
