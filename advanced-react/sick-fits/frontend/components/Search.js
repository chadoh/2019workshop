import React from 'react'
import PropTypes from 'prop-types'
import Downshift from 'downshift'
import Router from 'next/router'
import { ApolloConsumer } from 'react-apollo'
import gql from 'graphql-tag'
import debounce from 'lodash.debounce'
import { DropDown, DropDownItem, SearchStyles } from './styles/DropDown'

const SEARCH_ITEMS_QUERY = gql`
  query SEARCH_ITEMS_QUERY($searchTerm: String!) {
    items(where: {
      OR: [
        { title_contains: $searchTerm },
        { description_contains: $searchTerm },
      ]
    }) {
      id
      image
      title
    }
  }
`

export default class AutoComplete extends React.Component {
  state = {
    items: [],
    loading: false,
  }

  onChange = debounce(async (e, client) => {
    if (e.target.value === '') {
      this.setState({ loading: false, items: [] })
    } else {
      this.setState({ loading: true })
      const res = await client.query({
        query: SEARCH_ITEMS_QUERY,
        variables: { searchTerm: e.target.value },
      })
      this.setState({ loading: false, items: res.data.items })
    }
  }, 350)

  render() {
    const { items, loading } = this.state
    return (
      <SearchStyles>
        <div>
          <ApolloConsumer>
            {client => (
              <input
                type="search"
                onChange={e => {
                  e.persist()
                  this.onChange(e, client)
                }}
              />
            )}
          </ApolloConsumer>
          <DropDown>
            {items.map(item => (
              <DropDownItem key={item.id}>
                <img src={item.image} alt="" width="50" />
                {item.title}
              </DropDownItem>
            ))}
          </DropDown>
        </div>
      </SearchStyles>
    )
  }
}
