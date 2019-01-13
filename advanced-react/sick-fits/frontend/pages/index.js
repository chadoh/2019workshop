import Items from '../components/Items'

const Home = ({ query }) => (
  <Items page={parseInt(query.page, 10) || 1} />
)

export default Home
