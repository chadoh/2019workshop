import React from 'react'
import Link from 'next/link'
import { Query } from 'react-apollo'
import gql from 'graphql-tag'
import { formatDistance } from 'date-fns'
import Head from 'next/head'
import formatMoney from '../lib/formatMoney'
import Error from './ErrorMessage'
import OrderItemStyles from './styles/OrderItemStyles'
import styled from 'styled-components'

const USER_ORDERS_QUERY = gql`
  query USER_ORDERS_QUERY {
    orders(orderBy: createdAt_DESC) {
      id
      total
      createdAt
      items {
        id
        title
        price
        image
        quantity
        description
      }
    }
  }
`

const OrderUl = styled.ul`
  display: grid;
  grid-gap: 4rem;
  grid-template-columns: repeat(auto-fit, minmax(40%, 1fr));
`

const Orders = ({ id }) => (
  <Query query={USER_ORDERS_QUERY}>
    {({ data: { orders }, error, loading}) => {
      if (loading) return "Loading..."
      if (error) return <Error error={error} />
      return (
        <React.Fragment>
          <Head>
            <title>Sick Fits | Order History</title>
          </Head>
          <h2>Order History – {orders.length} orders total</h2>
          {loading && <p>Loading...</p>}
          {error && <Error error={error} />}
          <OrderUl>
            {orders.map(order => (
              <OrderItemStyles key={order.id}>
                <Link
                  href={{
                    pathname: '/order',
                    query: { id: order.id }
                  }}
                >
                  <a>
                    <div className="order-meta">
                      <p>{order.items.reduce((a, b) => a + b.quantity, 0)} Items</p>
                      <p>{order.items.length} Products</p>
                      <p>{formatDistance(new Date(), order.createdAt, 'MMMM, d, YYYY h:mm a')} ago</p>
                      <p>{formatMoney(order.total)}</p>
                    </div>
                    <div className="images">
                      {order.items.map(item => (
                        <img key={item.id} src={item.image} alt={item.title} />
                      ))}
                    </div>
                  </a>
                </Link>
              </OrderItemStyles>
            ))}
          </OrderUl>
        </React.Fragment>
      )
    }}
  </Query>
)

export default Orders
