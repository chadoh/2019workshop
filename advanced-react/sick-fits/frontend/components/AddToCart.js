import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import { Mutation } from 'react-apollo'
import gql from 'graphql-tag'
import Error from './ErrorMessage'
import { CURRENT_USER_QUERY } from './User'

const ADD_TO_CART_MUTATION = gql`
  mutation ADD_TO_CART_MUTATION($id: ID!) {
    addToCart(id: $id) {
      id
      quantity
    }
  }
`

const AddToCart = ({ id }) => (
  <Mutation
    mutation={ADD_TO_CART_MUTATION}
    variables={{ id }}
    refetchQueries={[ { query: CURRENT_USER_QUERY } ]}
  >
    {(addToCart, { error, loading }) => (
      <Fragment>
        <Error error={error} />
        <button
          onClick={addToCart}
          disabled={loading}
        >
          Add{loading && 'ing'} To Cart
        </button>
      </Fragment>
    )}
  </Mutation>
)


AddToCart.propTypes = {
  id: PropTypes.string.isRequired,
}

export default AddToCart
