import React from 'react'
import Downshift, { resetIdCounter } from 'downshift'
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

const routeToItem = item => {
  Router.push({
    pathname: '/item',
    query: { id: item.id },
  })
}

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
    resetIdCounter()
    return (
      <SearchStyles>
        <Downshift
          itemToString={
            item => (item === null ? '' : item.title)
          }
          onChange={routeToItem}
        >
          {({
            getInputProps,
            getItemProps,
            isOpen,
            inputValue,
            highlightedIndex
          }) => (
            <div>
              <ApolloConsumer>
                {client => (
                  <input
                    {...getInputProps({
                      type: 'search',
                      placeholder: 'Search for an item',
                      id: 'search',
                      className: this.state.loading ? 'loading' : '',
                      onChange: e => {
                        e.persist()
                        this.onChange(e, client)
                      }
                    })}
                  />
                )}
              </ApolloConsumer>
              {isOpen &&
                <DropDown>
                  {items.map((item, index) => (
                    <DropDownItem
                      {...getItemProps({ item })}
                      key={item.id}
                      highlighted={index === highlightedIndex}
                    >
                      <img src={item.image} alt="" width="50" />
                      {item.title}
                    </DropDownItem>
                  ))}
                  {!this.state.items.length && !loading &&
                    <DropDownItem>Nothing Found</DropDownItem>
                  }
                </DropDown>
              }
            </div>
          )}
        </Downshift>
      </SearchStyles>
    )
  }
}
