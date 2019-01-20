import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import { Query, Mutation } from 'react-apollo'
import gql from 'graphql-tag'
import Error from './ErrorMessage'
import Table from './styles/Table'

const possiblePermissions = [
  'ADMIN',
  'USER',
  'ITEMCREATE',
  'ITEMUPDATE',
  'ITEMDELETE',
  'PERMISSIONUPDATE'
]

const UPDATE_PERMISSIONS_MUTATION = gql`
  mutation UPDATE_PERMISSIONS_MUTATION(
    $permissions: [Permission!]!
    $userId: ID!
  ) {
    updatePermissions(permissions: $permissions, userId: $userId) {
      id
      permissions
      name
      email
    }
  }
`

const ALL_USERS_QUERY = gql`
  query ALL_USERS_QUERY {
    users {
      id
      name
      email
      permissions
    }
  }
`

export default function Permissions() {
  return (
    <Query query={ALL_USERS_QUERY}>
      {({ data, error, loading }) => {
        if (loading) return 'Loading...'
        return (
          <Fragment>
            <Error error={error} />
            <h2>Manage Permissions</h2>
            <Table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  {possiblePermissions.map(permission => (
                    <th key={permission}>{permission}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data.users.map(user => (
                  <UserPermissions key={user.id} {...user} />
                ))}
              </tbody>
            </Table>
          </Fragment>
        )
      }}
    </Query>
  )
}

const changePermissions = (
  updatePermissions,
  userId,
  currentPermissions
) => e => {
  const checkbox = e.target
  let updatedPermissions = [...currentPermissions]
  if (checkbox.checked) {
    updatedPermissions.push(checkbox.value)
  } else {
    updatedPermissions = updatedPermissions.filter(p => p !== checkbox.value)
  }

  updatePermissions({
    variables: {
      userId: userId,
      permissions: updatedPermissions
    }
  })
}

const UserPermissions = ({ id, name, email, permissions }) => (
  <Mutation
    mutation={UPDATE_PERMISSIONS_MUTATION}
    refetchQueries={[{ query: ALL_USERS_QUERY }]}
  >
    {(updatePermissions, { error }) => (
      <Fragment>
        {error && (
          <tr>
            <td colSpan="9">
              <Error error={error} />
            </td>
          </tr>
        )}
        <tr>
          <td>{name}</td>
          <td>{email}</td>
          {possiblePermissions.map(permission => (
            <td key={permission}>
              <label htmlFor={`${id}-permission-${permission}`}>
                <input
                  id={`${id}-permission-${permission}`}
                  type="checkbox"
                  value={permission}
                  defaultChecked={permissions.includes(permission)}
                  onChange={changePermissions(
                    updatePermissions,
                    id,
                    permissions
                  )}
                />
              </label>
            </td>
          ))}
        </tr>
      </Fragment>
    )}
  </Mutation>
)

UserPermissions.propTypes = {
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  email: PropTypes.string.isRequired,
  permissions: PropTypes.array.isRequired
}
