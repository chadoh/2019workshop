import { CartItemInterface } from '../components/CartItem'

export default function calcTotalPrice(cart: CartItemInterface[]) {
  return cart.reduce((tally, cartItem) => {
    if (!cartItem.item) return tally
    return tally + cartItem.quantity * cartItem.item.price
  }, 0)
}
