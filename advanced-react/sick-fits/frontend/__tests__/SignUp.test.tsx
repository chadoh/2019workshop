import { mount, ReactWrapper } from 'enzyme'
import wait from 'waait'
import toJSON from 'enzyme-to-json'
import { ApolloClient } from 'apollo-client'
import { MockedProvider } from 'react-apollo/test-utils'
import { ApolloConsumer } from 'react-apollo'
import SignUp, { SIGNUP_MUTATION } from '../components/SignUp'
import { CURRENT_USER_QUERY } from '../components/User'
import { fakeUser } from '../lib/testUtils'
import { CartItemInterface } from '../components/CartItem'

const type = (wrapper: ReactWrapper, name: string, value: string) => {
  wrapper.find(`input[name="${name}"]`).simulate('change', {
    target: { name, value },
  })
}

const me = fakeUser()
const password = 'cool'

const signupMock = {
  request: {
    query: SIGNUP_MUTATION,
    variables: {
      name: me.name,
      email: me.email,
      password,
    },
  },
  result: {
    data: {
      signup: {
        __typename: 'User',
        id: me.id,
        name: me.name,
        email: me.email,
      },
    },
  },
}

const currentUserMock = {
  request: { query: CURRENT_USER_QUERY },
  result: { data: { me } },
}

export interface UserInterface {
  id: string;
  name: string;
  email: string;
  cart: CartItemInterface[];
}

interface CurrentUserResponse {
  me: UserInterface;
}

describe('<SignUp/>', () => {
  it('renders and matches snapshot', async () => {
    const wrapper = mount(
      <MockedProvider>
        <SignUp />
      </MockedProvider>
    )
    expect(toJSON(wrapper.find('form'))).toMatchSnapshot()
  })

  it('calls the mutation properly', async () => {
    let apolloClient: ApolloClient<any> | undefined
    const wrapper = mount(
      <MockedProvider mocks={[signupMock, currentUserMock]}>
        <ApolloConsumer>
          {client => {
            apolloClient = client
            return <SignUp />
          }}
        </ApolloConsumer>
      </MockedProvider>
    )
    await wait()
    wrapper.update()
    type(wrapper, 'name', me.name)
    type(wrapper, 'email', me.email)
    type(wrapper, 'password', password)
    wrapper.update()
    wrapper.find('form').simulate('submit')
    await wait()
    if (!apolloClient) throw new Error('apolloClient never set')
    const user = await apolloClient.query<CurrentUserResponse>({
      query: CURRENT_USER_QUERY,
    })
    expect(user.data.me).toMatchObject(me)
  })
})
