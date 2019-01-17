import React, { Component } from 'react'
import PropTypes from 'prop-types'
import StripeCheckout from 'react-stripe-checkout'
import { Mutation } from 'react-apollo'
import gql from 'graphql-tag'
import Router from 'next/router'
import NProgress from 'nprogress'
import calcTotalPrice from '../lib/calcTotalPrice'
import Error from './ErrorMessage'
import User, { CURRENT_USER_QUERY } from './User'

const CREATE_ORDER_MUTATION = gql`
  mutation CREATE_ORDER_MUTATION($token: String!) {
    createOrder(token: $token) {
      id
      charge
      total
      items {
        id
        title
      }
    }
  }
`

const totalItems = cart => cart.reduce(
  (tally, cartItem) => tally + cartItem.quantity,
  0
)

const handlePayment = createOrder => async res => {
  NProgress.start()
  const order = await createOrder({ variables: { token: res.id } })
    .catch(err => { alert(err.message.replace('GraphQL error: ', '')) })
  Router.push({
    pathname: '/order',
    query: { id: order.data.createOrder.id },
  })
}

export default class TakeMyMoney extends Component {
  static propTypes = {
    children: PropTypes.node,
  }

  render() {
    return (
      <User>
        {({ data: { me }}) => (
          <Mutation
            mutation={CREATE_ORDER_MUTATION}
            variables={this.state}
            refetchQueries={[ { query: CURRENT_USER_QUERY } ]}
          >
            {(createOrder, { error, loading }) => (
              <StripeCheckout
                amount={calcTotalPrice(me.cart)}
                name="Sick Fits"
                description={`Order of ${totalItems(me.cart)} items`}
                image={me.cart[0] && me.cart[0].item.image}
                stripeKey="pk_test_W5SgLvL6jpajaWwWKCk06IeN"
                currency="USD"
                email={me.email}
                token={handlePayment(createOrder)}
              >
                {this.props.children}
              </StripeCheckout>
            )}
          </Mutation>
        )}
      </User>
    )
  }
}
