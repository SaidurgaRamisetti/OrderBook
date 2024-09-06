
import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Table, Placeholder } from 'react-bootstrap';
import "./App.css"

function OrderBook() {
  const [orderBook, setOrderBook] = useState({
    bids: [],
    asks: []
  });

  useEffect(() => {
    const socket = new WebSocket('wss://api.bitfinex.com/ws/2');

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);

      if (!["unsubscribed", "subscribed"].includes(data.even)) {
        const orderBookUpdate = data[1];

        if (orderBookUpdate.length > 0) {
          const [price, count, amount] = orderBookUpdate;
          if (amount > 0) {

            setOrderBook((prevOrderBook) => ({
              ...prevOrderBook,
              bids: [{ price, amount, count }, ...prevOrderBook.bids].slice(0, 15)
            }));
          } else {

            setOrderBook((prevOrderBook) => ({
              ...prevOrderBook,
              asks: [{ price, amount, count }, ...prevOrderBook.asks].slice(0, 15)
            }));
          }
        }
      }
    };

    socket.onopen = () => {
      socket.send(JSON.stringify({
        event: 'subscribe',
        channel: 'book',
        symbol: 'tBTCUSD'
      }));
    };

    return () => {
      socket.close();
    };
  }, []);

  const limitedBids = orderBook.bids.slice(0, 15);
  const limitedAsks = orderBook.asks.slice(0, 15);

  return (
    <Container fluid>
      <Row>
        <Col xs={12}>
          <Table bordered={false} >

            <thead>
              <tr className=''>  <th colSpan={8} className="text-center">Order Book</th></tr>
              <tr>
                <th>COUNT</th>
                <th>AMOUNT </th>
                <th> TOTAL </th>
                <th>PRICE</th>
                <th>PRICE</th>
                <th> TOTAL </th>
                <th>AMOUNT </th>
                <th>COUNT</th>


              </tr>
            </thead>

            <tbody>

              {limitedBids.map((bid, index) => (

                <tr key={index}>

                  <td>{bid.count}</td>

                  <td>{bid.amount}</td>
                  <td>{bid.amount}</td>
                  <td>{bid.price}</td>

                  <td>{limitedAsks[index] ? limitedAsks[index].price : ''}</td>
                  <td>{limitedAsks[index] ? limitedAsks[index].amount * -1 : ''}</td>
                  <td>{limitedAsks[index] ? limitedAsks[index].amount * -1 : ''}</td>
                  <td>{limitedAsks[index] ? limitedAsks[index].count : ''}</td>
                </tr>

              ))}
            </tbody>
          </Table>
        </Col>
      </Row>

    </Container>
  );
};

export default OrderBook;

