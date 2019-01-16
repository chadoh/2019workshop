import React from 'react'
import PropTypes from 'prop-types'
import { Mutation } from 'react-apollo'
import gql from 'graphql-tag'
import { ALL_ITEMS_QUERY } from './Items'
import { CURRENT_USER_QUERY } from './User'

const DELETE_ITEM_MUTATION = gql`
  mutation DELETE_ITEM_MUTATION($id: ID!) {
    deleteItem(id: $id) {
      id
    }
  }
`

const DeleteItem = ({ id }) => (
  <Mutation
    mutation={DELETE_ITEM_MUTATION}
    variables={{ id }}
    refetchQueries={[
      { query: CURRENT_USER_QUERY },
      { query: ALL_ITEMS_QUERY },
    ]}
  >
    {(deleteItem, { error, loading }) => {
      return (
        <button
          onClick={() => {
            if (confirm('Are you sure you want to delete this item?')) {
              deleteItem().catch(err => {
                alert(err.message.replace('GraphQL error: ', ''))
              })
            }
          }}
        >
          Delete Item
        </button>
      )
    }}
  </Mutation>
)

DeleteItem.propTypes = {
  id: PropTypes.string.isRequired,
}

export default DeleteItem
