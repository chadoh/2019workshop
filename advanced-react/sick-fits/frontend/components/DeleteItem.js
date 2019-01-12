import React from 'react'
import PropTypes from 'prop-types'
import { Mutation } from 'react-apollo'
import gql from 'graphql-tag'
import { ALL_ITEMS_QUERY } from './Items'

const DELETE_ITEM_MUTATION = gql`
  mutation DELETE_ITEM_MUTATION($id: ID!) {
    deleteItem(id: $id) {
      id
    }
  }
`

const updateCache = (cache, payload) => {
  const data = cache.readQuery({ query: ALL_ITEMS_QUERY })
  data.items = data.items.filter(i => i.id !== payload.data.deleteItem.id)
  cache.writeQuery({ query: ALL_ITEMS_QUERY, data })
}

const DeleteItem = ({ id }) => (
  <Mutation
    mutation={DELETE_ITEM_MUTATION}
    variables={{ id }}
    update={updateCache}
  >
    {(deleteItem, { error, loading }) => {
      return <button onClick={() => {
        if (confirm('Are you sure you want to delete this item?')) {
          deleteItem()
        }
      }}>
        Delete Item
      </button>
    }}
  </Mutation>
)

DeleteItem.propTypes = {
  id: PropTypes.string.isRequired,
}

export default DeleteItem
