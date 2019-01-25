import { mount } from 'enzyme'
import wait from 'waait'
import toJSON from 'enzyme-to-json'
import { MockedProvider } from 'react-apollo/test-utils'
import Order, { SINGLE_ORDER_QUERY } from '../components/Order'
import { fakeOrder } from '../lib/testUtils'

const order = fakeOrder()

const mocks = [
  {
    request: { query: SINGLE_ORDER_QUERY, variables: { id: order.id } },
    result: { data: { order } },
  },
]

describe('<Order />', () => {
  it('renders and matches snapshot', async () => {
    const wrapper = mount(
      <MockedProvider mocks={mocks}>
        <Order id={order.id} />
      </MockedProvider>
    )
    await wait()
    wrapper.update()
    const OrderComponent = wrapper.find('div[data-test="order"]')
    expect(toJSON(OrderComponent)).toMatchSnapshot()
  })
})
