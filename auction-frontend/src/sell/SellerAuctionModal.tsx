import React, { useEffect, useState } from 'react'
import { Col, Container, Form, Row } from 'react-bootstrap'
import Button from 'react-bootstrap/Button'
import Modal from 'react-bootstrap/Modal'
import { Form as RouterForm, useLoaderData } from 'react-router-dom'
import { Auction, AuctionStatus } from '../buy/Auction'
import 'react-datetime-picker/dist/DateTimePicker.css'
import 'react-calendar/dist/Calendar.css'
import 'react-clock/dist/Clock.css'
import { timeLeft } from '../util/format-helper'
import { useAuth } from '../auth/AuthProvider'
import { getHighestBid } from '../util/highest-bid-helper'

export function SellerAuctionModal({
  auction,
  show,
  onHide,
}: {
  auction: Auction
  show: boolean
  onHide: () => void
}) {
  const { user } = useAuth()
  const hasFinished: boolean = auction.status === AuctionStatus.FINISHED
  const bidders = Array.from(new Set(auction.bids?.map(bid => bid.bidder))) as unknown as string[]
  const { currentPrice, highestBid } = getHighestBid(auction.bids)

  return (
    <Modal
      show={show}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <RouterForm method="post" onSubmit={onHide}>
        <Modal.Header className="justify-content-center">
          <Modal.Title id="contained-modal-title-vcenter">
            Your auction
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <h3>{auction.title}</h3>

          <p>{auction.description}</p>
          <Container>
            <Row className="justify-content-center align-items-center">
              <Col sm={{ span: 5, offset: 1 }}>
                {
                  hasFinished && (
                    <p>
                      {highestBid ? `Won by ${highestBid?.bidder?.name}` : 'Item was not sold'}
                    </p>
                  )
                }
                <p>
                  {
                    hasFinished
                      ? `Finished at ${new Date(auction.terminateAt).toLocaleDateString()}`
                      : `Deadline: ${timeLeft(auction.terminateAt)}`
                  }
                </p>
              </Col>
              <Col sm={{ span: 5, offset: 1 }}>
                <p>
                  Initial price:{' '}
                  <span style={{ fontSize: '2rem', fontWeight: 'bold' }}>
                    {auction.startPrice}
                  </span>
                </p>
              </Col>
            </Row>
            <Row>
              <Col sm={{ span: 5, offset: 1 }}>
                <Form.Group
                  as={Row}
                  className="mb-3"
                  controlId="formBasicEmail"
                >
                  <Form.Label column>
                    Number of bidders: {bidders?.length || 0}
                  </Form.Label>
                </Form.Group>
              </Col>
              <Col sm={{ span: 5, offset: 1 }}>
                <p>
                  Current price:{' '}
                  <span style={{ fontSize: '2rem', fontWeight: 'bold' }}>
                    {currentPrice}
                  </span>
                </p>
              </Col>
            </Row>
            <Form.Control name="bidder" defaultValue={user?.id} hidden />
            <Form.Control name="auction" defaultValue={auction.id} hidden />
          </Container>
        </Modal.Body>
        <Modal.Footer className="justify-content-end px-5">
          <Button variant="secondary" type="button" onClick={onHide}>
            Close
          </Button>
        </Modal.Footer>
      </RouterForm>
    </Modal>
  )
}