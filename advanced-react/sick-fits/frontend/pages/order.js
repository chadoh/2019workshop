import React from 'react'
import PropTypes from 'prop-types'
import PleaseSignIn from '../components/PleaseSignIn'
import Order from '../components/Order'

export default function OrderPage({ query: { id } }) {
  return (
    <PleaseSignIn>
      <Order id={id} />
    </PleaseSignIn>
  )
}

OrderPage.propTypes = {
  query: PropTypes.shape({
    id: PropTypes.string.isRequired
  }).isRequired
}
