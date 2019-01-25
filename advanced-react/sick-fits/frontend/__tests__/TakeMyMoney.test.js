import { mount } from 'enzyme'
import wait from 'waait'
import toJSON from 'enzyme-to-json'
import NProgress from 'nprogress'
import Router from 'next/router'
import { ApolloClient } from 'apollo-client'
import { MockedProvider } from 'react-apollo/test-utils'
import { ApolloConsumer } from 'react-apollo'
import TakeMyMoney, { CREATE_ORDER_MUTATION } from '../components/TakeMyMoney'
import { CURRENT_USER_QUERY } from '../components/User'
import { fakeUser, fakeCartItem, refetchCart } from '../lib/testUtils'

Router.router = { push() {} }

const mocks = [
  {
    request: { query: CURRENT_USER_QUERY },
    result: {
      data: {
        me: {
          ...fakeUser(),
          cart: [fakeCartItem()],
        },
      },
    },
  },
]

describe('<TakeMyMoney/>', () => {
  it('it renders and matches snapshot', async () => {
    const wrapper = mount(
      <MockedProvider mocks={mocks}>
        <TakeMyMoney />
      </MockedProvider>
    )
    await wait()
    wrapper.update()
    expect(toJSON(wrapper.find('ReactStripeCheckout'))).toMatchSnapshot()
  })

  it('creates an order', async () => {
    const createOrderMock = jest.fn().mockResolvedValue({
      data: { createOrder: { id: 'zyx987' } },
    })
    const wrapper = mount(
      <MockedProvider mocks={mocks}>
        <TakeMyMoney />
      </MockedProvider>
    )
    const component = wrapper.find('TakeMyMoney').instance()
    const token = 'abc123'
    component.handlePayment({ id: token }, createOrderMock)
    expect(createOrderMock).toHaveBeenCalled()
    expect(createOrderMock).toHaveBeenCalledWith({ variables: { token } })
  })

  it('turns the progress bar on', async () => {
    const wrapper = mount(
      <MockedProvider mocks={mocks}>
        <TakeMyMoney />
      </MockedProvider>
    )
    await wait()
    wrapper.update()
    NProgress.start = jest.fn()
    const createOrderMock = jest.fn().mockResolvedValue({
      data: { createOrder: { id: 'zyx987' } },
    })
    const component = wrapper.find('TakeMyMoney').instance()
    const token = 'abc123'
    component.handlePayment({ id: token }, createOrderMock)
    expect(NProgress.start).toHaveBeenCalled()
  })

  it('routes to the order page when completed', async () => {
    const createOrderMock = jest.fn().mockResolvedValue({
      data: { createOrder: { id: 'zyx987' } },
    })
    const wrapper = mount(
      <MockedProvider mocks={mocks}>
        <TakeMyMoney />
      </MockedProvider>
    )
    const component = wrapper.find('TakeMyMoney').instance()
    const token = 'abc123'
    Router.router.push = jest.fn()
    component.handlePayment({ id: token }, createOrderMock)
    await wait()
    expect(Router.router.push).toHaveBeenCalledWith({
      pathname: '/order',
      query: { id: 'zyx987' },
    })
  })
})
