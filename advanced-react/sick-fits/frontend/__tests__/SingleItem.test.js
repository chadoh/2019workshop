import { mount } from 'enzyme'
import toJSON from 'enzyme-to-json'
import wait from 'waait'
import SingleItem, { SINGLE_ITEM_QUERY } from '../components/SingleItem'
import { MockedProvider } from 'react-apollo/test-utils'
import { fakeItem } from '../lib/testUtils'

describe('<SingleItem/>', () => {
  it('renders with proper data', async () => {
    const mocks = [
      {
        request: { query: SINGLE_ITEM_QUERY, variables: { id: '123' } },
        result: {
          data: {
            item: fakeItem(),
          },
        },
      },
    ]
    const wrapper = mount(
      <MockedProvider mocks={mocks}>
        <SingleItem id="123" />
      </MockedProvider>
    )
    expect(wrapper.text()).toContain('Loading...')
    await wait()
    wrapper.update()
    expect(toJSON(wrapper.find('h2'))).toMatchSnapshot()
    expect(toJSON(wrapper.find('img'))).toMatchSnapshot()
    expect(toJSON(wrapper.find('p'))).toMatchSnapshot()
  })

  it('Errors when item not found', async () => {
    const mocks = [
      {
        request: { query: SINGLE_ITEM_QUERY, variables: { id: '123' } },
        result: { errors: [{ message: 'Item Not Found!' }] },
      },
    ]
    const wrapper = mount(
      <MockedProvider mocks={mocks}>
        <SingleItem id="123" />
      </MockedProvider>
    )
    await wait()
    wrapper.update()
    const item = wrapper.find('[data-test="graphql-error"]')
    expect(toJSON(item)).toMatchSnapshot()
  })
})