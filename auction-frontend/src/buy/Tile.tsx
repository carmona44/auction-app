import { Auction, AuctionStatus } from './Auction'
import { Col, Container, ListGroupItem, Row } from 'react-bootstrap'
import './Tile.scss'
import { useAuth } from '../auth/AuthProvider'
import { getHighestBid } from '../util/highest-bid-helper'
import useRealTimeRemaining from '../util/real-time-remaining-helper'

export function AuctionTile({ auction }: { auction: Auction }) {
  const { user } = useAuth();
  const { title, description, terminateAt, status, seller } = auction;
  const hasFinished: boolean = (status === AuctionStatus.FINISHED) || (new Date(terminateAt).getTime() < Date.now());
  const isSeller: boolean = user?.id === seller?.id;
  const { currentPrice, highestBid } = getHighestBid(auction);
  const remainingTime = useRealTimeRemaining(terminateAt);

  return (
    <ListGroupItem
      style={{ backgroundColor: '#f8f7f6ff' }}
      className="my-2 border-2 rounded-3"
    >
      <Container>
        <Row className="align-items-center" style={{ height: '125px' }}>
          <Col sm={6}>
            <h3>{title}</h3>
            <p className="truncate item">{description}</p>
          </Col>
          <Col className="d-flex justify-content-end">
            <p className="item">
              {
                hasFinished
                  ? `Finished at ${new Date(terminateAt).toLocaleDateString()}`
                  : remainingTime
              }
            </p>
          </Col>
          <Col className="d-flex justify-content-end">
            <p className="item fw-bold">
              {
                hasFinished && isSeller
                  ? (highestBid ? `Won by ${highestBid?.bidder?.name}` : 'Item was not sold')
                  : `${currentPrice}€`
              }
            </p>
          </Col>
        </Row>
      </Container>
    </ListGroupItem>
  )
}
