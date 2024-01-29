import React, { useEffect, useState } from 'react'
import { useActionData, useLoaderData } from 'react-router-dom'
import { Auction } from './Auction'
import { AuctionTile } from './Tile'
import { Container, Spinner, ToastContainer } from 'react-bootstrap'
import InfiniteScroll from 'react-infinite-scroll-component'
import { CreateBidModal } from '../bid/CreateBidModal'
import { Bid } from '../bid/bid'
import ToastMessage from '../util/Toast'

export const loader = async () => {
  const userId = localStorage.getItem('user')
  const auctions = await fetch(
    `${process.env.REACT_APP_API_URL}/auctions/buyer/${userId}?page=0&limit=20`,
  ).then((res) => res.json())

  return { auctions }
}

type LoadAuctionData = {
  auctions: Auction[]
}

type CreateBidData = {
  bid: Bid
}

export default function AuctionDashboard() {
  const { auctions } = useLoaderData() as LoadAuctionData
  const createData = useActionData() as CreateBidData
  const [data, setData] = useState<Auction[]>([])
  const [page, setPage] = useState(0)
  const [hasMore, setHasMore] = useState(true)
  const [modalShow, setModalShow] = useState(false)
  const [selected, setSelected] = useState<Auction | null>(null)
  const [toastId, setToastId] = useState(0);

  const handleHideModal = (event: string) => {
    setModalShow(false);
    if (event !== 'cancel') {
      setToastId(Date.now());
    }
  };

  useEffect(() => {
    setData(auctions)
  }, [auctions])

  const next = async () => {
    const userId = localStorage.getItem('user')
    const nextPage = page + 1
    setPage(nextPage)
    const nextData: Auction[] = await fetch(
      `${process.env.REACT_APP_API_URL}/auctions/buyer/${userId}?page=${nextPage}&limit=20`,
    ).then((res) => res.json())
    setData([...data, ...nextData])
    if (nextData.length < 20) setHasMore(false)
  }

  return (
    <Container>
      {data.length && (
        <div className="mt-3 mb-1">
          <strong>{data.length}</strong> auctions found:
        </div>
      )}
      <InfiniteScroll
        dataLength={data.length}
        next={next}
        height={600}
        hasMore={hasMore}
        loader={
          <div className="d-flex justify-content-center">
            <Spinner animation="grow" />
          </div>
        }
        endMessage={
          <p style={{ textAlign: 'center' }}>
            <b>You have seen it all</b>
          </p>
        }
      >
        {data.map((auction) => (
          <div
            key={auction.id}
            onClick={() => {
              setSelected(auction)
              setModalShow(true)
            }}
          >
            <AuctionTile auction={auction} />
          </div>
        ))}
      </InfiniteScroll>
      {modalShow && (
        <CreateBidModal
          auction={selected as Auction}
          show={modalShow}
          onHide={handleHideModal}
        />
      )}
      <ToastMessage
        id={toastId}
        message={createData?.bid ? `You successfully created on ${selected?.title}` : 'Invalid bid'}
        bg={createData?.bid ? "success" : "danger"}
      />
    </Container>
  )
}
