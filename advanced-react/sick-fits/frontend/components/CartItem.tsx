import React from 'react'
import styled from 'styled-components'
import RemoveFromCart from './RemoveFromCart'
import { ItemInterface } from './Item'
import formatMoney from '../lib/formatMoney'

export interface CartItemInterface {
  id: string;
  quantity: number;
  item: ItemInterface;
}

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
  h3,
  p {
    margin: 0;
  }
`

const CartItem: React.SFC<CartItemInterface> = ({ id, quantity, item }) => {
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
export default CartItem
