import { mount } from 'enzyme'
import wait from 'waait'
import toJSON from 'enzyme-to-json'
import Router from 'next/router'
import Pagination, { PAGINATION_QUERY } from '../components/Pagination'
import { CURRENT_USER_QUERY } from '../components/User'
import { MockedProvider } from 'react-apollo/test-utils'

Router.router = {
  push() {},
  prefetch() {},
}

function makeMocksFor(length) {
  return [
    {
      request: { query: PAGINATION_QUERY },
      result: {
        data: {
          itemsConnection: {
            __typename: 'aggregate',
            aggregate: {
              __typename: 'count',
              count: length,
            },
          },
        },
      },
    },
  ]
}

async function wrapperWith({ items, page, loaded = true }) {
  const wrapper = mount(
    <MockedProvider mocks={makeMocksFor(items)}>
      <Pagination page={page} />
    </MockedProvider>
  )
  if (!loaded) return wrapper

  await wait()
  wrapper.update()
  return wrapper
}

describe('pagination', () => {
  it('displays a loading message', async () => {
    const wrapper = await wrapperWith({ items: 1, page: 1, loaded: false })
    expect(wrapper.text()).toContain('Loading')
  })
  it('renders pagination for 18 items', async () => {
    const wrapper = await wrapperWith({ items: 18, page: 1 })
    expect(wrapper.find('.totalPages').text()).toEqual('5')
    const pagination = wrapper.find('div[data-test="pagination"]')
    expect(toJSON(pagination)).toMatchSnapshot()
  })
  it('disabled prev button on first page', async () => {
    const wrapper = await wrapperWith({ items: 18, page: 1 })
    expect(wrapper.find('a.prev').prop('aria-disabled')).toEqual(true)
    expect(wrapper.find('a.next').prop('aria-disabled')).toEqual(false)
  })
  it('disables next button on last page', async () => {
    const wrapper = await wrapperWith({ items: 18, page: 5 })
    expect(wrapper.find('a.prev').prop('aria-disabled')).toEqual(false)
    expect(wrapper.find('a.next').prop('aria-disabled')).toEqual(true)
  })
  it('enables all buttons on middle page', async () => {
    const wrapper = await wrapperWith({ items: 18, page: 3 })
    expect(wrapper.find('a.prev').prop('aria-disabled')).toEqual(false)
    expect(wrapper.find('a.next').prop('aria-disabled')).toEqual(false)
  })
})
