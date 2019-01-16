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

const REMOVE_FROM_CART = gql`
  mutation REMOVE_FROM_CART($id: ID!) {
    removeFromCart(id: $id) {
      id
    }
  }
`

const RemoveFromCart = ({ id }) => {
  return (
    <Mutation
      mutation={REMOVE_FROM_CART}
      variables={{ id }}
      refetchQueries={[ { query: CURRENT_USER_QUERY } ]}
    >
      {(removeFromCart, { error, loading}) => (
        <BigButton
          title="Delete Item"
          onClick={() => {
            removeFromCart()
              .catch(err =>
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
