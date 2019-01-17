import PleaseSignIn from '../components/PleaseSignIn'
import Order from '../components/Order'

export default ({ query: { id } }) => (
  <PleaseSignIn>
    <Order id={id} />
  </PleaseSignIn>
)
