import ItemComponent from '../components/Item'
import { shallow } from 'enzyme'

const fakeItem = {
  id: 'ABC123',
  title: 'A Cool Item',
  price: 5000,
  description: 'Very cool, awesome',
  image: 'dog.jpg',
  largeImage: 'dog.xl.jpg'
}

const wrapper = shallow(<ItemComponent item={fakeItem} />)

describe('<Item/>', () => {
  it('renders the price and title', () => {
    const PriceTag = wrapper.find('PriceTag')
    expect(PriceTag.children().text()).toBe('$50')

    expect(wrapper.find('Title a').text()).toBe(fakeItem.title)
  })

  it('renders the image', () => {
    const img = wrapper.find('img')
    expect(img.props().src).toBe(fakeItem.image)
    expect(img.props().alt).toBe('')
  })

  it('renders the buttons', () => {
    const buttonList = wrapper.find('.buttonList')
    expect(buttonList.children()).toHaveLength(3)
    expect(buttonList.find('Link')).toHaveLength(1)
    expect(buttonList.find('AddToCart').exists()).toBe(true)
    expect(buttonList.find('DeleteItem').exists()).toBe(true)
  })
})
