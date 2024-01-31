import { AuctionEntity } from '../../database/entities';
import { ToastData } from '../../database/types/types';
import { Request, Response, Router } from 'express'

const router = Router()
const connectedClients = new Map();

router.get('/:id', (req: Request, res: Response) => {
  const clientId = req.params.id;

  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');

  connectedClients.set(clientId, res);
  console.log(`+ ${clientId} connected`);

  req.on('close', () => {
    console.log(`- ${clientId} connection closed`);
    connectedClients.delete(res);
  });
});

export const sendAuctionNotifications = (endedAuctions: AuctionEntity[]): void => {
  for (const auction of endedAuctions) {
    const winnerBid = auction.bids[0];
    if (winnerBid) {
      const buyerClient = connectedClients.get(winnerBid.bidder.id);
      if (buyerClient) {
        const buyerToast: ToastData = {
          id: Math.round(Date.now() / 1000),
          message: `You won auction ${auction.title} for ${winnerBid.price}€`,
          bg: "secondary"
        };
        const buyerPayload = JSON.stringify(buyerToast);
        buyerClient.write(`data: ${buyerPayload}\n\n`);
      }
      const sellerClient = connectedClients.get(auction.seller.id);
      if (sellerClient) {
        const sellerToast: ToastData = {
          id: Math.round(Date.now() / 100),
          message: `Your ${auction.title} is finished and was purchased by ${winnerBid.bidder.name} at ${winnerBid.price}€`,
          bg: "secondary"
        };
        const sellerPayload = JSON.stringify(sellerToast);
        sellerClient.write(`data: ${sellerPayload}\n\n`);
      }
    } else {
      const sellerClient = connectedClients.get(auction.seller.id);
      if (sellerClient) {
        const sellerToast: ToastData = {
          id: Math.round(Date.now() / 10),
          message: `Your ${auction.title} is finished and no one bought it`,
          bg: "secondary"
        };
        const sellerPayload = JSON.stringify(sellerToast);
        sellerClient.write(`data: ${sellerPayload}\n\n`);
      }
    }
  }
};


export const NotificationsController = router
