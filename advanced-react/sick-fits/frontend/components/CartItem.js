import React from 'react'
import PropTypes from 'prop-types'
import RemoveFromCart from './RemoveFromCart'
import formatMoney from '../lib/formatMoney'
import styled from 'styled-components'

const CartItemStyles = styled.li`
  padding: 1rem 0;
  border-bottom: 1px solid ${props => props.theme.lightgrey};
  display: grid;
  align-items: center;
  grid-template-columns: auto 1fr auto;
  grid-gap: 1em;
  img {
    width: 7em;
  }
  h3, p {
    margin: 0;
  }
`

const CartItem = ({ id, quantity, item }) => {
  return (
    <CartItemStyles>
      <img src={item.image} alt="" />
      <div className="cart-item-details">
        <h3>{item.title}</h3>
        <p>
          {formatMoney(item.price * quantity)}
          {' – '}
          <em>
            {quantity} &times; {formatMoney(item.price)} each
          </em>
        </p>
      </div>
      <RemoveFromCart id={id} />
    </CartItemStyles>
  )
}

CartItem.propTypes = {
  id: PropTypes.string.isRequired,
  quantity: PropTypes.number.isRequired,
  item: PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    image: PropTypes.string.isRequired,
    price: PropTypes.number.isRequired,
  }).isRequired,
}

export default CartItem
