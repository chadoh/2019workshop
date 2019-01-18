const { forwardTo } = require('prisma-binding')
const { hasPermission } = require('../utils')

const Query = {
  items: forwardTo('db'),
  item: forwardTo('db'),
  itemsConnection: forwardTo('db'),
  me(parent, args, ctx, info) {
    if (!ctx.request.userId) return null

    return ctx.db.query.user({
      where: { id: ctx.request.userId },
    }, info)
  },
  async users(parent, args,ctx, info) {
    if (!ctx.request.userId) {
      throw new Error('You must be logged in to do that.')
    }

    const user = await ctx.db.query.user({
      where: { id: ctx.request.userId }
    }, '{ permissions }')

    hasPermission(user, ['ADMIN', 'PERMISSIONUPDATE'])

    return ctx.db.query.users({}, info)
  },
  async order(parent, { id }, ctx, info) {
    if (!ctx.request.userId) {
      throw new Error('You must be logged in.')
    }

    // fetch order's user for permissions check
    const order = await ctx.db.query.order(
      { where: { id }},
      '{ user { id } }'
    )
    if (!order) {
      throw new Error('No order found for given id!')
    }

    const ownsOrder = order.user.id == ctx.request.userId
    const hasPermissionsToSeeOrder = ctx.request.user.permissions.includes('ADMIN')
    if (!ownsOrder && !hasPermissionsToSeeOrder) {
      throw new Error("You're not allowed to see this.")
    }

    // return order with fields requested by user
    return ctx.db.query.order(
      { where: { id }},
      info
    )

  },
  orders(parent, args, ctx, info) {
    if (!ctx.request.userId) {
      throw new Error('You must be logged in.')
    }

    return ctx.db.query.orders({
      where: {
        user: { id: ctx.request.userId }
      }
    }, info)
  },
};

module.exports = Query;
