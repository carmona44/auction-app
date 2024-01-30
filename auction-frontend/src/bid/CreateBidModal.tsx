import { Col, Container, Form, Row } from 'react-bootstrap'
import Button from 'react-bootstrap/Button'
import Modal from 'react-bootstrap/Modal'
import { Form as RouterForm } from 'react-router-dom'
import { Auction } from '../buy/Auction'
import 'react-datetime-picker/dist/DateTimePicker.css'
import 'react-calendar/dist/Calendar.css'
import 'react-clock/dist/Clock.css'
import { useAuth } from '../auth/AuthProvider'
import { getHighestBid } from '../util/highest-bid-helper'
import { checkIsValidBid } from '../util/validate-bid-helper'
import useRealTimeRemaining from '../util/real-time-remaining-helper'

export async function action({ request }: { request: Request }) {
  const formData = await request.formData()
  const { price, isMaximum, bidder, auction } = Object.fromEntries(formData)
  const parsedAuction: Auction = JSON.parse(auction.toString())

  const body = JSON.stringify({
    price,
    isMaximum,
    bidder,
    auction: parsedAuction.id,
  })

  const isValidBid: boolean = checkIsValidBid(price.toString(), bidder.toString(), parsedAuction)
  if (!isValidBid) {
    return {};
  }

  const res = await fetch(`${process.env.REACT_APP_API_URL}/bids`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: body,
  })
  const bid = await res.json()
  return { bid }
}

export function CreateBidModal({
  auction,
  show,
  onHide,
}: {
  auction: Auction
  show: boolean
  onHide: Function
}) {
  const { user } = useAuth()
  const { currentPrice, highestBid } = getHighestBid(auction)
  const remainingTime = useRealTimeRemaining(auction.terminateAt);

  return (
    <Modal
      show={show}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <RouterForm method="post" onSubmit={() => onHide()}>
        <Modal.Header className="justify-content-center">
          <Modal.Title id="contained-modal-title-vcenter">
            Bid on auction
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <h3>{auction.title}</h3>

          <p>{auction.description}</p>
          <Container>
            <Row className="justify-content-center align-items-center">
              <Col sm={{ span: 5, offset: 1 }}>
                <p>Seller: {auction.seller.name}</p>
                <p>Deadline: {remainingTime}</p>
              </Col>
              <Col sm={{ span: 5, offset: 1 }}>
                <p>
                  Price:{' '}
                  <span style={{ fontSize: '2rem', fontWeight: 'bold' }}>
                    {currentPrice}
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
                  <Form.Label sm={4} column>
                    Your offer
                  </Form.Label>
                  <Col sm={4}>
                    <Form.Control
                      type="number"
                      placeholder="€"
                      name="price"
                      min={currentPrice + 1}
                      defaultValue={currentPrice + 1}
                      required
                    />
                  </Col>
                </Form.Group>
              </Col>
              <Col sm={{ span: 5, offset: 1 }}>
                <Form.Group
                  as={Row}
                  className="mb-3"
                  controlId="formBasicEmail"
                >
                  <Form.Label sm={6} column>
                    Is a maximum offer
                  </Form.Label>
                  <Col sm={4} className="align-self-center">
                    <Form.Check
                      id="custom-switch"
                      name="isMaximum"
                      type="switch"
                    />
                  </Col>
                </Form.Group>
              </Col>
            </Row>
            <Form.Control name="bidder" defaultValue={user?.id} hidden />
            <Form.Control name="auction" defaultValue={JSON.stringify(auction)} hidden />
          </Container>
        </Modal.Body>
        <Modal.Footer className="justify-content-between px-5">
          <Button variant="primary" type="submit">
            Bid
          </Button>
          <Button variant="secondary" type="button" onClick={() => onHide('cancel')}>
            Cancel
          </Button>
        </Modal.Footer>
      </RouterForm>
    </Modal>
  )
}
