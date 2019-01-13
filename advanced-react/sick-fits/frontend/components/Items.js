import React, { Component } from 'react';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';
import styled from 'styled-components';
import Item from './Item'
import Pagination from './Pagination'

export const ALL_ITEMS_QUERY = gql`
  query ALL_ITEMS_QUERY {
    items {
      id
      title
      price
      description
      image
      largeImage
    }
  }
`;

const Center = styled.div`
  text-align: center;
`;

const ItemsList = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-gap: 60px;
  max-width: ${props => props.theme.maxWidth};
  margin: 0 auto;
`;

const Items = ({ page }) => (
  <Center>
    <Pagination page={page} />
    <Query query={ALL_ITEMS_QUERY}>
      {({ data, error, loading}) => {
        if (loading) return <p>loading...</p>;
        if (error) return <p><strong>Error!</strong> {error.message}</p>;

        return <ItemsList>
          {data.items.map(item =>
            <Item key={item.id} item={item} />
          )}
        </ItemsList>
      }}
    </Query>
    <Pagination page={page} />
  </Center>
)

export default Items;
