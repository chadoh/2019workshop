import Link from 'next/link';
import { Mutation } from 'react-apollo'
import gql from 'graphql-tag'
import NavStyles from './styles/NavStyles';
import User, { CURRENT_USER_QUERY } from './User';
import { TOGGLE_CART_MUTATION } from './Cart'

const SIGNOUT_MUTATION = gql`
  mutation SIGNOUT_MUTATION {
    signout
  }
`

const Nav = () => (
  <User>
    {({ data: { me } }) => (
      <NavStyles>
        <Link href="/items">
          <a>Shop</a>
        </Link>

        {me && (
          <React.Fragment>
            <Link href="/sell">
              <a>Sell</a>
            </Link>
            <Link href="/orders">
              <a>Orders</a>
            </Link>
            <Link href="/me">
              <a>Account</a>
            </Link>
            <Mutation
              mutation={SIGNOUT_MUTATION}
              refetchQueries={[ { query: CURRENT_USER_QUERY } ]}
            >
              {signout => <button onClick={signout}>Sign Out</button>}
            </Mutation>
            <Mutation mutation={TOGGLE_CART_MUTATION}>
              {toggleCart => <button onClick={toggleCart}>Toggle Cart</button>}
            </Mutation>
          </React.Fragment>
        )}

        {!me && (
          <Link href="/signup">
            <a>Sign In</a>
          </Link>
        )}
      </NavStyles>
    )}
  </User>
);

export default Nav;
