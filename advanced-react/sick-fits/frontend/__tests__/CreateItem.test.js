import { mount } from 'enzyme'
import wait from 'waait'
import toJSON from 'enzyme-to-json'
import { MockedProvider } from 'react-apollo/test-utils'
import { fakeItem } from '../lib/testUtils'
import CreateItem, { CREATE_ITEM_MUTATION } from '../components/CreateItem'
import Router from 'next/router'

const dogImg = 'https://dog.com/dog.jpg'

// mock the global fetch API
global.fetch = jest.fn().mockResolvedValue({
  json: () => ({
    secure_url: dogImg,
    eager: [{ secure_url: dogImg }],
  }),
})

describe('<CreateItem/>', () => {
  it('renders and matches snapshot', () => {
    const wrapper = mount(
      <MockedProvider>
        <CreateItem />
      </MockedProvider>
    )
    const form = wrapper.find('form')
    expect(toJSON(form)).toMatchSnapshot()
  })

  it('uploads a file when changed', async () => {
    const wrapper = mount(
      <MockedProvider>
        <CreateItem />
      </MockedProvider>
    )
    const input = wrapper.find('input[type="file"]')
    input.simulate('change', { target: { files: ['fakedog.jpg'] } })
    await wait()
    const component = wrapper.find('CreateItem').instance()
    expect(component.state.image).toEqual(dogImg)
    expect(component.state.largeImage).toEqual(dogImg)
    expect(global.fetch).toHaveBeenCalled()
  })

  it('handles state updating', async () => {
    const wrapper = mount(
      <MockedProvider>
        <CreateItem />
      </MockedProvider>
    )
    wrapper
      .find('#title')
      .simulate('change', { target: { value: 'Testing', name: 'title' } })
    wrapper.find('#price').simulate('change', {
      target: { value: '500', name: 'price', type: 'number' },
    })
    wrapper.find('#description').simulate('change', {
      target: { value: 'So nice', name: 'description' },
    })
    expect(wrapper.find('CreateItem').instance().state).toMatchObject({
      title: 'Testing',
      price: 500,
      description: 'So nice',
    })
  })

  it('creates an item when the form is submitted', async () => {
    const item = fakeItem()
    const mocks = [
      {
        request: {
          query: CREATE_ITEM_MUTATION,
          variables: {
            title: item.title,
            description: item.description,
            image: '',
            largeImage: '',
            price: item.price,
          },
        },
        result: {
          data: {
            createItem: {
              ...item,
              __typename: 'Item',
            },
          },
        },
      },
    ]
    const wrapper = mount(
      <MockedProvider mocks={mocks}>
        <CreateItem />
      </MockedProvider>
    )
    wrapper
      .find('#title')
      .simulate('change', { target: { value: item.title, name: 'title' } })
    wrapper.find('#price').simulate('change', {
      target: { value: `${item.price}`, name: 'price', type: 'number' },
    })
    wrapper.find('#description').simulate('change', {
      target: { value: item.description, name: 'description' },
    })
    Router.router = { push: jest.fn() }
    wrapper.find('form').simulate('submit')
    await wait(50)
    expect(Router.router.push).toHaveBeenCalledWith({
      pathname: '/item',
      query: { id: item.id },
    })
  })
})
