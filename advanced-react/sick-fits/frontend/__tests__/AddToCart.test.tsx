import { mount } from 'enzyme'
import wait from 'waait'
import toJSON from 'enzyme-to-json'
import { MockedProvider } from 'react-apollo/test-utils'
import { ApolloClient } from 'apollo-client'
import { ApolloConsumer } from 'react-apollo'
import AddToCart, { ADD_TO_CART_MUTATION } from '../components/AddToCart'
import { CURRENT_USER_QUERY } from '../components/User'
import {
  fakeUser,
  fakeItem,
  fakeCartItem,
  refetchCart,
} from '../lib/testUtils'

const item = fakeItem()
const cartItem = fakeCartItem()

const mocks = [
  {
    request: { query: CURRENT_USER_QUERY },
    result: {
      data: {
        me: {
          ...fakeUser(),
          cart: [],
        },
      },
    },
  },
  {
    request: {
      query: ADD_TO_CART_MUTATION,
      variables: { id: item.id },
    },
    result: {
      data: {
        addToCart: {
          ...item,
          quantity: 1,
        },
      },
    },
  },
  {
    request: { query: CURRENT_USER_QUERY },
    result: {
      data: {
        me: {
          ...fakeUser(),
          cart: [cartItem],
        },
      },
    },
  },
]

describe('<AddToCart />', () => {
  it('renders and matches snapshot', async () => {
    const wrapper = mount(
      <MockedProvider mocks={mocks}>
        <AddToCart id={item.id} />
      </MockedProvider>
    )
    await wait()
    wrapper.update()
    expect(toJSON(wrapper.find('button'))).toMatchSnapshot()
  })

  it('adds an item to cart when clicked', async () => {
    let apolloClient: ApolloClient<any> | undefined
    const wrapper = mount(
      <MockedProvider mocks={mocks}>
        <ApolloConsumer>
          {client => {
            apolloClient = client
            return <AddToCart id={item.id} />
          }}
        </ApolloConsumer>
      </MockedProvider>
    )
    await wait()
    wrapper.update()

    if (!apolloClient) throw new Error('apolloClient never set')
    expect(await refetchCart(apolloClient)).toHaveLength(0)

    wrapper.find('button').simulate('click')
    await wait()
    expect(await refetchCart(apolloClient)).toHaveLength(1)
  })

  it('changes from add to adding when clicked', async () => {
    const wrapper = mount(
      <MockedProvider mocks={mocks}>
        <AddToCart id={item.id} />
      </MockedProvider>
    )
    await wait()
    wrapper.update()
    expect(wrapper.text()).toContain('Add To Cart')

    wrapper.find('button').simulate('click')
    wrapper.update()
    expect(wrapper.text()).toContain('Adding To Cart')
  })
})
