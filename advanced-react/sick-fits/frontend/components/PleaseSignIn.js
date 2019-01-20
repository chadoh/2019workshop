import React from 'react'
import { Fragment } from 'react'
import PropTypes from 'prop-types'
import { Query } from 'react-apollo'
import { CURRENT_USER_QUERY } from './User'
import Signin from './Signin'

const PleaseSignIn = ({ children }) => (
  <Query query={CURRENT_USER_QUERY}>
    {({ data, loading }) => {
      if (loading) return 'Loading...'
      if (!data.me) {
        return (
          <Fragment>
            <p>Please sign in before continuing!</p>
            <Signin />
          </Fragment>
        )
      }
      return children
    }}
  </Query>
)

PleaseSignIn.propTypes = {
  children: PropTypes.element
}

export default PleaseSignIn
