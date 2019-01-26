import casual from 'casual'
import { ApolloClient } from 'apollo-client'
import { CurrentUserResponse } from '../__tests__/SignUp.test'
import { CartItemInterface } from '../components/CartItem'
import { CURRENT_USER_QUERY } from '../components/User'

// seed it so we get consistent results
casual.seed(777)

const fakeItem = () => ({
  __typename: 'Item',
  id: 'abc123',
  price: 5000,
  user: null,
  image: 'dog-small.jpg',
  title: 'dogs are best',
  description: 'dogs',
  largeImage: 'dog.jpg',
})

const fakeUser = () => ({
  __typename: 'User',
  id: '4234',
  name: casual.name,
  email: casual.email,
  permissions: ['ADMIN'],
  cart: [],
})

const fakeOrderItem = () => ({
  __typename: 'OrderItem',
  id: casual.uuid,
  image: `${casual.word}.jpg`,
  title: casual.words(),
  price: 4234,
  quantity: 1,
  description: casual.words(),
})

const fakeOrder = () => ({
  __typename: 'Order',
  id: 'ord123',
  charge: 'ch_123',
  total: 40000,
  items: [fakeOrderItem(), fakeOrderItem()],
  createdAt: '2018-04 - 06T19: 24: 16.000Z',
  user: fakeUser(),
})

const fakeCartItem = (overrides?: object): object => ({
  __typename: 'CartItem',
  id: 'omg123',
  quantity: 3,
  item: fakeItem(),
  user: fakeUser(),
  ...overrides,
})

// Fake LocalStorage
class LocalStorageMock {
  store: { [key: string]: any };

  constructor() {
    this.store = {}
  }

  clear() {
    this.store = {}
  }

  getItem(key: string) {
    return this.store[key] || null
  }

  setItem(key: string, value: any) {
    this.store[key] = value.toString()
  }

  removeItem(key: string) {
    delete this.store[key]
  }
}

export const refetchCart = async (
  client: ApolloClient<any>
): Promise<CartItemInterface[]> => {
  const res = await client.query<CurrentUserResponse>({
    query: CURRENT_USER_QUERY,
  })
  return res.data.me.cart
}

export {
  LocalStorageMock,
  fakeItem,
  fakeUser,
  fakeCartItem,
  fakeOrder,
  fakeOrderItem,
}
