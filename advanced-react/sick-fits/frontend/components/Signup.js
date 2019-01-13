import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Mutation } from 'react-apollo'
import gql from 'graphql-tag'
import Form from './styles/Form'
import Error from './ErrorMessage'

const SIGNUP_MUTATION = gql`
mutation SIGNUP_MUTATION($email: String!, $name: String!, $password: String!) {
  signup(email: $email, name: $name, password: $password) {
    id
    name
    email
  }
}
`

class Signup extends Component {
  static propTypes = {
  }

  state = {
    name: '',
    password: '',
    email: '',
  }

  saveToState = e => {
    this.setState({ [e.target.name]: e.target.value })
  }

  render() {
    return (
      <Mutation
        mutation={SIGNUP_MUTATION}
        variables={this.state}
      >
        {(signup, { error, loading}) => (
          <Form
            method="post"
            onSubmit={async e => {
              e.preventDefault()
              const res = await signup()
              console.log(res)
              this.setState({ name: '', email: '', password: '' })
            }}
          >
            <fieldset disabled={loading} aria-busy={loading}>
              <h2>Sign up for an account</h2>
              <Error error={error} />
              <label htmlFor="email">
                Email
                <input
                  type="email"
                  name="email"
                  required
                  autoComplete="off"
                  value={this.state.email}
                  onChange={this.saveToState}
                />
              </label>
              <label htmlFor="name">
                Name
                <input
                  type="text"
                  name="name"
                  required
                  autoComplete="off"
                  value={this.state.name}
                  onChange={this.saveToState}
                />
              </label>
              <label htmlFor="password">
                Password
                <input
                  type="password"
                  name="password"
                  required
                  autoComplete="off"
                  value={this.state.password}
                  onChange={this.saveToState}
                />
              </label>
              <button type="submit">Sign Up</button>
            </fieldset>
          </Form>
        )}
      </Mutation>
    )
  }
}

export default Signup
