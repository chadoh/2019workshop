import React from 'react'
import PropTypes from 'prop-types'
import { Mutation } from 'react-apollo'
import gql from 'graphql-tag'
import styled from 'styled-components'
import { CURRENT_USER_QUERY } from './User'

const BigButton = styled.button`
  font-size: 3rem;
  background: none;
  border: 0;
  &:hover {
    color: ${props => props.theme.red};
    cursor: pointer;
  }
`

export const REMOVE_FROM_CART_MUTATION = gql`
  mutation REMOVE_FROM_CART_MUTATION($id: ID!) {
    removeFromCart(id: $id) {
      id
    }
  }
`

// gets called as soon as we get a response BACK from the server,
// after a mutation has been performed
const updateCache = (cache, payload) => {
  const data = cache.readQuery({ query: CURRENT_USER_QUERY })

  const cartItemId = payload.data.removeFromCart.id
  data.me.cart = data.me.cart.filter(cartItem => cartItem.id !== cartItemId)

  cache.writeQuery({ query: CURRENT_USER_QUERY, data })
}

const RemoveFromCart = ({ id }) => {
  return (
    <Mutation
      mutation={REMOVE_FROM_CART_MUTATION}
      variables={{ id }}
      update={updateCache}
      optimisticResponse={{
        __typename: 'Mutation',
        removeFromCart: {
          __typename: 'CartItem',
          id,
        },
      }}
    >
      {(removeFromCart, { error, loading }) => (
        <BigButton
          title="Delete Item"
          onClick={() => {
            removeFromCart().catch(err =>
              alert(err.message.replace('GraphQL error: ', ''))
            )
          }}
          disabled={loading}
        >
          &times;
        </BigButton>
      )}
    </Mutation>
  )
}

RemoveFromCart.propTypes = {
  id: PropTypes.string.isRequired,
}

export default RemoveFromCart
