import React from 'react'
import PropTypes from 'prop-types'
import { Query } from 'react-apollo'
import gql from 'graphql-tag'
import styled from 'styled-components'
import Head from 'next/head'
import Error from './ErrorMessage'

const SingleItemStyles = styled.div`
  max-width: 1200px;
  margin: 2rem auto;
  box-shadow: ${props => props.theme.bs};
  display: grid;
  grid-auto-columns: 1fr;
  grid-auto-flow: column;
  grid-gap: 1em;
  img {
    width: 100%;
  }
`

const SINGLE_ITEM_QUERY = gql`
  query SINGLE_ITEM_QUERY($id: ID!) {
    item(where: { id: $id }) {
      id
      title
      price
      description
      largeImage
    }
  }
`

const SingleItem = ({ id }) => (
  <Query
    query={SINGLE_ITEM_QUERY}
    variables={{ id }}
  >
    {({ loading, error, data: { item } }) => {
      if (loading) return "Loading..."
      if (error) return <Error error={error} />
      if (!item) return `No item found for ID ${id}`
      return (
        <SingleItemStyles>
          <Head>
            <title>Sick Fits | {item.title}</title>
          </Head>
          <img src={item.largeImage} alt="" />
          <div className="details">
            <h2>Viewing {item.title}</h2>
            <p>{item.description}</p>
          </div>
        </SingleItemStyles>
      )
    }}
  </Query>
)

SingleItem.propTypes = {
  id: PropTypes.string.isRequired,
}

export default SingleItem
