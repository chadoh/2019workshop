import React from 'react'
import PropTypes from 'prop-types'
import { Query } from 'react-apollo'
import gql from 'graphql-tag'
import { format } from 'date-fns'
import Head from 'next/head'
import formatMoney from '../lib/formatMoney'
import Error from './ErrorMessage'
import OrderStyles from './styles/OrderStyles'

export const SINGLE_ORDER_QUERY = gql`
  query SINGLE_ORDER_QUERY($id: ID!) {
    order(id: $id) {
      id
      charge
      total
      createdAt
      items {
        id
        title
        image
        price
        quantity
        description
      }
    }
  }
`

const Order = ({ id }) => (
  <Query query={SINGLE_ORDER_QUERY} variables={{ id }}>
    {({ data: { order }, error, loading }) => {
      if (loading) return 'Loading...'
      if (error) return <Error error={error} />
      return (
        <OrderStyles data-test="order">
          <Head>
            <title>Sick Fits | Order {order.id}</title>
          </Head>
          <p>
            <span>Order ID:</span>
            <span>{id}</span>
          </p>
          <p>
            <span>Charge:</span>
            <span>{order.charge}</span>
          </p>
          <p>
            <span>Date:</span>
            <span>{format(order.createdAt, 'MMMM, d, YYYY h:mm a')}</span>
          </p>
          <p>
            <span>Order Total</span>
            <span>{formatMoney(order.total)}</span>
          </p>
          <p>
            <span>Item Count</span>
            <span>{order.items.length}</span>
          </p>
          <div className="items">
            {order.items.map(item => (
              <div key={item.id} className="order-item">
                <img src={item.image} alt="" />
                <div className="item-details">
                  <h2>{item.title}</h2>
                  <p>Qty: {item.quantity}</p>
                  <p>Each: {formatMoney(item.price)}</p>
                  <p>Subtotal: {formatMoney(item.price * item.quantity)}</p>
                  <p>{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </OrderStyles>
      )
    }}
  </Query>
)

Order.propTypes = {
  id: PropTypes.string.isRequired,
}

export default Order
