import { mount } from 'enzyme'
import wait from 'waait'
import toJSON from 'enzyme-to-json'
import { ApolloClient } from 'apollo-client'
import { MockedProvider } from 'react-apollo/test-utils'
import { ApolloConsumer } from 'react-apollo'
import RemoveFromCart, {
  REMOVE_FROM_CART_MUTATION,
} from '../components/RemoveFromCart'
import { CURRENT_USER_QUERY } from '../components/User'
import { fakeUser, fakeCartItem, refetchCart } from '../lib/testUtils'

global.alert = console.error

const mocks = [
  {
    request: { query: CURRENT_USER_QUERY },
    result: {
      data: {
        me: {
          ...fakeUser(),
          cart: [fakeCartItem({ id: 'abc123' })],
        },
      },
    },
  },
  {
    request: {
      query: REMOVE_FROM_CART_MUTATION,
      variables: { id: 'abc123' },
    },
    result: {
      data: {
        removeFromCart: {
          __typename: 'CartItem',
          id: 'abc123',
        },
      },
    },
  },
]

describe('<RemoveFromCart/>', () => {
  it('renders and matches snapshot', async () => {
    const wrapper = mount(
      <MockedProvider mocks={mocks}>
        <RemoveFromCart id="abc123" />
      </MockedProvider>
    )
    await wait()
    wrapper.update()
    expect(toJSON(wrapper.find('button'))).toMatchSnapshot()
  })
  it('removes the item from the cart', async () => {
    let apolloClient: ApolloClient<any> | undefined
    const wrapper = mount(
      <MockedProvider mocks={mocks}>
        <ApolloConsumer>
          {client => {
            apolloClient = client
            return <RemoveFromCart id="abc123" />
          }}
        </ApolloConsumer>
      </MockedProvider>
    )
    await wait()
    wrapper.update()

    if (!apolloClient) throw new Error('apolloClient never set')
    expect(await refetchCart(apolloClient)).toHaveLength(1)

    wrapper.find('button').simulate('click')
    await wait()
    expect(await refetchCart(apolloClient)).toHaveLength(0)
  })
})
