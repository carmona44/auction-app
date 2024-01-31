import cron from 'node-cron';
import { sendAuctionNotifications } from '../routes/notifications';
import { DI } from '../app';
import { AuctionStatus } from '../../database/types/types';
import { AuctionEntity } from '../../database/entities';

export const handleEndedAuctionsCron = cron.schedule('* * * * *', async () => {
  console.log('Reviewing ended auctions...');
  const endedAuctions: AuctionEntity[] = await DI.auctionRepository.find(
    {
      terminateAt: { $lt: new Date() },
      status: { $ne: AuctionStatus.FINISHED }
    },
    {
      populate: ['seller', 'bids', 'bids.bidder']
    }
  )

  if (endedAuctions.length) {
    console.log(`Proccessing ${endedAuctions.length} ended auctions...`)
    sendAuctionNotifications(endedAuctions);
  }
  //TODO: update auction status if needed
  //TODO: manage payment if needed
}, {
  scheduled: false,
});
