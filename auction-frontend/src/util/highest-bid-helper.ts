import { Bid } from "../bid/bid"

export const getHighestBid = (bids: Bid[]): { currentPrice: number, highestBid: Bid | undefined } => {
  let currentPrice: number = 0;
  let highestBid: Bid | undefined = undefined;

  if (!bids?.length) {
    return { currentPrice, highestBid };
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
