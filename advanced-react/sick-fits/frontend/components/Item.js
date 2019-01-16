import React from 'react';
import PropTypes from 'prop-types';
import Link from 'next/link'
import DeleteItem from './DeleteItem';
import Title from './styles/Title';
import ItemStyles from './styles/ItemStyles';
import PriceTag from './styles/PriceTag';
import formatMoney from '../lib/formatMoney';
import AddToCart from './AddToCart'

function Item({item}) {
  return <ItemStyles>
    {item.image && <img src={item.image} alt="" />}
    <Title>
      <Link href={{
        pathname: '/item',
        query: { id: item.id },
      }}>
        <a>{item.title}</a>
      </Link>
    </Title>
    <PriceTag>{formatMoney(item.price)}</PriceTag>
    <p>{item.description}</p>

    <div className="buttonList">
      <Link href={{
        pathname: 'update',
        query: { id: item.id },
      }}>
        <a>Edit ✏️</a>
      </Link>
      <AddToCart id={item.id} />
      <DeleteItem id={item.id} />
    </div>
  </ItemStyles>;
}

Item.propTypes = {
  item: PropTypes.object.isRequired,
};

export default Item;
