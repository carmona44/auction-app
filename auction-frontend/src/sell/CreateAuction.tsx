import React, { useState } from 'react'
import { Button, Container, ListGroup } from 'react-bootstrap'
import { Plus } from 'react-bootstrap-icons'
import './CreateAuction.scss'
import { CreateAuctionModal } from './CreateAuctionModal'
import { AuctionTile } from '../buy/Tile'
import { Navigate, useActionData, useLoaderData, useLocation } from 'react-router-dom'
import { Auction } from '../buy/Auction'
import ToastMessage from '../util/Toast'
import { JustLoggedInState } from '../auth/PublicLayout'
import { SellerAuctionModal } from './SellerAuctionModal'

export const loader = async () => {
  const userId = localStorage.getItem('user')
  const auctions = await fetch(
    `${process.env.REACT_APP_API_URL}/auctions/seller/${userId}`,
  ).then((res) => res.json())

  return { auctions }
}

type LoadAuctionData = {
  auctions: Auction[]
}

type CreateAuctionData = {
  auction: Auction
}

export default function CreateAuction() {
  const location = useLocation();
  const [modalShow, setModalShow] = useState(false)
  const { auctions } = useLoaderData() as LoadAuctionData
  const createData = useActionData() as CreateAuctionData
  const { justLoggedIn } = location.state as JustLoggedInState || false
  const [auctionModalShow, setAuctionModalShow] = useState(false)
  const [selected, setSelected] = useState<Auction | null>(null)

  if (!auctions?.length && justLoggedIn) {
    return <Navigate to="/buyer" />
  }

  return (
    <Container>
      <div className="button-container">
        <Button
          variant="outline-light"
          className="fab"
          onClick={() => setModalShow(true)}
        >
          <Plus color="black" size={30} />
        </Button>
      </div>
      <ListGroup>
        {auctions.map((auction) => (
          <div
            key={auction.id}
            onClick={() => {
              setSelected(auction)
              setAuctionModalShow(true)
            }}
          >
            <AuctionTile auction={auction} />
          </div>
        ))}
      </ListGroup>
      {auctionModalShow && (
        <SellerAuctionModal
          auction={selected as Auction}
          show={auctionModalShow}
          onHide={() => setAuctionModalShow(false)}
        />
      )}
      <CreateAuctionModal show={modalShow} onHide={() => setModalShow(false)} />
      <div className="position-absolute" style={{ top: '10vh', right: 10 }}>
        <ToastMessage
          show={!!createData}
          message={`You successfully created on ${createData?.auction?.title}`}
          bg="success"
        />
      </div>
    </Container>
  )
}
