import React from 'react'
import PropTypes from 'prop-types'
import Items from '../components/Items'

const Home = ({ query }) => (
  <Items page={parseInt(query.page, 10) || 1} />
)

Home.propTypes = {
  query: PropTypes.shape({
    page: PropTypes.string,
  }).isRequired,
}

export default Home
