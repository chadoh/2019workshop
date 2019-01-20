import React from 'react'
import PleaseSignIn from '../components/PleaseSignIn'
import Orders from '../components/Orders'

export default function OrdersPage() {
  return (
    <PleaseSignIn>
      <Orders />
    </PleaseSignIn>
  )
}
