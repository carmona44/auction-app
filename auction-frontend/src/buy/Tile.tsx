import React, { useCallback } from 'react'
import { Auction, AuctionStatus } from './Auction'
import { Col, Container, ListGroupItem, Row } from 'react-bootstrap'
import './Tile.scss'
import { timeLeft } from '../util/format-helper'
import { useAuth } from '../auth/AuthProvider'
import { getHighestBid } from '../util/highest-bid-helper'

export function AuctionTile({ auction }: { auction: Auction }) {
  const { user } = useAuth();
  const expiresIn = useCallback((date: string) => timeLeft(date), [])
  const { title, description, terminateAt, status, seller } = auction
  const hasFinished: boolean = status === AuctionStatus.FINISHED
  const isSeller: boolean = user?.id === seller?.id
  const { currentPrice, highestBid } = getHighestBid(auction)

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
                hasFinished && isSeller
                  ? `Finished at ${new Date(terminateAt).toLocaleDateString()}`
                  : expiresIn(terminateAt)
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
