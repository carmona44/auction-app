import { User } from '../auth/User'
import { Bid } from '../bid/bid'

export enum ItemCategory {
  VEHICLE = 'VEHICLE',
  REAL_ESTATE = 'REAL_ESTATE',
  BABY = 'BABY',
  ART = 'ART',
  MUSIC = 'MUSIC',
  DEVICE = 'DEVICE',
  AGRICULTURE = 'AGRICULTURE',
  ANIMALS = 'ANIMALS',
  SPORT = 'SPORT',
  FASHION = 'FASHION',
  FURNITURE = 'FURNITURE',
  OTHER = 'OTHER',
}

export enum AuctionStatus {
  ON_GOING = 'ON_GOING',
  ON_HOLD = 'ON_HOLD',
  FINISHED = 'FINISHED',
}

export interface Auction {
  id: string
  createdAt: string
  updatedAt: string
  seller: User
  title: string
  description: string
  category: ItemCategory
  startPrice: number
  terminateAt: string
  status: AuctionStatus
  bids: Bid[]
}

type ValuePiece = Date | null
export type Value = ValuePiece | [ValuePiece, ValuePiece]
